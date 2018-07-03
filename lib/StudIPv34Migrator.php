<?php

namespace Cliqr;

use Cliqr\DB\Assignment;
use Cliqr\DB\Response;
use Cliqr\DB\Task;

class StudIPv34Migrator
{
    private $debug;

    public function __construct($debug = false)
    {
        $this->debug = $debug;
    }

    public function migrate()
    {
        $dbh = \DBManager::get();

        try {
            $dbh->beginTransaction();

            $this->migrateActivations();

            $this->debug ? $dbh->rollBack() : $dbh->commit();
        } catch (\Exception $e) {
            $dbh->rollBack();
            throw $e;
        }
    }

    // ***** PRIVATE HELPERS *****
    private function migrateActivations()
    {
        $ranges = $this->getActivatedRanges();
        foreach ($ranges as $range) {
            foreach ($this->getQuestionnaires($range) as $questionnaire) {
                $task = $this->migrateQuestionnaire($range, $questionnaire);
                if ($this->debug) {
                    $this->printTask($task);
                }
                $this->unassignQuestionnaire($questionnaire, $range);
            }
        }
    }

    private function getActivatedRanges()
    {
        // Stud.IP v4.2+
        if (is_callable([\StudipVersion::class, 'getStudipVersion']) &&
            !\StudipVersion::olderThan('4.2')
        ) {
            return $this->getActivations42();
        }

        // older than v4.2
        $activations = $this->getActivations();
        $ranges = [];
        foreach ($activations as $activation) {
            if ($range = $this->getRangeFromActivation($activation)) {
                $ranges[] = $range;
            }
        }

        return $ranges;
    }

    private function getActivations42()
    {
        $pluginInfo = \PluginManager::getInstance()->getPluginInfo('CliqrPlugin');
        if (is_null($pluginInfo)) {
            return [];
        }
        $pluginId = $pluginInfo['id'];

        $dbh = \DBManager::get();
        /** @var \PDOStatement $stmt */
        $stmt = $dbh->prepare(
            'SELECT CASE range_type '.
            'WHEN "sem" THEN "course" '.
            'WHEN "inst" THEN "institute" '.
            'END as range_type2, range_id '.
            'FROM plugins_activated '.
            'WHERE pluginid = ? AND range_type IN ("sem", "inst")'
        );

        $stmt->execute([$pluginId]);

        return $stmt->fetchAll(\PDO::FETCH_NUM);
    }

    private function getActivations()
    {
        $pluginInfo = \PluginManager::getInstance()->getPluginInfo('CliqrPlugin');
        if (is_null($pluginInfo)) {
            return [];
        }
        $pluginId = $pluginInfo['id'];

        $dbh = \DBManager::get();
        /** @var \PDOStatement $stmt */
        $stmt = $dbh->prepare('SELECT poiid FROM plugins_activated WHERE pluginid = ?');
        $stmt->execute([$pluginId]);

        return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    }

    private function getRangeFromActivation($activation)
    {
        if (!preg_match('/^(sem|inst)(.+)$/', $activation, $matches)) {
            return null;
        }

        return [
            $matches[1] === 'sem' ? 'course' : 'institute',
            $matches[2],
        ];
    }

    private function getQuestionnaires($range)
    {
        return array_map(
            function ($assignment) {
                return $assignment->questionnaire;
            },
            \QuestionnaireAssignment::findBySQL('range_id = ?', [md5('cliqr-'.$range[1])])
        );
    }

    private function migrateQuestionnaire($range, \Questionnaire $questionnaire)
    {
        $question = $this->extractQuestion($questionnaire);
        $task = $this->findOrCreateTask($questionnaire, $question);

        $taskGroup = $this->getDefaultTaskGroup($range);
        $defaultTest = $taskGroup->test;

        $defaultTest->addTask($task);

        // anlegen von Response-Objekten
        if ($questionnaire->startdate) {
            $voting = $task->startTask($range, $questionnaire->startdate, $questionnaire->stopdate);
            $this->createResponses($question, $task, $voting);
        }

        $taskGroup->store();
        $defaultTest->store();

        return $task;
    }

    private function getDefaultTaskGroup($range)
    {
        list($rangeType, $rangeId) = $range;

        switch (count($taskGroups = Assignment::findTaskGroups($rangeId))) {
            case 0:
                $taskGroup = Assignment::createTaskGroup($rangeType, $rangeId);
                break;

            case 1:
                $taskGroup = $taskGroups[0];
                break;

            default:
                throw new \RuntimeException('There cannot be more than 1 task groups already.');
        }

        return $taskGroup;
    }

    private function extractQuestion($questionnaire)
    {
        if (count($questionnaire->questions) !== 1) {
            throw new \RuntimeException('Questionnaire should have a single question but had: '.
                                        count($questionnaire->questions));
        }

        $question = $questionnaire->questions[0];
        if (!$question instanceof \Vote) {
            throw new \RuntimeException('Only Votes can be migrated.');
        }

        return $question;
    }

    private function findOrCreateTask(\Questionnaire $questionnaire, \QuestionnaireQuestion $question)
    {
        if ($this->isQuestionETaskCompatible($question)) {
            // this question was already partially migrated to eTask
            // just return the task

            $task = Task::find($question->etask_task_id);
        } else {
            // migrate question into a task compatible with eTask

            $taskTask = [
                'type' => 'single',
                'answers' => array_map(
                    function ($item) {
                        return ['text' => $item, 'score' => 0, 'feedback' => ''];
                    },
                    $question->questiondata['options']->getArrayCopy()
                ),
            ];

            $taskData = [
                'type' => 'multiple-choice',
                'title' => $questionnaire->title,
                'description' => $question->questiondata['question'] ?: $questionnaire->title,
                'task' => $taskTask,
                'user_id' => $questionnaire->user_id,
                'mkdate' => $questionnaire->mkdate,
                'chdate' => $questionnaire->chdate,
            ];

            if (!$task = Task::create($taskData)) {
                throw new \RuntimeException('Could not store task');
            }
        }

        return $task;
    }

    private function isQuestionETaskCompatible(\QuestionnaireQuestion $question)
    {
        return isset($question['etask_task_id']);
    }

    private function createResponses(\QuestionnaireQuestion $question, Task $task, Assignment $voting)
    {
        $alreadyMigrated = $this->isQuestionETaskCompatible($question);

        $answers = array_reduce(
            $question->answers->getArrayCopy(),
            function ($memo, $answer) use ($alreadyMigrated) {
                ++$memo[$answer->answerdata['answers'] - ($alreadyMigrated ? 0 : 1)];

                return $memo;
            },
            []
        );

        foreach ($answers as $answerId => $count) {
            for ($i = 0; $i < $count; ++$i) {
                Response::create(
                    [
                        'assignment_id' => $voting->id,
                        'task_id' => $task->id,
                        'user_id' => '',
                        'response' => ['answer' => [$answerId]],
                    ]
                );
            }
        }
    }

    private function printTask(Task $task)
    {
        var_dump(
            [
                'task' => json_encode(($task->toArray())),
                'tests' => json_encode(($task->tests->toArray())),
                'assignments' => json_encode(
                    studip_utf8encode($task->tests[0]->assignments->toArray())
                ),
                'responses' => json_encode(studip_utf8encode($task->responses->toArray())),
            ]
        );
    }

    private function unassignQuestionnaire(\Questionnaire $questionnaire, $range)
    {
        list($rangeType, $rangeId) = $range;
        $sql = 'DELETE FROM questionnaire_assignments WHERE questionnaire_id = ? AND range_type = ? AND range_id = ?';
        /** @var \PDOStatement $stmt */
        $stmt = \DBManager::get()->prepare($sql);
        $stmt->execute([$questionnaire->id, $rangeType, md5('cliqr-'.$rangeId)]);
    }
}

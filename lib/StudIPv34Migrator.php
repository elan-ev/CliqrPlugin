<?php

namespace Cliqr;

use Cliqr\DB\Assignment;
use Cliqr\DB\Response;
use Cliqr\DB\Task;
use Cliqr\DB\Test;

class StudIPv34Migrator
{
    public function __construct($debug = false)
    {
        $this->debug = $debug;
    }

    public function migrate()
    {
        $dbh = \DBManager::get();

        try {
            $dbh->beginTransaction();

            foreach ($this->getActivations() as $activation) {
                $this->migrateActivation($activation);
            }

            $this->debug ? $dbh->rollBack() : $dbh->commit();
        } catch (\Exception $e) {
            $dbh->rollBack();
            throw $e;
        }
    }

    private function getActivations()
    {
        $pluginInfo = \PluginManager::getInstance()->getPluginInfo('CliqrPlugin');
        if (is_null($pluginInfo)) {
            return [];
            // TODO throw new \RuntimeException('Could not find active CliqrPlugin');
        }
        $pluginId = $pluginInfo['id'];

        $dbh = \DBManager::get();
        $stmt = $dbh->prepare('SELECT poiid FROM plugins_activated WHERE pluginid = ?');
        $stmt->execute([$pluginId]);

        return $stmt->fetchAll();
    }

    private function migrateActivation($activation)
    {
        if (preg_match('/^(sem|inst)(.+)$/', $activation['poiid'], $matches)) {
            $questions = $this->findCliqrQuestions($matches[2]);
            if (count($questions)) {
                $tasks = $this->transformCliqrQuestions($matches[1], $matches[2], $questions);
                if ($this->debug) {
                    var_dump(
                        array_map(
                            function ($task) {
                                return [
                                    'task' => json_encode(studip_utf8encode($task->toArray())),
                                    'tests' => json_encode(studip_utf8encode($task->tests->toArray())),
                                    'assignments' => json_encode(
                                        studip_utf8encode($task->tests[0]->assignments->toArray())
                                    ),
                                    'responses' => json_encode(studip_utf8encode($task->responses->toArray())), ];
                            },
                            $tasks
                        )
                    );
                }
            }
        }
    }

    private function findCliqrQuestions($poiid)
    {
        $rangeId = md5('cliqr-'.$poiid);

        $assignments = \QuestionnaireAssignment::findBySQL('range_id = ?', [$rangeId]);
        $questions = [];
        foreach ($assignments as $assignment) {
            $questions[] = $this->migrateCliqrQuestion($assignment);
        }

        return $questions;
    }

    private function migrateCliqrQuestion($assignment)
    {
        $questionnaire = $assignment->questionnaire;

        if (count($questionnaire->questions) !== 1) {
            throw new \RuntimeException('Questionnaire should have a single question but had: '.
                                        count($questionnaire->questions));
        }

        $question = $questionnaire->questions[0];
        if (!$question instanceof \Vote) {
            throw new \RuntimeException('Only Votes can be migrated.');
        }

        $result = [
            'type' => 'multiple-choice',
            'title' => $questionnaire->title,
            'description' => $question->questiondata['question'],
            'task' => [
                'type' => 'single',
                'answers' => array_map(
                    function ($item) {
                        return ['text' => $item, 'score' => 0, 'feedback' => ''];
                    },
                    $question->questiondata['options']->getArrayCopy()
                ),
            ],
            'user_id' => $questionnaire->user_id,
            'created' => $questionnaire->mkdate,
            'changed' => $questionnaire->chdate,
            'options' => [
                'questionnaire_id' => $questionnaire->id,
                'startdate' => $questionnaire->startdate,
                'stopdate' => $questionnaire->stopdate,
                'answers' => array_reduce($question->answers->getArrayCopy(), function ($memo, $answer) {
                    ++$memo[$answer->answerdata['answers'] - 1];

                    return $memo;
                }, []),
            ],
        ];

        return $result;
    }

    private function transformCliqrQuestions($type, $rangeId, $questions)
    {
        $rangeType = $type === 'sem' ? 'course' : 'institute';
        $results = [];

        $defaultAssignment = Assignment::createTaskGroup($rangeType, $rangeId);
        $defaultTest = $defaultAssignment->test;

        foreach ($questions as $question) {
            if (!$task = Task::create([
                                          'type' => 'multiple-choice',
                                          'title' => $question['title'],
                                          'description' => $question['description'] ?: $question['title'],
                                          'task' => $question['task'],
                                          'created' => date('c', $question['created']),
                                          'changed' => date('c', $question['changed']),
                                          'user_id' => $question['user_id'],
                                      ])) {
                throw new \RuntimeException('Could not store task');
            }

            $defaultTest->addTask($task);
            $results[] = $task;

            // anlegen von Response-Objekten
            if (isset($question['options']['startdate'])) {
                $assignment = $task->startTask(
                    [$rangeType, $rangeId],
                    $question['options']['startdate'],
                    $question['options']['stopdate']
                );

                foreach ($question['options']['answers'] as $answerId => $count) {
                    for ($i = 0; $i < $count; ++$i) {
                        Response::create(
                            [
                                'assignment_id' => $assignment->id,
                                'task_id' => $task->id,
                                'user_id' => '',
                                'response' => ['answer' => [$answerId]],
                            ]
                        );
                    }
                }
            }
        }

        $defaultAssignment->store();
        $defaultTest->store();

        return $results;
    }
}

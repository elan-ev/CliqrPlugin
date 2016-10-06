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
        if (!$plugin = \PluginEngine::getPlugin('CliqrPlugin')) {
            throw new \RuntimeException('Could not find active CliqrPlugin');
        }
        $id = $plugin->getPluginId();

        $dbh = \DBManager::get();
        $stmt = $dbh->prepare('SELECT poiid FROM plugins_activated WHERE pluginid = ?');
        $stmt->execute([$id]);

        return $stmt->fetchAll();
    }

    private function migrateActivation($activation)
    {
        if ($matched = preg_match('/^(sem|inst)(.+)$/', $activation['poiid'], $matches)) {
            $questions = $this->migrateCliqrQuestions($matches[2]);
            if (count($questions)) {
                $tasks = $this->transformCliqrQuestions($matches[1], $matches[2], $questions);
                if ($this->debug) {
                    var_dump(array_map(function ($t) {
                        return [
                                    'task' => json_encode(studip_utf8encode($t->toArray())),
                                    'tests' => json_encode(studip_utf8encode($t->tests->toArray())),
                                    'assignments' => json_encode(studip_utf8encode($t->tests[0]->assignments->toArray())),
                                    'responses' => json_encode(studip_utf8encode($t->responses->toArray())), ];
                    },  $tasks));
                }
            }
        }
    }

    private function migrateCliqrQuestions($poiid)
    {
        $range_id = md5('cliqr-'.$poiid);

        $assignments = \QuestionnaireAssignment::findBySQL('range_id = ?', [$range_id]);
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
            throw new \RuntimeException('Questionnaire should have a single question but had: '.count($questionnaire->questions));
        }

        $question = $questionnaire->questions[0];
        if (!$question instanceof \Vote) {
            throw new \RuntimeException('Only Votes can be migrated.');
        }

        $result = [
            'type' => 'multiple-choice',
            'title' => '',
            'description' => $questionnaire->title,
            'task' => [
                'type' => 'single',
                'answers' => array_map(
                    function ($item) {
                        return ['text' => $item, 'score' => 0, 'feedback' => ''];
                    },
                    $question->questiondata['options']->getArrayCopy()),
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

    private function transformCliqrQuestions($type, $range_id, $questions)
    {
        $range_type = $type === 'sem' ? 'course' : 'institute';
        $results = [];

        $defaultAssignment = Assignment::createTaskGroup($range_type, $range_id);
        $defaultTest = $defaultAssignment->test;

        foreach ($questions as $question) {
            if (!$task = Task::create(
                    [
                        'type' => 'multiple-choice',
                        'title' => '',
                        'description' => $question['description'],
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
                    [$range_type, $range_id],
                    $question['options']['startdate'],
                    $question['options']['stopdate']);

                $responses = [];
                foreach ($question['options']['answers'] as $answer_id => $count) {
                    for ($i = 0; $i < $count; ++$i) {
                        Response::create(
                            [
                                'assignment_id' => $assignment->id,
                                'task_id' => $task->id,
                                'user_id' => '',
                                'response' => ['answer' => [$answer_id]],
                            ]);
                    }
                }
            }
        }

        $defaultAssignment->store();
        $defaultTest->store();

        return $results;
    }
}

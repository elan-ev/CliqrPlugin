<?php

namespace Cliqr;

class Importer
{
    const VERSION = '1.0';

    private $range_type;
    private $range_id;
    private $import;
    private $imported;

    public function __construct($range_type, $range_id)
    {
        $this->range_type = $range_type;
        $this->range_id = $range_id;
        $this->import = null;
        $this->imported = [];
    }

    public function importString($string, $debug = false)
    {
        $this->import = json_decode($string, true);

        if (!isset($this->import['version']) || $this->import['version'] !== self::VERSION) {
            throw new \RuntimeException('Wrong version');
        }

        $dbh = \DBManager::get();
        $dbh->beginTransaction();

        $this->decodeEntities();

        if ($debug) {
            foreach ($this->imported as $id => $sormObject) {
                var_dump([$id, get_class($sormObject), $sormObject->id, json_encode($sormObject->toArray())]);
            }
        }

        $debug ? $dbh->rollBack() : $dbh->commit();
    }

    private function decodeEntities()
    {
        if (!isset($this->import['entities'])) {
            return;
        }

        $mapping = [
            'task_group' => DB\Assignment::class,
            'test' => DB\Test::class,
            'task' => DB\Task::class,
        ];

        $now = time();
        $baseAttrs = [
            'range_type' => $this->range_type,
            'range_id' => $this->range_id,
            'user_id' => $GLOBALS['user']->id,
            'mkdate' => $now,
            'chdate' => $now,
        ];

        foreach ($this->import['entities'] as $id => $entity) {
            if (!$klass = $mapping[$entity['type']]) {
                throw new \RuntimeException('Wrong type');
            }
            $this->imported[$id] = $klass::create(array_merge($baseAttrs, $entity['attributes']));
        }

        foreach ($this->import['entities'] as $id => $entity) {
            // var_dump("relate $id/".$this->imported[$id]->id);

            $sormObject = $this->imported[$id];

            switch ($mapping[$entity['type']]) {
            case DB\Assignment::class:
                $test = $this->imported[$entity['relationships']['test']];
                $sormObject->test_id = $test->id;
                $sormObject->store();
                break;

            case DB\Test::class:
                foreach ($entity['relationships']['tasks'] as $task) {
                    $testTask = $sormObject->addTask($this->imported[$task]);
                }
                break;
            }
        }
    }
}

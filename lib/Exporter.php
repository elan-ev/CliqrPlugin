<?php
namespace Cliqr;

class Exporter
{

    const VERSION = '1.0';

    public function __construct()
    {
        $this->export = [
            'version' => self::VERSION,
            'entities' => []
        ];
    }

    public function exportTaskGroup(DB\Assignment $taskGroup)
    {
        $this->encodeTaskGroup($taskGroup);
        return json_encode(studip_utf8encode($this->export), JSON_PRETTY_PRINT | JSON_HEX_TAG | JSON_HEX_AMP | JSON_UNESCAPED_SLASHES);
    }


    private function encodeID(\SimpleORMap $sormObject)
    {
        return md5(get_class($sormObject) . '-' . json_encode($sormObject->id));
    }


    private function encodeTaskGroup(DB\Assignment $taskGroup)
    {
        $id = $this->encodeID($taskGroup);

        if (isset($this->export['entities'][$id])) {
            return;
        }

        $entry = [
            'type' => 'task_group',
            'id' => $id
        ];

        $attributes = $taskGroup->toArray('type active options');
        $attributes['active'] = (int) $attributes['active'];
        $entry['attributes'] = $attributes;

        $this->export['entities'][$id] = &$entry;

        // now encode test
        $entry['relationships'] = ['test' => $this->encodeID($taskGroup->test)];
        $this->encodeTest($taskGroup->test);
    }

    private function encodeTest(DB\Test $test)
    {
        $id = $this->encodeID($test);

        if (isset($this->export['entities'][$id])) {
            return;
        }

        $entry = [
            'type' => 'test',
            'id' => $id
        ];

        $entry['attributes'] = $test->toArray('title description options');

        $this->export['entities'][$id] = &$entry;

        // now encode tasks
        $entry['relationships'] = [ 'tasks' => [] ];
        foreach($test->getTasks() as $task) {
            $entry['relationships']['tasks'][] = $this->encodeID($task);
            $this->encodeTask($task);
        }
    }

    private function encodeTask(DB\Task $task)
    {
        $id = $this->encodeID($task);

        if (isset($this->export['entities'][$id])) {
            return;
        }

        $entry = [
            'type' => 'task',
            'id' => $id
        ];

        $entry['attributes'] = $task->toArray('type title description task options');

        $this->export['entities'][$id] = $entry;
    }
}

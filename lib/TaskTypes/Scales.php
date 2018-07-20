<?php

namespace Cliqr\TaskTypes;

use Cliqr\DB\Task;
use Studip\Markup;

class Scales extends TaskType
{

    protected function validate($task)
    {
        if (!mb_strlen($task->description)) {
            return \Cliqr\i18n('Der Fragetext darf nicht leer sein');
        }

        if ($task->description === Markup::HTML_MARKER) {
            return \Cliqr\i18n('Der Fragetext darf nicht leer sein.');
        }

        if (empty($task->task)) {
            return \Cliqr\i18n('Task fehlt.');
        }

        if ($violation = $this->validateJsonSchema($task)) {
            return $violation;
        }

        if ($task->task['lrange_value'] >= $task->task['hrange_value']) {
            return \Cliqr\i18n('Das Minimum muss kleiner als das Maximum sein.');
        }

        return null;
    }

    public function transformBeforeSave($task)
    {
        // purify HTML in description
        $task->description = Markup::purifyHtml((string) $task->description);

        return $task;
    }

    private function validateJsonSchema($task)
    {
        $mcTask = json_decode((string)$task->task);

        $schemaFile = __DIR__ . '/scales.json';
        $schema = json_decode(file_get_contents($schemaFile));

        $validator = \JVal\Validator::buildDefault();
        $violations = $validator->validate($mcTask, $schema, 'file://'. $schemaFile);

        if (!empty($violations)) {
            return join(' ', array_map(function ($vltn) {
                return $vltn['path'] . ' ' . $vltn['message'];
            }, $violations));
        }

        return null;
    }

    protected function validateResponse(\Cliqr\DB\Response $response)
    {
        $responseData = json_decode((string)$response->response);

        $schemaFile = __DIR__ . '/scales-response.json';
        $schema = json_decode(file_get_contents($schemaFile));

        $validator = \JVal\Validator::buildDefault();
        $violations = $validator->validate($responseData, $schema, 'file://'. $schemaFile);

        if (!empty($violations)) {
            return join(' ', array_map(function ($vltn) {
                return $vltn['path'] . ' ' . $vltn['message'];
            }, $violations));
        }

        return null;
    }
}

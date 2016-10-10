<?php

namespace Cliqr\TaskTypes;

use Cliqr\DB\Task;
use Studip\Markup;

class MultipleChoice
{
    public $validationError;

    public function isValid($task)
    {
        return !($this->validationError = $this->validate($task) ?: null);
    }

    private function validate($task)
    {
        if (!strlen($task->description)) {
            return \Cliqr\i18n('Der Fragetext darf nicht leer sein');
        }

        if ($task->description === Markup::HTML_MARKER) {
            return \Cliqr\i18n('Der Fragetext darf nicht leer sein.');
        }

        if (empty($task->task)) {
            return \Cliqr\i18n('Task fehlt.');
        }

        return $this->validateJsonSchema($task);
    }

    public function transformBeforeSave($task)
    {
        // purify HTML in description
        $task->description = Markup::markAsHtml(Markup::purify((string) $task->description));

        return $task;
    }

    private function validateJsonSchema($task)
    {
        $mcTask = json_decode((string)$task->task);

        $schemaFile = __DIR__ . '/mc.json';
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
}

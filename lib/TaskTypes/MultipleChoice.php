<?php

namespace Cliqr\TaskTypes;

use Cliqr\DB\Task;
use Studip\Markup;

class MultipleChoice
{

    private $task;

    private $validationError;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    public function isValid()
    {
        return !($this->validationError = $this->validate() ?: null);
    }

    private function validate()
    {
        if (!strlen($this->task->description)) {
            return \Cliqr\i18n('Der Fragetext darf nicht leer sein.');
        }

        if ($this->task->description === Markup::HTML_MARKER) {
            return \Cliqr\i18n('Der Fragetext darf nicht leer sein.');
        }

        if (empty($this->task->task)) {
            return \Cliqr\i18n('Task fehlt.');
        }

        if (!array_key_exists('answers', $this->task->task) || empty($this->task->task['answers'])) {
            return \Cliqr\i18n('Es wird mindestens eine Antwort benötigt.');
        }

        return null;
    }

    public function transformBeforeSave()
    {
        /*
        $data = json_decode((string)$this->task->task);

        $schemaFile = __DIR__ . '/mc.json';
        $schema = json_decode(file_get_contents($schemaFile));

        $validator = \JVal\Validator::buildDefault();
        $violations = $validator->validate($data, $schema, 'file://'. $schemaFile);
        */

        return $this->task;
    }
}

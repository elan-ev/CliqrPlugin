<?php

namespace Cliqr\TaskTypes;

abstract class TaskType
{
    public $validationError;

    public function isValid($task)
    {
        return !($this->validationError = $this->validate($task) ?: null);
    }

    abstract protected function validate($task);

    abstract public function transformBeforeSave($task);

    public function isValidResponse(\Cliqr\DB\Response $response)
    {
        return !($this->validationError = $this->validateResponse($response) ?: null);
    }

    abstract protected function validateResponse(\Cliqr\DB\Response $response);
}

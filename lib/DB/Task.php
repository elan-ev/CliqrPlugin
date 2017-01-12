<?php

namespace Cliqr\DB;

class Task extends \eTask\Task
{
    use ConfigureTrait;

    public function startTask($range, $start = null, $end = null, $user_id = null)
    {
        $now = date('c');

        list($range_type, $range_id) = $range;

        if (!isset($start)) {
            $start = $now;
        } elseif (is_numeric($start)) {
            $start = date('c', $start);
        }

        if (is_numeric($end)) {
            $end = date('c', $end);
        }

        if (!isset($user_id)) {
            $user_id = $this->user_id;
        }

        if (!$test = Test::create(
                [
                    'title' => _('Cliqr-Frage vom ').$start,
                    'description' => '',
                    'user_id' => $user_id,
                    'created' => $now,
                    'changed' => $now,
                    'option' => ['voting' => 1],
                ])) {
            throw new \RuntimeException('Could not store test');
        }

        $test->addTask($this);

        $assignment = new Assignment();
        $assignment->setData(
            [
                'test_id' => $test->id,
                'range_type' => $range_type,
                'range_id' => $range_id,
                'type' => Assignment::TYPE_VOTING,
                'start' => $start,
                'end' => $end,
                'active' => 1,
            ], false);

        \NotificationCenter::postNotification('CliqrQuestionWillStart', $assignment);
        if (!$assignment->store()) {
            throw new \RuntimeException('Could not store assignment');
        }
        \NotificationCenter::postNotification('CliqrQuestionDidStart', $assignment);

        return $assignment;
    }

    public function getTaskGroup()
    {
        $sql = 'SELECT ea . *
                FROM etask_tasks et
                INNER JOIN etask_test_tasks ett ON ett.task_id = et.id
                INNER JOIN etask_assignments ea ON ea.test_id = ett.test_id
                WHERE et.id = ? AND ea.type = ?
                ORDER BY start, id';
        $st = \DBManager::get()->prepare($sql);
        $st->execute([$this->id, Assignment::TYPE_TASK_GROUP]);

        $rowCount = $st->rowCount();
        if ($rowCount !== 1) {
            throw new \RuntimeException('Task "'.$this->id.'" has "'.$rowCount.'" Task Groups but must have exactly one.');
        }

        return Assignment::buildExisting($st->fetch(\PDO::FETCH_ASSOC));
    }

    /**
     * Duplicate a task in a task group
     *
     * @param $taskGroup \Cliqr\Assignment  optional; the task group to copy this task into, defaults to this task's task group
     *
     * @return  the duplicated task instance
     */
    public function duplicateInTaskGroup(Assignment $taskGroup = null)
    {
        $data = $this->toArray('type title description task user_id');
        $duplicate = Task::build($data);
        $taskGroup = $taskGroup ?: $this->getTaskGroup();

        return $duplicate->createInTaskGroup($taskGroup->range_id, $taskGroup->id);
    }

    public function getVotings()
    {
        $sql = 'SELECT ea . *
                FROM etask_tasks et
                INNER JOIN etask_test_tasks ett ON ett.task_id = et.id
                INNER JOIN etask_assignments ea ON ea.test_id = ett.test_id
                WHERE et.id = ? AND ea.type = ?
                ORDER BY start, id';
        $st = \DBManager::get()->prepare($sql);
        $st->execute([$this->id, Assignment::TYPE_VOTING]);

        $ret = new \SimpleORMapCollection();
        $ret->setClassName(Assignment::class);
        while ($row = $st->fetch(\PDO::FETCH_ASSOC)) {
            $ret[] = Assignment::buildExisting($row);
        }

        return $ret;
    }

    public function toJSON($omits = [])
    {
        $result = $this->toArray('id type title description task user_id created changed');

        $result['description_html'] = formatReady($result['description']);

        // TODO nicht sehr performant
        if (!in_array('task.task_group_id', $omits)) {
            $result['task_group_id'] = $this->getTaskGroup()->id;
            $result['task_group_title'] = $this->getTaskGroup()->test->title;
        }

        // TODO nicht sehr performant
        if (!in_array('task.votings', $omits)) {
            $result['votings'] = $this->getVotings()->map(function ($poll) {
                $ret = $poll->toArray('id test_id start end active');
                $ret['responses_count'] = Response::countBySql('assignment_id = ?', [$poll->id]);

                return $ret;
            });
        }

        return $result;
    }

    public function createInTaskGroup($range_id, $task_group_id)
    {
        if (!$taskGroup = Assignment::findTaskGroup($range_id, $task_group_id)) {
            throw new \RuntimeException('Could not find task group: '.intval($task_group_id));
        }

        $now = date('c', time());
        $this->created = $now;
        $this->changed = $now;

        if (!$this->store()) {
            throw new \RuntimeException('Could not store task');
        }

        $taskGroup->test->addTask($this);

        return $this;
    }
}

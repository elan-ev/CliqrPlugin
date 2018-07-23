<?php

namespace Cliqr\DB;

/**
 * @property string $id the id
 * @property string $type
 * @property string $title
 * @property string $description
 * @property string $task
 * @property string $user_id
 * @property int $mkdate
 * @property int $chdate
 * @property \SimpleORMapCollection $tests has_many Tests
 * @property \SimpleORMapCollection $responses has_many Responses
 */
class Task extends \eTask\Task
{
    use ConfigureTrait;

    public function startTask($range, $start = null, $end = null, $userId = null)
    {
        $now = time();

        list($rangeType, $rangeId) = $range;

        if (!isset($start)) {
            $start = $now;
        }

        if (!isset($userId)) {
            $userId = $this->user_id;
        }

        /** @var \Cliqr\DB\Test $test */
        $test = Test::create(
            [
                'title' => _('Cliqr-Frage vom ').date('c', $start),
                'description' => '',
                'user_id' => $userId,
                'mkdate' => $now,
                'chdate' => $now,
                'option' => ['voting' => 1],
            ]
        );
        if (!$test) {
            throw new \RuntimeException('Could not store test');
        }

        $test->addTask($this);

        $assignment = new Assignment();
        $assignment->setData(
            [
                'test_id' => $test->id,
                'range_type' => $rangeType,
                'range_id' => $rangeId,
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
        /** @var \PDOStatement $stmt */
        $stmt = \DBManager::get()->prepare($sql);
        $stmt->execute([$this->id, Assignment::TYPE_TASK_GROUP]);

        $rowCount = $stmt->rowCount();
        if ($rowCount !== 1) {
            throw new \RuntimeException('Task "'.$this->id.'" has "'.$rowCount.'" Task Groups but must have exactly one.');
        }

        return Assignment::buildExisting($stmt->fetch(\PDO::FETCH_ASSOC));
    }

    /**
     * Duplicate a task in a task group.
     *
     * @param \Cliqr\DB\Assignment $taskGroup optional; the task group to copy this task into, defaults to this task's task group
     *
     * @return Task the duplicated task instance
     */
    public function duplicateInTaskGroup(Assignment $taskGroup = null)
    {
        $data = $this->toArray('type title description task user_id');
        /** @var Task $duplicate */
        $duplicate = self::build($data);
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
        /** @var \PDOStatement $stmt */
        $stmt = \DBManager::get()->prepare($sql);
        $stmt->execute([$this->id, Assignment::TYPE_VOTING]);

        $ret = new \SimpleORMapCollection();
        $ret->setClassName(Assignment::class);
        while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            $ret[] = Assignment::buildExisting($row);
        }

        return $ret;
    }

    public function toJSON($omits = [])
    {
        $result = $this->toArray('id type title description task user_id');

        $result['mkdate'] = date('c', $this->mkdate);
        $result['chdate'] = date('c', $this->chdate);

        $result['description'] = $result['description'];
        $result['description_html'] = formatReady($result['description']);
        # $result['description_html'] = is_callable('wysiwygReady') ? wysiwygReady($result['description']) : htmlReady($result['description']);

        // TODO nicht sehr performant
        if (!in_array('task.task_group_id', $omits)) {
            $result['task_group_id'] = $this->getTaskGroup()->id;
            $result['task_group_title'] = $this->getTaskGroup()->test->title;
        }

        // TODO nicht sehr performant
        if (!in_array('task.votings', $omits)) {
            $result['votings'] = $this->getVotings()->map(function ($poll) {
                $ret = $poll->toArray('id test_id active');
                $ret['start'] = date('c', $poll->start);
                $ret['end'] = date('c', $poll->end);
                $ret['responses_count'] = Response::countBySql('assignment_id = ?', [$poll->id]);

                return $ret;
            });
        }

        return $result;
    }

    public function createInTaskGroup($rangeId, $taskGroupId)
    {
        if (!$taskGroup = Assignment::findTaskGroup($rangeId, $taskGroupId)) {
            throw new \RuntimeException('Could not find task group: '.intval($taskGroupId));
        }

        $this->mkdate = $this->chdate = time();

        if (!$this->store()) {
            throw new \RuntimeException('Could not store task');
        }

        $taskGroup->test->addTask($this);

        return $this;
    }
}

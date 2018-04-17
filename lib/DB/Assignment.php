<?php

namespace Cliqr\DB;

use eTask\Assignment as eAssignment;

/**
 * @property string $id
 * @property string $test_id
 * @property string $range_type
 * @property string $range_id
 * @property string $type
 * @property int $start
 * @property int $end
 * @property int $active
 * @property array $options
 * @property \Cliqr\DB\Test $test
 * @property \SimpleORMapCollection $responses
 */
class Assignment extends eAssignment
{
    use ConfigureTrait;

    const TYPE_VOTING = 'cliqr:voting';
    const TYPE_TASK_GROUP = 'cliqr:task-group';

    public static function findTaskGroups($range_id)
    {
        return \SimpleORMapCollection::createFromArray(
            self::findBySQL(
                'type = ? AND range_id = ? ORDER BY id ASC',
                [self::TYPE_TASK_GROUP, $range_id]));
    }

    public static function findTaskGroup($range_id, $id)
    {
        return self::findOneBySQL(
            'type = ? AND range_id = ? and id = ?',
            [self::TYPE_TASK_GROUP, $range_id, $id]);
    }

    public static function findVotings($range_type, $range_id)
    {
        return \SimpleORMapCollection::createFromArray(
            self::findBySQL(
                'type = ? AND range_type = ? AND range_id = ? ORDER BY start ASC',
                [self::TYPE_VOTING, $range_type, $range_id]));
    }

    public static function findVotingsAt($range_type, $range_id, $time)
    {
        return  \SimpleORMapCollection::createFromArray(self::findBySQL(
            'type = ? AND range_type = ? AND range_id = ? AND start <= ? AND (? <= end OR end IS NULL) ORDER BY start ASC',
            [self::TYPE_VOTING, $range_type, $range_id, $time, $time]));
    }

    public static function findOldVotings($range_type, $range_id)
    {
        $now = time();

        return  \SimpleORMapCollection::createFromArray(self::findBySQL(
            'type = ? AND range_type = ? AND range_id = ? AND end < ? ORDER BY end DESC',
            [self::TYPE_VOTING, $range_type, $range_id, $now]));
    }

    public static function findVoting($range_id, $id)
    {
        return self::findOneBySQL(
            'type = ? AND range_id = ? and id = ?',
            [self::TYPE_VOTING, $range_id, $id]);
    }

    public static function stopAllVotings($range_type, $range_id)
    {
        $now = time();
        $votings = self::findVotingsAt($range_type, $range_id, $now);

        return $votings->each(function ($voting) use ($now) {
            $voting->end = $now;

            return $voting->store() ?: 0;
        });
    }

    // ***** INSTANCE METHODS

    public function countTasks()
    {
        $sql = 'SELECT COUNT(*)
                FROM etask_assignments ea
                INNER JOIN etask_test_tasks ett
                USING ( test_id )
                INNER JOIN etask_tasks et ON ett.task_id = et.id
                WHERE ea.id = ?
                ORDER BY ett.position ASC';

        /** @var \PDOStatement $st */
        $st = \DBManager::get()->prepare($sql);
        $st->execute([$this->id]);

        return (int) $st->fetchColumn();
    }

    public function findTasks()
    {
        $sql = 'SELECT et.*
                FROM etask_assignments ea
                INNER JOIN etask_test_tasks ett
                USING ( test_id )
                INNER JOIN etask_tasks et ON ett.task_id = et.id
                WHERE ea.id = ?
                ORDER BY ett.position ASC';

        /** @var \PDOStatement $st */
        $st = \DBManager::get()->prepare($sql);
        $st->execute([$this->id]);

        $ret = new \SimpleORMapCollection();
        $ret->setClassName(Task::class);
        while ($row = $st->fetch(\PDO::FETCH_ASSOC)) {
            $ret[] = Task::buildExisting($row);
        }

        return $ret;
    }

    public static function createTaskGroup($range_type, $range_id, $data = [])
    {
        $now = time();

        $test = new Test();
        $test->title = $data['title'] ?: 'Cliqr-Fragen';
        $test->mkdate = $now;
        $test->chdate = $now;
        $test->user_id = $data['user_id'] ?: $GLOBALS['user']->id;
        $test->options = ['task_group' => 1];
        $test->store();

        $taskGroup = new self();
        $taskGroup->range_type = $range_type;
        $taskGroup->range_id = $range_id;
        $taskGroup->type = self::TYPE_TASK_GROUP;
        $taskGroup->active = 1;
        $taskGroup->test_id = $test->id;
        $taskGroup->store();

        return $taskGroup;
    }

    public function isVoting()
    {
        return $this->type = self::TYPE_VOTING;
    }

    public function isTaskGroup()
    {
        return $this->type = self::TYPE_TASK_GROUP;
    }

    public function toJSON($omits = [])
    {
        $otherOmits = array_filter($omits, function ($omit) {
            return mb_substr($omit, 0, mb_strlen('assignment.')) !== 'assignment.';
        });

        $result = $this->toArray('id test_id active');
        $result['start'] = date('c', $this->start);
        $result['end'] = date('c', $this->end);
        $result['is_running'] = $this->isRunning();

        $result['is_task_group'] = $this->type == self::TYPE_TASK_GROUP;
        $result['is_voting'] = $this->type == self::TYPE_VOTING;

        if (!in_array('assignment.test', $omits)) {
            $result['test'] = $this->test->toJSON($otherOmits);
        }

        if (!in_array('assignment.responses', $omits)) {
            $result['responses'] = $this->responses->map(function ($resp) {
                return $resp->response->getArrayCopy();
            });
        }

        return $result;
    }

    public function isRunning()
    {
        $start = $this->start;
        $now = time();
        $end = $this->end ?: PHP_INT_MAX;

        return $start <= $now && $now <= $end;
    }

    /**
     * Duplicate a task group.
     *
     * @return Assignment the duplicated task group instance
     */
    public function duplicateTaskGroup()
    {
        $data = $this->test->toArray('title user_id');
        $copyTxt = 'Kopie von ';
        if (strncmp($data['title'], $copyTxt, mb_strlen($copyTxt)) != 0) {
            $data['title'] = $copyTxt.$data['title'];
        }
        $duplicate = self::createTaskGroup($this->range_type, $this->range_id, $data);

        // copy tasks
        $this->findTasks()->duplicateInTaskGroup($duplicate);

        return $duplicate;
    }

    public function getTaskGroupJSON($includeTasks = false)
    {
        $test = $this->test;

        if ($includeTasks) {
            $tasks = $test->tasks->sendMessage('toJSON', []);
        } else {
            $tasks = $test->getTaskIds();
        }

        return [
            'id' => $this->id,
            'title' => $test->title,
            'last_change' => date('c', $test->getLastChange()),
            'tasks_count' => $test->countTasks(),
            'tasks' => $tasks,
        ];
    }
}

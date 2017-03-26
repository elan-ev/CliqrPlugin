<?php

namespace Cliqr\DB;

use eTask\Assignment as eAssignment;

class Assignment extends eAssignment
{
    use ConfigureTrait;
    use CreatedChangedTrait;

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
        $now = date('c', $time);

        return  \SimpleORMapCollection::createFromArray(self::findBySQL(
            'type = ? AND range_type = ? AND range_id = ? AND start <= ? AND (? <= end OR end IS NULL) ORDER BY start ASC',
            [self::TYPE_VOTING, $range_type, $range_id, $now, $now]));
    }

    public static function findOldVotings($range_type, $range_id)
    {
        $now = date('c', time());

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
            $voting->end = date('c', $now);

            return $voting->store() ?: 0;
        });
    }

    // ***** INSTANCE METHODS

    public function getStart()
    {
        return date('c', strtotime($this->content['start']));
    }

    public function getEnd()
    {
        return date('c', strtotime($this->content['end']));
    }

    public function countTasks()
    {
        $sql = 'SELECT COUNT(*)
                FROM etask_assignments ea
                INNER JOIN etask_test_tasks ett
                USING ( test_id )
                INNER JOIN etask_tasks et ON ett.task_id = et.id
                WHERE ea.id = ?
                ORDER BY ett.position ASC';

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

        $st = \DBManager::get()->prepare($sql);
        $st->execute([$this->id]);

        $ret = new \SimpleORMapCollection();
        $ret->setClassName(Task::class);
        while ($row = $st->fetch(\PDO::FETCH_ASSOC)) {
            $ret[] = Task::buildExisting($row);
        }

        return $ret;
    }

    public function createTaskGroup($range_type, $range_id, $data = [])
    {
        $now = date('c', time());

        $test = new Test();
        $test->title = $data['title'] ?: 'Cliqr-Fragen';
        $test->created = $now;
        $test->changed = $now;
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
            return substr($omit, 0, strlen('assignment.')) !== 'assignment.';
        });

        $result = $this->toArray('id test_id start end active');

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
        $start = new \DateTime($this->start);
        $now = new \DateTime();
        $end = $this->end ? new \DateTime($this->end) : PHP_MAX_INT;

        return $start <= $now && $now <= $end;
    }

    /**
     * Duplicate a task group
     *
     * @return  the duplicated task group instance
     */
    public function duplicateTaskGroup()
    {
        $data = $this->test->toArray('title user_id');
        $copyTxt = 'Kopie von ';
        if (strncmp($data['title'], $copyTxt, strlen($copyTxt)) != 0) {
            $data['title'] = $copyTxt . $data['title'];
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
            $tasks = $test->tasks->toJSON();
        } else {
            $tasks = $test->getTaskIds();
        }

        return [
            'id' => $this->id,
            'title' => $test->title,
            'last_change' => $test->getLastChange()->format('c'),
            'tasks_count' => $test->countTasks(),
            'tasks' => $tasks
        ];
    }
}

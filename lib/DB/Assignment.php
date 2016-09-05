<?php
namespace Cliqr\DB;

use \eAufgaben\DB\Assignment as eAssignment;

class Assignment extends eAssignment
{
    const TYPE_VOTING = 'cliqr:voting';
    const TYPE_TASK_GROUP = 'cliqr:task-group';

    public static function findTaskGroups($range_id)
    {
        return \SimpleORMapCollection::createFromArray(
            Assignment::findBySQL(
                'type = ? AND range_id = ? ORDER BY id ASC',
                [ Assignment::TYPE_TASK_GROUP, $range_id ]));
    }

    public static function findTaskGroup($range_id, $id)
    {
        return Assignment::findOneBySQL(
            'type = ? AND range_id = ? and id = ?',
            [ Assignment::TYPE_TASK_GROUP, $range_id, $id ]);
    }

    public static function findVotings($range_type, $range_id)
    {
        return \SimpleORMapCollection::createFromArray(
            Assignment::findBySQL(
                'type = ? AND range_type = ? AND range_id = ?',
                [ Assignment::TYPE_VOTING, $range_type, $range_id]));
    }

    public static function findVotingsAt($range_type, $range_id, $time)
    {
        $now = date('c', $time);
        return  \SimpleORMapCollection::createFromArray(Assignment::findBySQL(
            'type = ? AND range_type = ? AND range_id = ? AND start <= ? AND (? <= end OR end IS NULL)',
            [ Assignment::TYPE_VOTING, $range_type, $range_id, $now, $now ]));
    }

    public static function findVoting($range_id, $id)
    {
        return Assignment::findOneBySQL(
            'type = ? AND range_id = ? and id = ?',
            [ Assignment::TYPE_VOTING, $range_id, $id ]);
    }

    public static function stopAllVotings($range_type, $range_id)
    {
        $now = time();
        $votings = Assignment::findVotingsAt($range_type, $range_id, $now);

        return $votings->each(function ($voting) use ($now) {
            $voting->end = date('c', $now);
            return $voting->store() ?: 0;
        });
    }

    // ***** INSTANCE METHODS

    public function findTasks() {
        $sql = "SELECT et.*
                FROM eauf_assignments ea
                INNER JOIN eauf_test_tasks ett
                USING ( test_id )
                INNER JOIN eauf_tasks et ON ett.task_id = et.id
                WHERE ea.id = ?
                ORDER BY ett.position ASC";

        $st = \DBManager::get()->prepare($sql);
        $st->execute([ $this->id ]);

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
        $test->user_id = $GLOBALS['user']->id;
        $test->options = ['task_group' => 1];
        $test->store();

        $taskGroup = new Assignment();
        $taskGroup->range_type = $range_type;
        $taskGroup->range_id = $range_id;
        $taskGroup->type = Assignment::TYPE_TASK_GROUP;
        $taskGroup->active = 1;
        $taskGroup->test_id = $test->id;
        $taskGroup->store();

        return $taskGroup;
    }

    public function toJSON($include = 'test responses')
    {
        $include = words($include);

        $result = $this->toArray('id test_id start end active');

        $result['is_task_group'] = $this->type == Assignment::TYPE_TASK_GROUP;
        $result['is_voting'] = $this->type == Assignment::TYPE_VOTING;

        if (in_array('test', $include)) {
            $result['test'] = $this->test->toJSON();
        }

        if (in_array('responses', $include)) {
            $result['responses'] = $this->responses->map(function ($resp) { return $resp->response->getArrayCopy(); });
        }

        return $result;
    }
}

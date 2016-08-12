<?php
namespace Cliqr\DB;

use \eAufgaben\DB\Assignment as eAssignment;

class Assignment extends eAssignment
{
    const TYPE_VOTING = 'cliqr:voting';
    const TYPE_TASK_GROUP = 'cliqr:task-group';

    public function findTaskGroups($range_id)
    {
        return \SimpleORMapCollection::createFromArray(
            Assignment::findBySQL(
                'type = ? AND range_id = ? ORDER BY id ASC',
                [ Assignment::TYPE_TASK_GROUP, $range_id ]));
    }

    public function findTaskGroup($range_id, $id)
    {
        return Assignment::findOneBySQL(
            'type = ? AND range_id = ? and id = ?',
            [ Assignment::TYPE_TASK_GROUP, $range_id, $id ]);
    }

    public function findVoting($range_id, $id)
    {
        return Assignment::findOneBySQL(
            'type = ? AND range_id = ? and id = ?',
            [ Assignment::TYPE_VOTING, $range_id, $id ]);
    }

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

    public function toJSON()
    {
        $result = $this->toArray('id test_id start end active');

        if ($this->type == Assignment::TYPE_VOTING) {
            $result['task'] = $this->findTasks()->first()->toJSON(true);
        } else if ($this->type == Assignment::TYPE_TASK_GROUP) {
            $result['tasks'] = $this->findTasks()->toJSON(true);
        }

        $result['responses'] = $this->responses->map(function ($resp) { return $resp->response->getArrayCopy(); });

        return $result;
    }
}

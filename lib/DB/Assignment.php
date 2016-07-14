<?php
namespace Cliqr\DB;

use \eAufgaben\DB\Assignment as eAssignment;

class Assignment extends eAssignment
{
    const TYPE_POLL = 'cliqr:poll';
    const TYPE_TASK_GROUP = 'cliqr:task-group';

    public function findTaskGroups($range_id)
    {
        return \SimpleORMapCollection::createFromArray(
            Assignment::findBySQL(
                'type = ? AND range_id = ? ORDER BY id ASC',
                [ Assignment::TYPE_TASK_GROUP, $range_id ]));
    }
}

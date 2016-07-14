<?php
namespace Cliqr\DB;

class Task extends \eAufgaben\DB\Task
{
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
                    'title' => _('Cliqr-Frage vom ') . $start,
                    'description' => '',
                    'user_id' => $user_id,
                    'created' => $now,
                    'changed' => $now
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
                'type' => Assignment::TYPE_POLL,
                'start' => $start,
                'end' => $end,
                'active' => 1
            ], false);

        \NotificationCenter::postNotification('CliqrQuestionWillStart', $assignment);
        if (!$assignment->store()) {
            throw new \RuntimeException('Could not store assignment');
        }
        \NotificationCenter::postNotification('CliqrQuestionDidStart', $assignment);

        return $assignment;
    }
}

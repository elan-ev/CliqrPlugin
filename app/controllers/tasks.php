<?php

namespace Cliqr;

use Cliqr\DB\Task;

require_once 'cliqr_studip_controller.php';

class TasksController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $this->cid = self::requireContext();

        if (in_array($action, words('create update'))) {
            if (!$this->hasJSONContentType()) {
                throw new \Trails_Exception(400, 'TODO: has to be JSON');
            }
            $this->json = $this->parseJSONBody();
        }
    }

    /***************************************************************************/
    /* ACTIONS                                                                 */
    /***************************************************************************/

    public function create_action()
    {
        if (!$this->can('create', 'Task')) {
            throw new \Trails_Exception(403);
        }

        if (!array_key_exists('task_group_id', $this->json)) {
            throw new \Trails_Exception(400, 'TODO: task_group_id required');
        }

        // TODO sieht hier seltsam/smelly aus
        $this->json['user_id'] = $GLOBALS['user']->id;

        $task = Task::createInTaskGroup($this->cid, $this->json['task_group_id'], $this->json);
        $this->render_json($task->toJSON());
    }

    public function show_action($id)
    {
        $task = Task::find($id);

        if (!$this->can('read', 'Task', $task)) {
            throw new \Trails_Exception(403);
        }

        if (!$task) {
            throw new \Cliqr\RecordNotFound();
        }

        $this->render_json($task->toJSON());
    }

    public function update_action($id)
    {
        $task = Task::find($id);

        if (!$this->can('update', 'Task', $task)) {
            throw new \Trails_Exception(403);
        }

        if (!$task) {
            throw new Cliqr\RecordNotFound();
        }

        foreach (words('title description task') as $key) {
            if (array_key_exists($key, $this->json)) {
                $task->setValue($key, $this->json[$key]);
            }
        }

        if ($task->isDirty()) {
            $task->changed = date('c');
        }

        // TODO: validate model
        $task->store();

        return $this->render_json($task->toJSON());
    }

    public function destroy_action($id)
    {
        $task = Task::find($id);

        if (!$this->can('create', 'Task', $task)) {
            throw new \Trails_Exception(403);
        }

        if (!$task) {
            throw new \Cliqr\RecordNotFound();
        }

        // find assignments/votings containing this task only and delete them
        $singleTasker = $task->getVotings()->filter(function ($ass) {
            return $ass->isVoting() && $ass->countTasks() == 1;
        });
        $counts = \SimpleORMapCollection::createFromArray($singleTasker->pluck('test'))
                ->sendMessage('delete');

        // now delete the row (and TestTasks, Responses)
        $rows = $task->delete();

        $this->render_json(['status' => 'ok']);
    }
}

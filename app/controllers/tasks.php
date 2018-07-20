<?php

namespace Cliqr;

use Cliqr\DB\Task;

require_once 'cliqr_studip_controller.php';

/**
 * @property string $cid
 * @property array $json
 */
class TasksController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $this->cid = $this->requireContext();

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

    public function show_action($id)
    {
        /** @var Task $task */
        $task = Task::find($id);

        if (!$this->can('read', 'Task', $task)) {
            throw new \Trails_Exception(403);
        }

        if (!$task) {
            throw new \Cliqr\RecordNotFound();
        }

        $this->render_json($task->toJSON());
    }

    public function create_action()
    {
        if (!$this->can('create', 'Task')) {
            throw new \Trails_Exception(403);
        }

        foreach (words('task_group_id type task description') as $key) {
            if (!array_key_exists($key, $this->json)) {
                throw new \Trails_Exception(400, 'TODO: '.$key.' required');
            }
        }

        $knownTypes = $this->getKnownTypes();
        if (!isset($knownTypes[$this->json['type']])) {
            throw new \Trails_Exception(400, 'TODO: wrong type');
        }

        $data = [
            'description' => $this->json['description'],
            'task' => $this->json['task'],
            'type' => $this->json['type'],
            'user_id' => $GLOBALS['user']->id,
        ];

        if (array_key_exists('title', $this->json)) {
            $data['title'] = $this->json['title'];
        }

        $task = Task::build($data);

        $task = $this->validateTask($this->json['type'], $task);

        $task->createInTaskGroup($this->cid, $this->json['task_group_id']);

        $this->render_json($task->toJSON());
    }

    public function update_action($id)
    {
        // find it
        /** @var Task $task */
        $task = Task::find($id);
        if ($this->cannot('update', 'Task', $task)) {
            throw new \Trails_Exception(403);
        }
        if (!$task) {
            throw new \Cliqr\RecordNotFound();
        }

        // tasks cannot be updated as soon as they have responses
        if (count($task->responses)) {
            throw new \Trails_Exception(409, 'Cannot update task already used.');
        }

        foreach (words('type task description') as $key) {
            if (!array_key_exists($key, $this->json)) {
                throw new \Trails_Exception(400, 'TODO: '.$key.' required');
            }
        }

        $knownTypes = $this->getKnownTypes();
        if (!isset($knownTypes[$this->json['type']])) {
            throw new \Trails_Exception(400, 'TODO: wrong type');
        }

        foreach (words('task title description') as $key) {
            if (array_key_exists($key, $this->json)) {
                $task->$key = $this->json[$key];
            }
        }

        $task = $this->validateTask($this->json['type'], $task);

        $task->store();

        return $this->render_json($task->toJSON());
    }

    public function destroy_action($id)
    {
        /** @var Task $task */
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

    // make a copy of a task in the same task group and redirect to that copy
    public function duplicate_action($id)
    {
        /** @var Task $task */
        $task = Task::find($id);

        if ($this->cannot('create', 'Task', $task)) {
            throw new \Trails_Exception(403);
        }

        if (!$task) {
            throw new \Cliqr\RecordNotFound();
        }

        $duplicate = $task->duplicateInTaskGroup();

        $this->redirect('tasks/show/'.$duplicate->id);
    }

    private function validateTask($type, $task)
    {
        $taskType = $this->getTaskType($type);
        $task = $taskType->transformBeforeSave($task);
        if (!$taskType->isValid($task)) {
            throw new \Trails_Exception(400, $taskType->validationError);
        }

        return $task;
    }
}

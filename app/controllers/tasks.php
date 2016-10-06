<?php

namespace Cliqr;

use Cliqr\DB\Task;
use Cliqr\TaskTypes\MultipleChoice;
use STUDIP\Markup;

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

        foreach (words('task_group_id type task description') as $key) {
            if (!array_key_exists($key, $this->json)) {
                throw new \Trails_Exception(400, 'TODO: '.$key.' required');
            }
        }

        if ($this->json['type'] !== 'multiple-choice') {
            throw new \Trails_Exception(400, 'TODO: wrong type');
        }

        /*
        $taskType = new MultipleChoice($task);
        $specifics = $taskType->foo($this->json['task']);
        */

        $data = [
            'description' => Markup::markAsHtml(Markup::purify((string) $this->json['description'])),
            'task' => $this->json['task'],
            'type' => $this->json['type'],
            'user_id' => $GLOBALS['user']->id
        ];

        $task = Task::createInTaskGroup($this->cid, $this->json['task_group_id'], $data);
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

        #$taskType = new MultipleChoice($task);
        #var_dump($taskType->transformBeforeSave());exit;

        $this->render_json($task->toJSON());
    }

    public function update_action($id)
    {
        $task = Task::find($id);

        if (!$this->can('update', 'Task', $task)) {
            throw new \Trails_Exception(403);
        }

        if (!$task) {
            throw new \Cliqr\RecordNotFound();
        }

        // tasks cannot be updated as soon as they have responses
        if (count($task->responses)) {
            throw new \Trails_Exception(409, 'Cannot update task already used.');
        }

        if (array_key_exists('task', $this->json)) {
            /*
              $taskType = new MultipleChoice($task);
              $specifics = $taskType->foo($this->json['task']);
              $task->task = $specifics;
            */
            $task->task = $this->json['task'];
        }

        // wysiwyg description
        if (array_key_exists('title', $this->json)) {
            $task->title = $this->json['title'];
        }

        // wysiwyg description
        if (array_key_exists('description', $this->json)) {
            $task->description = Markup::markAsHtml(Markup::purify((string) $this->json['description']));
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

    // make a copy of a task in the same task group and redirect to that copy
    public function duplicate_action($id)
    {
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
}

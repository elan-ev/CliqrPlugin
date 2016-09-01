<?php
require_once 'cliqr_controller.php';

use \Cliqr\DB\Task;

class TasksController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $this->cid = self::requireContext();
        self::requireAuthorisation($this->cid);

        if (in_array($action, words("create"))) {
            if (!$this->hasJSONContentType()) {
                throw new \Trails_Exception(400, 'TODO: has to be JSON');
            }
            $this->json = $this->parseJSONBody();
        }
    }

    /***************************************************************************/
    /* ACTIONS                                                                 */
    /***************************************************************************/

    function show_action($id)
    {
        $result = null;
        if ($task = Task::find($id)) {
            // TODO: Rechteprüfung

            $result = $task->toJSON();
        }
        $this->render_json($result);
    }

    function create_action()
    {
        if (!array_key_exists('task_group_id', $this->json)) {
            throw new \Trails_Exception(400, 'TODO: task_group_id required');
        }

        // TODO sieht hier seltsam/smelly aus
        $this->json['user_id'] = $GLOBALS['user']->id;

        $task = Task::createInTaskGroup($this->cid, $this->json['task_group_id'], $this->json);
        $this->render_json($task->toJSON());
    }

    function destroy_action($id)
    {
        $result = null;

        $task = Task::find($id);
        if ($task) {
            // TODO: Rechteprüfung

            // TODO
            //$rows = $task->delete();

            $tests = $task->getTests();
            $counts = $task->getTests()->map(function ($test) {
                return [$test->countTasks(), $test->options];
            });

            $result = ['status' => 'ok', 'rows_deleted' => $rows, 'counts' => $counts];
        }

        $this->render_json($result);
    }
}

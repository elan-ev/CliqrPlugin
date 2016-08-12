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
    }

    /***************************************************************************/
    /* ACTIONS                                                                 */
    /***************************************************************************/

    function show_action($id)
    {
        $result = null;
        if ($task = Task::find($id)) {
            $result = $task->toJSON();
        }
        $this->render_json($result);
    }
}

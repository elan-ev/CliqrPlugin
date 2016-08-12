<?php
require_once 'cliqr_controller.php';

use \Cliqr\DB\Assignment;
use \Cliqr\DB\Test;

class TaskGroupsController extends CliqrStudipController
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

    function index_action()
    {
        $taskGroups = Assignment::findTaskGroups($this->cid);
        $tests = $taskGroups->pluck('test');

        $this->render_json(array_map(function ($test) {
            return $test->toJSON();
        }, $tests));
    }

    function show_action($id)
    {
        $result = null;
        if ($assignment = Assignment::findTaskGroup($this->cid, $id)) {
            // TODO Rechtecheck
            $result = $assignment->test->toJSON();
        }
        $this->render_json($result);
    }
}

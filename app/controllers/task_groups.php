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
        $this->render_json($taskGroups->toJSON());
    }

    function show_action($id)
    {
        $result = null;
        if ($assignment = Assignment::findTaskGroup($this->cid, $id)) {
            // TODO Rechtecheck
            $result = $assignment->toJSON();
        }
        $this->render_json($result);
    }

    function create_action()
    {

        if (!$this->hasJSONContentType()) {
            throw new \Trails_Exception(400, 'TODO: has to be JSON');
        }
        $json = $this->parseJSONBody();

        if (!array_key_exists('title', $json)) {
            throw new \Trails_Exception(400, 'TODO: title required');
        }

        $taskGroup = Assignment::createTaskGroup('course', $this->cid, $json);

        $this->render_json($taskGroup->toJSON());
    }

    function destroy_action($id)
    {
        $result = null;
        if ($assignment = Assignment::findTaskGroup($this->cid, $id)) {
            // TODO Rechtecheck
            $test = $assignment->test;
            $test->delete();
        }
        $this->render_json(['status' => 'OK', 'rows_deleted' => $rows]);
    }
}

<?php
require_once 'cliqr_controller.php';

use \Cliqr\DB\Assignment;
use \Cliqr\DB\Task;

class VotingsController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $this->cid = self::requireContext();
        self::requireAuthorisation($this->cid);

        if (in_array($action, words("create update"))) {
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
        if ($voting = Assignment::findVoting($this->cid, $id)) {
            $result = $voting->toJSON();
        }
        $this->render_json($result);
    }

    function create_action()
    {
        if (!array_key_exists('task_id', $this->json)) {
            throw new \Trails_Exception(400, 'TODO: task_id required');
        }

        if ($task = Task::find($this->json['task_id'])) {
            // TODO: Rechteprüfung

            $stopped_count = Assignment::stopAllVotings('course', $this->cid);

            $voting = $task->startTask(['course', $this->cid], time(), time() + 2 * 60 * 60);

            return $this->render_json($voting->toJSON());
        }

        throw new \Cliqr\RecordNotFound();
    }

    function update_action($id)
    {
        $result = null;
        if ($voting = Assignment::findVoting($this->cid, $id)) {

            // TODO: Rechtecheck

            // TODO: only updating the `end` for now
            if (!array_key_exists('end', $this->json)) {
                throw new \Trails_Exception(400, 'TODO: end required');
            }
            $voting->end = $this->json['end'];

            // TODO: validate model
            $voting->store();

            return $this->render_json($voting->toJSON());
        }

        throw new \Cliqr\RecordNotFound();
    }
}

<?php

namespace Cliqr;

use Cliqr\DB\Assignment;
use Cliqr\DB\Task;

require_once 'cliqr_studip_controller.php';

class VotingsController extends CliqrStudipController
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

    public function index_action()
    {
        $votings = Assignment::findOldVotings('course', $this->cid);

        if (!$this->can('read', 'Voting', $votings->first())) {
            throw new \Trails_Exception(403);
        }

        $this->render_json($votings->toJSON());
    }

    public function show_action($id)
    {
        $voting = Assignment::findVoting($this->cid, $id);

        if (!$this->can('read', 'Voting', $voting)) {
            throw new \Trails_Exception(403);
        }

        if (!$voting) {
            throw new Cliqr\RecordNotFound();
        }

        $this->render_json($voting->toJSON());
    }

    public function create_action()
    {
        if (!$this->can('create', 'Voting')) {
            throw new \Trails_Exception(403);
        }

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

    public function update_action($id)
    {
        $voting = Assignment::findVoting($this->cid, $id);

        if (!$this->can('update', 'Voting', $voting)) {
            throw new \Trails_Exception(403);
        }

        if (!$voting) {
            throw new Cliqr\RecordNotFound();
        }

        // TODO: only updating the `end` for now
        if (!array_key_exists('end', $this->json)) {
            throw new \Trails_Exception(400, 'TODO: end required');
        }
        $voting->end = $this->json['end'];

        // TODO: validate model
        $voting->store();

        return $this->render_json($voting->toJSON());
    }
}

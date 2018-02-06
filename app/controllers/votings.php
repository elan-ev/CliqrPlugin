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

    public function index_action()
    {
        $votings = Assignment::findOldVotings('course', $this->cid);

        if (!$this->can('read', 'Voting', $votings->first())) {
            throw new \Trails_Exception(403);
        }

        $this->render_json($votings->toJSON(['task.votings']));
    }

    public function show_action($id)
    {
        $voting = Assignment::findVoting($this->cid, $id);

        if (!$this->can('read', 'Voting', $voting)) {
            throw new \Trails_Exception(403);
        }

        if (!$voting) {
            throw new \Cliqr\RecordNotFound();
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

            Assignment::stopAllVotings('course', $this->cid);

            $now = time();
            $startTime = intval($now / 60 ) * 60;
            $endTime = $startTime + 2 * 60 * 60;
            $voting = $task->startTask(['course', $this->cid], $startTime, $endTime);

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
            throw new \Cliqr\RecordNotFound();
        }

        if (!array_key_exists('end', $this->json)) {
            throw new \Trails_Exception(400, 'TODO: end required');
        }
        $end = $this->json['end'];

        $regexp = '/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/';
        if (!filter_var($end, FILTER_VALIDATE_REGEXP, ['options' => compact('regexp')])) {
            throw new \Trails_Exception(400, 'end must be an ISO 8601 date formatted string');
        }

        $voting->end = $end;

        // TODO: validate model
        $voting->store();

        return $this->render_json($voting->toJSON());
    }
}

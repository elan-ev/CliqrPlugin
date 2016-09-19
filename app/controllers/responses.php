<?php

namespace Cliqr;

use Cliqr\DB\Assignment;
use Cliqr\DB\Response;
use Cliqr\DB\TestTask;

require_once 'cliqr_studip_controller.php';

class ResponsesController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $this->cid = self::requireContext();

        if (in_array($action, words('create'))) {
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
        if (!$this->can('create', 'Response')) {
            throw new \Trails_Exception(403);
        }

        // ensure voting_id, task_id and the response's content
        foreach (words('voting_id task_id response') as $key) {
            if (!array_key_exists($key, $this->json)) {
                throw new \Trails_Exception(400, 'Could not create response');
            }
        }

        // try to find the voting
        if (!$assignment = Assignment::findVoting($this->cid, $this->json['voting_id'])) {
            throw new \Trails_Exception(400, 'Could not create response');
        }

        // try to find a TestTask
        if (!TestTask::find([$assignment->test_id, $this->json['task_id']])) {
            throw new \Trails_Exception(400, 'Could not create response');
        }

        $now = date('c');
        $response = Response::create(
            [
                'assignment_id' => $this->json['voting_id'],
                'task_id' => $this->json['task_id'],
                'user_id' => '', // !!!
                'response' => $this->json['response'],
                'created' => $now,
                'changed' => $now,
                'options' => [],
            ]);

        return $this->render_json($response->toJSON());
    }
}

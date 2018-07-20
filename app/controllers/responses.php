<?php

namespace Cliqr;

use Cliqr\DB\Assignment;
use Cliqr\DB\Response;
use Cliqr\DB\TestTask;

require_once 'cliqr_studip_controller.php';

/**
 * @property array $json
 */
class ResponsesController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

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

        // ensure cid voting_id, task_id and the response's content
        foreach (words('course_id voting_id task_id response') as $key) {
            if (!array_key_exists($key, $this->json)) {
                throw new \Trails_Exception(400, 'Could not create response');
            }
        }

        // try to find the voting
        if (!$assignment = Assignment::findVoting($this->json['course_id'], $this->json['voting_id'])) {
            throw new \Trails_Exception(400, 'Could not create response');
        }

        // try to find a TestTask
        if (!TestTask::find([$assignment->test_id, $this->json['task_id']])) {
            throw new \Trails_Exception(400, 'Could not create response');
        }

        $now = time();
        /** @var Response $response */
        $response = Response::build(
            [
                'assignment_id' => $this->json['voting_id'],
                'task_id' => $this->json['task_id'],
                'user_id' => '', // !!!
                'response' => $this->json['response'],
                'mkdate' => $now,
                'chdate' => $now,
                'options' => [],
            ]
        );

        $this->validateResponse($response);
        if (!$response->store()) {
            throw new \Trails_Exception(500);
        }

        return $this->render_json($response->toJSON());
    }

    private function validateResponse(Response $response)
    {
        $taskType = $this->getTaskType($response->task->type);
        if (!$taskType->isValidResponse($response)) {
            throw new \Trails_Exception(400, $taskType->validationError);
        }
    }
}

<?php
require_once 'cliqr_controller.php';

use \Cliqr\DB\Assignment;
use \Cliqr\DB\Response;
use \Cliqr\DB\Task;
use \Cliqr\DB\TestTask;

class ResponsesController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $this->cid = self::requireContext();

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

    function create_action()
    {
        // ensure assignment_id, task_id and the response's content
        foreach(words('assignment_id task_id response') as $key) {
            if (!array_key_exists($key, $this->json)) {
                throw new \Trails_Exception(400, 'Could not create response');
            }
        }

        // try to find the voting
        if (!$assignment = Assignment::findVoting($this->cid, $this->json['assignment_id'])) {
            throw new \Trails_Exception(400, 'Could not create response');
        }

        // try to find a TestTask
        if (!TestTask::find([$assignment->test_id, $this->json['task_id']])) {
            throw new \Trails_Exception(400, 'Could not create response');
        }

        $now = date('c');
        $response = Response::create(
            [
                'assignment_id' => $this->json['assignment_id'],
                'task_id' => $this->json['task_id'],
                'user_id' => '', // !!!
                'response' => $this->json['response'],
                'created' => $now,
                'changed' => $now,
                'options' => []
            ]);

        return $this->render_json($response->toJSON());
    }
}

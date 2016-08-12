<?php
require_once 'cliqr_controller.php';

use \Cliqr\DB\Assignment;
use \Cliqr\DB\Test;

class AppController extends CliqrStudipController
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

    function index_action() {
        $this->json = [
            'taskGroups' => $this->getTaskGroupsJSON($this->cid)
        ];

        $this->short_url = $this->generateShortURL();
    }

    private function getTaskGroupsJSON($cid)
    {
        $taskGroups = Assignment::findTaskGroups($cid);
        $tests = $taskGroups->pluck('test');
        return array_map(function ($test) { return $test->toJSON(); }, $tests);
    }

    # get poll URL and shorten it
    private function generateShortURL()
    {
        $poll_url = $this->poll_url($this->cid);
        return $this->plugin->config['shortener']->shorten($poll_url);
    }
}

<?php
require_once 'cliqr_controller.php';

use \Cliqr\DB\Assignment;

class PollsController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        # URL: /cliqr/polls/:range_id
        $range_id = self::ensureMD5($action);

        # check activation of this plugin in range_id
        if (!$this->plugin->isActivated($range_id)) {
            throw new \Cliqr\RecordNotFound();
        }

        # transform params
        # $action -> show/update, $args -> [range_id]
        $action = Request::method() === 'POST' && !Request::submitted('login_ticket') ? 'update' : 'index';
        $args = array($range_id);
    }

    function index_action($cid)
    {
        $this->json = [ 'polls' => $this->getPollsJSON($cid) ];
        $this->cid = $cid;
    }

    private function getPollsJSON($cid)
    {
        $polls = Assignment::findVotingsAt('course', $cid, time());
        return $polls->toJSON('test');
    }
}

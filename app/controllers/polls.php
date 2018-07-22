<?php

namespace Cliqr;

use Cliqr\DB\Assignment;

require_once 'cliqr_studip_controller.php';

/**
 * @property string $cid
 * @property array $json
 */
class PollsController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        // URL: /cliqr/polls/:range_id
        $range_id = self::ensureMD5($action);

        // check activation of this plugin in range_id
        if (!$this->plugin->isActivated($range_id)) {
            throw new \Cliqr\RecordNotFound();
        }

        // transform params
        // $action -> show/update, $args -> [range_id]
        $action = \Request::method() === 'POST' && !\Request::submitted('login_ticket') ? 'update' : 'index';
        $args = array($range_id);
    }

    public function index_action($cid)
    {
        $this->json = ['polls' => $this->getPollsJSON($cid)];

        if ($this->wantsJSON()) {
            $this->render_json($this->getPollsJSON($cid));
        } else {
            $this->cid = $cid;
            $this->course = \Course::find($cid);
        }
    }

    private function getPollsJSON($cid)
    {
        $polls = Assignment::findVotingsAt('course', $cid, time());

        return $polls->toJSON(['assignment.responses']);
    }

    private function wantsJSON()
    {
        return strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
    }
}

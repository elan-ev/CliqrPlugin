<?php
global $sess;
require_once "lib/vote/vote.config.php";
require_once "lib/vote/Vote.class.php";

require_once 'cliqr_controller.php';

class PollController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        # URL: /cliqr/poll/:range_id
        $range_id = self::ensureMD5($action);

        # check activation of this plugin in range_id
        if (!$this->plugin->isActivated($range_id)) {
            throw new Trails_Exception(404);
        }

        # transform params
        # $action -> show/update, $args -> [range_id]
        $action = Request::method() === 'POST' ? 'update' : 'show';
        $args = array($range_id);
    }

    # GET: /cliqr/poll/:range_id
    function show_action($range_id)
    {
        # set questions
        $this->questions = \Cliqr\Question::findAllActive($range_id);

        if (Request::isXhr()) {
            $this->render_json(
                array_map(function ($q) { return $q->toJSON(false); },
                          $this->questions));
        }
        else {
            # render template implicitly
            $this->range_id = $range_id;
        }
    }

    # POST: /cliqr/poll/:range_id
    function update_action($range_id)
    {
        $vote_id = self::ensureMD5(Request::option('vote_id'));
        $choice  = self::ensureMD5(Request::option('choice'));

        $q = \Cliqr\Question::find($vote_id);

        # no such active question in this range_id
        if (!$q->isActiveIn($range_id)) {
            throw new Trails_Exception(400);
        }

        $status = $q->recordAnswer($choice);

        if (Request::isXhr()) {
            if ($status) {
                $this->response->set_status(204, "No Content");
                return $this->render_nothing();
            } else {
                throw new Trails_Exception(500, "Could not record");
            }
        }

        else {
            if ($status) {
                $this->response->set_status(204, "No Content");
            } else {
                $this->response->set_status(500, "Could not record");
            }
            # TODO
            $this->render_nothing();
        }
    }
}

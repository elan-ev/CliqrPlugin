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

        self::ensureMD5($action);

        $args = array($this->range_id = $action);
        $action = Request::method() === 'POST' ? 'update' : 'show';
    }

    function show_action($id)
    {
        # set questions
        $this->questions = \Cliqr\Question::findAllActive($this->range_id);

        if (Request::isXhr()) {
            $this->render_json(
                array_map(function ($q) { return $q->toJSON(false); },
                          $this->questions));
        }
    }

    # TODO:
    # currently a POST request to poll/<cid> is mapped to this
    # is this correct?
    function update_action($id)
    {
        $vote_id = Request::option('vote_id');
        $choice  = Request::option('choice');
        self::ensureMD5($vote_id);
        self::ensureMD5($choice);

        # set questions
        # TODO eigentlich reicht die eine Frage ja aus...
        $this->questions = \Cliqr\Question::findAllActive($this->range_id);

        # find requested question
        foreach ($this->questions as $q) {
            if ($q->getVoteID() === $vote_id) {
                break;
            }
        }

        $status = $q->recordAnswer($choice);

        if (Request::isXhr()) {

            if ($status) {
                $this->response->set_status(204, "No Content");
                return $this->render_nothing();
            } else {
                throw new Trails_Exception(500, "Could not record");
            }

            // TODO
        } else {
            var_dump($_POST, $status, $q->getAnswers(), $q->getErrors());
            $this->render_nothing();
        }
    }
}

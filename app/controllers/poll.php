<?php
global $sess;
require_once "lib/vote/vote.config.php";
require_once "lib/vote/Vote.class.php";

require_once 'cliqr_controller.php';

use \Cliqr\Question;

class PollController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {

        parent::before_filter($action, $args);

        if (!preg_match('/^[0-9a-f]{32}$/', $action)) {
            throw new Trails_Exception(400);
        }

        $args = array($range_id = $action);
        $action = Request::method() === 'POST' ? 'update' : 'show';

        # set question
        $this->question = \Cliqr\Question::findActiveByRangeID($range_id);

    }

    function show_action($id)
    {
        var_dump($this->question);
        $this->render_nothing();
    }

    function update_action($id)
    {
        $this->question = Question::find($id);

        var_dump($_POST);
        $this->render_nothing();
    }
}

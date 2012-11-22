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

        /*
        global $perm;
        $this->flash = Trails_Flash::instance();

        # set default layout
        $this->set_layout('layout');

        # set title
        $GLOBALS['CURRENT_PAGE'] = 'Cliqr';
        PageLayout::setTitle(_('Cliqr'));

        $this->cid = Request::get("cid");

        // as anonymous access is possible, do not enable the course
        // navigation when the current user is not signed in
        # TODO
        if ($perm->have_studip_perm("autor", $this->cid)) {
            Navigation::activateItem("/course/cliqr/index");
        }

        # TODO authorisation

        # needs context
        if (in_array($action, words("edit update destroy")) && !$this->cid) {
            throw new Trails_Exception(400);
        }

        # set question
        if (in_array($action, words("show edit update destroy"))) {
            $this->question = $this->getQuestion($args[0]);
        }
        */
    }

    function show_action($id)
    {
        $this->question = Question::find($id);
    }

    function update_action($id)
    {
        $this->question = Question::find($id);

        var_dump($_POST);
        $this->render_nothing();
    }
}

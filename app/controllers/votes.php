<?php
global $sess;
require_once "lib/vote/vote.config.php";
require_once "lib/vote/Vote.class.php";

require_once 'cliqr_controller.php';

require_once dirname(__FILE__) . '/../models/Vote.php';

class VotesController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        global $perm, $template_factory;

        parent::before_filter($action, $args);

        # set default layout
        $this->set_layout($template_factory->open('layouts/base'));

        # set title
        $GLOBALS['CURRENT_PAGE'] = 'Cliqr';
        PageLayout::setTitle(_('Cliqr'));

        $this->cid = Request::get("cid");

        // as anonymous access is possible, do not enable the course
        // navigation when the current user is not signed in
        # TODO
        if ($perm->have_studip_perm("autor", $this->cid)) {
            Navigation::activateItem("/course/cliqr/overview");
        }
    }


    function index_action() {
        // get a list of all active votes
        $voteDb = new VoteDB();
        $this->votes = array_merge(
            $voteDb->getNewVotes($this->cid),
            $voteDb->getActiveVotes($this->cid),
            $voteDb->getStoppedVotes($this->cid));

        foreach($this->votes as $index => &$vote) {
            $this->votes[$index] = new Vote($vote["voteID"]);
        }

        // order votes by title
        usort($this->votes, function($a, $b) {
                return strcasecmp($a->title, $b->title);
            });
    }

    function show_action($id)
    {
        $this->vote = $this->getVote($id);
    }

    # TODO
    function new_action()
    {
    }

    #TODO
    function create_action()
    {
        #var_dump(\Cliqr\Vote::dummy()->save());
        if (Request::isXhr()) {
            $this->render_json($_POST);
        }
        else {
        }
    }

    #TODO
    function edit_action($id)
    {
    }

    #TODO
    function update_action($id)
    {
    }

    function destroy_action($id)
    {
        if (!Request::isPost()) {
            throw new Trails_Exception(405);
        }

        $vote = $this->getVote($id);
        $vote->executeRemove();
        $status = $vote->isError();

        # TODO
        $this->render_text("done: " . !!$status);
    }




    function start_action($voteId)
    {
        $voteDb = new VoteDB();
        $vote = new Vote($voteId);

        if($vote->getRangeID() == Request::get("cid")) {
            $voteDb->startVote($voteId, VOTE_ACTIVE, $vote->getStartdate(),
                               null, null);
        }

        $this->redirect(PluginEngine::getURL($GLOBALS["plugin"], array(),
                                             "cliqrplugin/index"));
    }

    function stop_action($voteId)
    {
        $voteDb = new VoteDB();
        $vote = new Vote($voteId);

        if($vote->getRangeID() == Request::get("cid")) {
            $voteDb->stopVote($voteId, VOTE_STOPPED_VISIBLE, null);
        }

        $this->redirect(PluginEngine::getURL($GLOBALS["plugin"], array(),
                                             "cliqrplugin/index"));
    }

    function results_action($voteId)
    {
        if(Request::isXhr()) {
            $this->set_layout(null);
        }
        $this->vote = new Vote($voteId);
    }

    function showpublic_action($cid)
    {
        $voteDb = new VoteDB();
        $this->votes = $voteDb->getActiveVotes($courseid);
        foreach($this->votes as $index => &$vote) {
            $this->votes[$index] = new Vote($vote["voteID"]);
            $voteDb->setVote($this->votes[$index]);

            // users are not logged in, thus handle votes anonymous
            $this->votes[$index]->anonymous = true;

            // do not allow users to vote twice
            if($voteDb->isAssociated2(CliqrPlugin::getAnonymousUserId())) {
                unset($this->votes[$index]);
            }
        }

        // order votes by title
        usort($this->votes, function($a, $b) {
                return strcasecmp($a->title, $b->title);
            });
    }

    function vote_action($voteId) {
        $voteDb = new VoteDB();
        $vote = new Vote($voteId);

        $voteDb->participate($voteId, CliqrPlugin::getAnonymousUserId(),
                             Request::getArray("answer"), true);

        // get back to the vote view
        $this->redirect(PluginEngine::getURL($GLOBALS["plugin"], array(),
                                             "cliqrplugin/showpublic/" . $vote->getRangeID()));
    }

    private function getVote($id)
    {
        $vote = \Cliqr\Vote::find($id);
        if (!$vote) {
            throw new Trails_Exception(404); # NOT FOUND
        }
        return $vote;
    }
}

<?php
global $sess;
require_once "{$GLOBALS["STUDIP_BASE_PATH"]}/lib/vote/vote.config.php";
require_once "{$GLOBALS["STUDIP_BASE_PATH"]}/lib/vote/Vote.class.php";
require_once __DIR__ . "/../../phpqrcode/qrlib.php";

class CliqrpluginController extends StudipController
{
    public function before_filter(&$action, &$args)
    {
        global $perm;
        
        parent::before_filter($action, $args);

        $GLOBALS['CURRENT_PAGE'] = 'Cliqr';
        PageLayout::setTitle(_('Cliqr'));
        
        # $this->flash = Trails_Flash::instance();
        
        # set default layout
        $layout = $GLOBALS['template_factory']->open('layouts/base');
        $this->set_layout($layout);
        
        // as anonymous access is possible, do not enable the course navigation
        // when the current user is not signed in
        if($perm->have_studip_perm("autor")) {
            Navigation::activateItem("/course/cliqr/overview");
        }
    }
    
    function index_action() {
        // get a list of all active votes
        $courseid = Request::get("cid");
        $voteDb = new VoteDB();
        $this->votes = array_merge($voteDb->getActiveVotes($courseid),
                $voteDb->getStoppedVotes($courseid));
        foreach($this->votes as $index => &$vote) {
            $this->votes[$index] = new Vote($vote["voteID"]);
        }
        
        // order votes by title
        usort($this->votes, function($a, $b) {
            return strcasecmp($a->title, $b->title);
        });
    }
    
    function show_action($voteId)
    {
        $this->courseId = Request::get("cid");
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
    
    function showpublic_action($courseid)
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
    
    function qrcode_action() {
        $this->set_layout(null);
        QRcode::png(Request::get("url"));
        $this->render_nothing();
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

}
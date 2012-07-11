<?php
global $sess;
require_once "{$GLOBALS["STUDIP_BASE_PATH"]}/lib/vote/vote.config.php";
require_once "{$GLOBALS["STUDIP_BASE_PATH"]}/lib/vote/Vote.class.php";
require_once __DIR__ . "/../../phpqrcode/qrlib.php";

class CliqrpluginController extends StudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $GLOBALS['CURRENT_PAGE'] = 'Cliqr';
        PageLayout::setTitle(_('Cliqr'));
        
        # $this->flash = Trails_Flash::instance();
        
        # set default layout
        $layout = $GLOBALS['template_factory']->open('layouts/base');
        $this->set_layout($layout);
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
        $this->voteId = $voteId;
    }
    
    function stop_action($voteId)
    {
        $db = new DB_Seminar();
        $sql = sprintf("UPDATE
                            vote
                        SET
                            state = '%s'
                        WHERE
                            vote_id = '%s' AND
                            range_id = '%s'",
                    VOTE_STOPPED_VISIBLE,
                    $voteId,
                    Request::get("cid"));
        $db->query($sql);
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
    
    function showpublic_action()
    {
        $courseid = Request::get("cid");
        
        $voteDb = new VoteDB();
        $this->votes = $voteDb->getActiveVotes($courseid);
        foreach($this->votes as $index => &$vote) {
            $this->votes[$index] = new Vote($vote["voteID"]);
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

}
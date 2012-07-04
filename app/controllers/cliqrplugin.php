<?php
require_once "{$GLOBALS["STUDIP_BASE_PATH"]}/lib/vote/Vote.class.php";

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
    }
    
    function show_action()
    {
        
    }
    
    function qrcode_action() {
        $this->set_layout(null);
        QRcode::png(Request::get("url"));
    }

}
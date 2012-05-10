<?php
include_once __DIR__ . "/../../phpqrcode/qrlib.php";

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
    
    function show_action()
    {
        
    }
    
    function qrcode_action() {
        $this->set_layout(null);
        QRcode::png(Request::get("url"));
    }

}
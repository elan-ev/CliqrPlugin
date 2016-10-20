<?php

namespace Cliqr;

require_once 'cliqr_studip_controller.php';

class HelpController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);
    }

    public function index_action()
    {
        global $template_factory;
        $this->set_layout($template_factory->open('layouts/base'));

        // set title
        $GLOBALS['CURRENT_PAGE'] = 'Cliqr';
        \PageLayout::setTitle(_('Cliqr - Methodische Informationen'));

        \Navigation::activateItem('/course/cliqr/help');
    }
}

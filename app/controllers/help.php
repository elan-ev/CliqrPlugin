<?

require_once 'cliqr_controller.php';

class HelpController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);
    }

    function index_action()
    {
        global $template_factory;
        $this->set_layout($template_factory->open('layouts/base_without_infobox'));

        # set title
        $GLOBALS['CURRENT_PAGE'] = 'Cliqr';
        PageLayout::setTitle(_('Cliqr - Methodische Informationen'));


        Navigation::activateItem("/course/cliqr/help");
    }
}

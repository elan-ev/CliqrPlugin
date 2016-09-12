<?php

// require composer autoloader
require dirname(__FILE__) . '/vendor/autoload.php';

/**
 * TODO
 *
 * @author  <mlunzena@uos.de>
 **/

class CliqrPlugin extends StudIPPlugin implements StandardPlugin
{
    function __construct()
    {
        parent::__construct();

        $this->setupNavigation();
    }

    function initialize ()
    {

        require_once 'vendor/trails/trails.php';
        require_once 'app/controllers/studip_controller.php';

        $this->config = self::setupConfig();

        $this->observeQuestions();
    }

    private function setupNavigation()
    {
        global $perm;

        $cid = $this->getContext();
        if (Request::isXhr()
            || Navigation::hasItem('/course/cliqr')
            || !$this->isActivated($cid)
            || !$isAtLeastAutor = $perm->have_studip_perm('autor', $cid)) {
            return;
        }

        # /course/cliqr -> plugins.php/cliqrplugin/questions
        $url = PluginEngine::getURL('cliqrplugin', compact('cid'), '', true);

        $navigation = new Navigation(_('Cliqr'), $url);
        $navigation->setImage(Assets::image_path('icons/16/white/test.png'));
        $navigation->setActiveImage(Assets::image_path('icons/16/black/test.png'));

        if ($perm->get_studip_perm($cid) === 'autor') {
            $navigation->addSubNavigation("index", new Navigation(_("Fragenarchiv"), $url . '#'));

        } else {
            $navigation->addSubNavigation("index", new Navigation(_("Fragen"), $url . '#'));

            $navigation->addSubNavigation("archive", new Navigation(_("Archiv"), $url . '#archive'));

            $url = PluginEngine::getURL('cliqrplugin', compact('cid'), 'help', true);
            $navigation->addSubNavigation("help", new Navigation(_("Methodische Informationen"), $url));
        }

        Navigation::addItem('/course/cliqr', $navigation);
    }

    function getContext()
    {
        return Request::option("cid");
    }


    private static function setupConfig()
    {
        require_once 'lib/Container.php';
        return new \Cliqr\Container();
    }


    public function getIconNavigation($course_id, $last_visit, $user_id = null)
    {
        // ...
    }

    public function getInfoTemplate($course_id)
    {
        // ...
    }

    function getTabNavigation($course_id)
    {
        // ...
    }

    function getNotificationObjects($course_id, $since, $user_id)
    {
        // ...
    }


    const DEFAULT_CONTROLLER = 'app';

    function perform($unconsumed_path)
    {
        if (!\Request::isXhr()) {
            $this->setupStudipNavigation();
        }

        $trails_root = $this->getPluginPath() . '/app';
        $dispatcher = new Trails_Dispatcher($trails_root,
                                            rtrim(PluginEngine::getLink($this, [], null), '/'),
                                            self::DEFAULT_CONTROLLER);

        $dispatcher->plugin = $this;
        $dispatcher->container = $this->config;

        $dispatcher->dispatch($unconsumed_path);
    }

    # setup Stud.IP navigation and title
    private function setupStudipNavigation($action = null)
    {
        # set title
        $GLOBALS['CURRENT_PAGE'] = 'Cliqr';
        PageLayout::setTitle($_SESSION['SessSemName']['header_line'] . ' - ' . _('Cliqr'));
    }

    function observeQuestions()
    {
        if ($this->config['pusher_configured']) {
            require_once 'lib/QuestionPusher.php';
            $pusher = new \Cliqr\QuestionPusher($this->config, $this->getContext());
            $pusher->observeNotifications();
        }
    }
}

<?php

// require composer autoloader
require __DIR__.'/vendor/autoload.php';

class CliqrPlugin extends StudIPPlugin implements StandardPlugin
{
    public function __construct()
    {
        parent::__construct();

        $this->setupNavigation();
    }

    public function initialize()
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
            || !$perm->have_studip_perm('autor', $cid)) {
            return;
        }

        // /course/cliqr -> plugins.php/cliqrplugin/questions
        $url = PluginEngine::getURL('cliqrplugin', compact('cid'), '', true);

        $navigation = new Navigation(_('Cliqr'), $url);
        $navigation->setImage(Assets::image_path('icons/16/white/test.png'));
        $navigation->setActiveImage(Assets::image_path('icons/16/black/test.png'));

        if ($perm->get_studip_perm($cid) === 'autor') {
            $navigation->addSubNavigation('index', new Navigation(_('Fragenarchiv'), $url.'#'));
        } else {
            $navigation->addSubNavigation('index', new Navigation(_('Fragen'), $url.'#'));

            $navigation->addSubNavigation('archive', new Navigation(_('Archiv'), $url.'#archive'));

            $url = PluginEngine::getURL('cliqrplugin', compact('cid'), 'help', true);
            $navigation->addSubNavigation('help', new Navigation(_('Methodische Informationen'), $url));
        }

        Navigation::addItem('/course/cliqr', $navigation);
    }

    public function getContext()
    {
        return Request::option('cid');
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

    public function getTabNavigation($course_id)
    {
        // ...
    }

    public function getNotificationObjects($course_id, $since, $user_id)
    {
        // ...
    }

    const DEFAULT_CONTROLLER = 'app';

    public function perform($unconsumedPath)
    {
        if (!\Request::isXhr()) {
            $this->setupStudipNavigation();
        }

        $trailsRoot = $this->getPluginPath().'/app';
        $dispatcher = new \Cliqr\Dispatcher(
            $trailsRoot,
            rtrim(PluginEngine::getLink($this, [], null), '/'),
            self::DEFAULT_CONTROLLER
        );

        $dispatcher->plugin = $this;
        $dispatcher->container = $this->config;

        $dispatcher->dispatch($unconsumedPath);
    }

    // setup Stud.IP navigation and title
    private function setupStudipNavigation($action = null)
    {
        // set title
        $GLOBALS['CURRENT_PAGE'] = 'Cliqr';
        PageLayout::setTitle($_SESSION['SessSemName']['header_line'].' - '._('Cliqr'));
    }

    public function observeQuestions()
    {
        if ($this->config['pusher_configured']) {
            require_once 'lib/QuestionPusher.php';
            $pusher = new \Cliqr\QuestionPusher($this->config, $this->getContext());
            $pusher->observeNotifications();
        }
    }
}

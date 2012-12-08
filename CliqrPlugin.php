<?php

/**
 * CliqrPlugin.class.php
 *
 * cliqrbeschreibung
 *
 * @author  Christian Flothmann <cflothma@uos.de>
 * @author  <mlunzena@uos.de>
 **/

class CliqrPlugin extends StudIPPlugin implements StandardPlugin
{

    public function __construct()
    {
        parent::__construct();
        $this->setupNavigation();

    }

    private function setupNavigation()
    {
        global $perm;

        $context = $this->getContext();
        if (!$this->isActivated($context)
            || !$perm->have_studip_perm("tutor", $context)) {
            return;
        }

        $url = PluginEngine::getURL($this, array(), 'questions');
        $navigation = new Navigation(_('Cliqr'), $url);
        $navigation->setImage(Assets::image_path('icons/16/white/test.png'));
        $navigation->setActiveImage(Assets::image_path('icons/16/black/test.png'));

        $url = PluginEngine::getURL($this, array(), 'questions');
        $navigation->addSubNavigation("index", new Navigation(_("Fragen"), $url));

        $url = PluginEngine::getURL($this, array(), 'questions/new');
        $navigation->addSubNavigation("new", new Navigation(_("Neue Frage"), $url));

        Navigation::addItem('/course/cliqr', $navigation);
    }

    function getContext()
    {
        return Request::option("cid");
    }

    public function initialize ()
    {
        PageLayout::addStylesheet($this->getPluginURL() . '/assets/styles.css');
        PageLayout::addScript($this->getPluginURL() . '/assets/vendor/validator.js');
        PageLayout::addScript($this->getPluginURL() . '/assets/script.js');

        require_once 'vendor/trails/trails.php';
        require_once 'app/controllers/studip_controller.php';

        $this->config = self::setupConfig();
    }

    private static function setupConfig()
    {
        require_once 'Container.php';
        return new \Cliqr\Container();
    }

    public function getIconNavigation($course_id, $last_visit)
    {
        // ...
    }

    public function getInfoTemplate($course_id)
    {
        // ...
    }

    const DEFAULT_CONTROLLER = "questions";

    function perform($unconsumed_path)
    {
        $trails_root = $this->getPluginPath() . "/app";
        $dispatcher = new Trails_Dispatcher($trails_root,
                                            rtrim(PluginEngine::getURL($this, null, ''), '/'),
                                            self::DEFAULT_CONTROLLER);
        $dispatcher->plugin = $this;
        $dispatcher->dispatch($unconsumed_path);
    }

    public static function getAnonymousUserId()
    {
        if(isset($_COOKIE["cliqr_anonymous_userid"])) {
            $userId = $_COOKIE["cliqr_anonymous_userid"];
        } else {
            $userId = md5(mt_rand());
            setcookie("cliqr_anonymous_userid", $userId,
                    time() + 60 * 60 * 24 * 30, "/");
        }

        return $userId;
    }
}

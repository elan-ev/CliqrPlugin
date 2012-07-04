<?php

/**
 * CliqrPlugin.class.php
 *
 * cliqrbeschreibung
 *
 * @author  Christian Flothmann <cflothma@uos.de>
 * @version 0.1a
 **/

class CliqrPlugin extends StudIPPlugin implements StandardPlugin
{

    public function __construct()
    {
        parent::__construct();

        $navigation = new AutoNavigation(_('Cliqr'));
        $navigation->setURL(PluginEngine::GetLink($this, array(), 'cliqrplugin/show'));
        $navigation->setImage(Assets::image_path('blank.gif'));
        Navigation::addItem('/course/cliqr', $navigation);
    }

    public function initialize ()
    {
        PageLayout::addStylesheet($this->getPluginURL() . '/assets/styles.css');
        PageLayout::addScript($this->getPluginURL() . '/assets/script.js');
        require_once 'vendor/trails/trails.php';
        require_once 'app/controllers/studip_controller.php';
        // require_once 'app/controllers/authenticated_controller.php';

    }

    public function getIconNavigation($course_id, $last_visit)
    {
        // ...
    }

    public function getInfoTemplate($course_id)
    {
        // ...
    }

    public function perform($unconsumed_path)
    {
        $trails_root = $this->getPluginPath() . "/app";
        $dispatcher = new Trails_Dispatcher($trails_root,
                PluginEngine::getUrl('cliqr'),
                'index');
        $dispatcher->dispatch($unconsumed_path);
    }
}

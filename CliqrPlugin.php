<?php

use Cliqr\DB\Assignment;

class CliqrPlugin extends StudIPPlugin implements StandardPlugin
{
    public $config;

    public function __construct()
    {
        parent::__construct();

        require_once __DIR__.'/vendor/autoload.php';
    }

    public function initialize()
    {
        $this->config = new \Cliqr\Container();
        $this->observeQuestions();
        $this->initializeCourse();
    }

    public function getContext()
    {
        global $user;

        return (\Request::int('cancel_login')
                && (!is_object($user) || 'nobody' === $user->id))
            ? null
            : Request::option('cid');
    }

    /**
     * {@inheritdoc}
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function getIconNavigation($courseId, $lastVisit, $userId = null)
    {
        // ...
    }

    /**
     * {@inheritdoc}
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function getInfoTemplate($courseId)
    {
        // ...
    }

    public function getTabNavigation($cid)
    {
        $url = \PluginEngine::getURL($this, compact('cid'), '', true);
        $cliqr = new Navigation('Cliqr', $url);

        return compact('cliqr');
    }

    /**
     * {@inheritdoc}
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function getNotificationObjects($courseId, $since, $userId)
    {
        // ...
    }

    const DEFAULT_CONTROLLER = 'app';

    /**
     * {@inheritdoc}
     *
     * @SuppressWarnings(PHPMD.Superglobals)
     */
    public function perform($unconsumedPath)
    {
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

    public function observeQuestions()
    {
        if ($this->config['pusher_configured']) {
            require_once 'lib/QuestionPusher.php';
            $pusher = new \Cliqr\QuestionPusher($this->config, $this->getContext());
            $pusher->observeNotifications();
        }
    }

    private function initializeCourse()
    {
        if (!$cid = $this->config['cid']) {
            return;
        }

        if (!$course = Course::find($cid)) {
            throw new \Cliqr\RecordNotFound();
        }

        $datafields = DatafieldEntryModel::findByModel(
            $course,
            $this->config['datafield_first_run_complete_id']
        );
        if (1 !== count($datafields)) {
            throw new RuntimeException('Missing Cliqr First Run Datafield');
        }
        $firstRunComplete = $datafields[0];
        $initialized = (bool) $firstRunComplete->content;
        if (!$initialized) {
            // create default task group
            if (!count(Assignment::findTaskGroups($cid))) {
                Assignment::createTaskGroup('course', $cid);
            }

            $firstRunComplete->content = 1;
            $firstRunComplete->store();
        }
    }

    public static function onEnable($pluginId)
    {
        // enable nobody role by default
        \RolePersistence::assignPluginRoles($pluginId, array(7));
    }

    /**
     * {@inheritdoc}
     *
     * @SuppressWarnings(PHPMD.Superglobals)
     */
    public function getMetadata()
    {
        $metadata = parent::getMetadata();

        if (version_compare($GLOBALS['SOFTWARE_VERSION'], '4', '>=')) {
            foreach ($metadata as $key => $value) {
                if (is_string($value)) {
                    $metadata[$key] = utf8_encode($value);
                }
            }
        }

        return $metadata;
    }
}

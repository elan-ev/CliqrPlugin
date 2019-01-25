<?php

namespace Cliqr;

/**
 * @property \CliqrPlugin $plugin
 * @property \Pimple      $container
 */
abstract class CliqrStudipController extends \StudipController
{
    /**
     * @SuppressWarnings(PHPMD.CamelCaseMethodName)
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function before_filter(&$action, &$args)
    {
        $this->plugin = $this->dispatcher->plugin;
        $this->container = $this->dispatcher->container;
    }

    /**
     * @SuppressWarnings(PHPMD.CamelCaseMethodName)
     * @SuppressWarnings(PHPMD.Superglobals)
     */
    protected function polls_url($cid)
    {
        $absBase = $GLOBALS['ABSOLUTE_URI_STUDIP'];

        // force an absolute URL
        \URLHelper::setBaseURL($absBase);

        $url = current(explode('?', $this->url_for('polls', $cid))).'?cancel_login=1';

        // reset to the default set in plugins.php
        \URLHelper::setBaseURL($GLOBALS['CANONICAL_RELATIVE_PATH_STUDIP']);

        return $url;
    }

    /**
     * @SuppressWarnings(PHPMD.CamelCaseMethodName)
     */
    public function url_for($toUrl = '')
    {
        $args = func_get_args();

        // find params
        $params = array();
        if (is_array(end($args))) {
            $params = array_pop($args);
        }

        // urlencode all but the first argument
        $args = array_map('urlencode', $args);
        $args[0] = $toUrl;

        return \PluginEngine::getURL($this->dispatcher->plugin, $params, implode('/', $args));
    }

    /**
     * @SuppressWarnings(PHPMD.CamelCaseMethodName)
     */
    public function render_json($data)
    {
        $this->response->add_header('Content-Type', 'application/json;charset=utf-8');
        $this->render_text(json_encode(studip_utf8encode($data)));
    }

    /**
     * Return the Content-Type of the HTTP request.
     *
     * @return string|null the content type
     *
     * @SuppressWarnings(PHPMD.Superglobals)
     */
    private function contentType()
    {
        if (preg_match('/^([^,\;]*)/', @$_SERVER['CONTENT_TYPE'], $matches)) {
            return strtolower(trim($matches[1]));
        }

        return null;
    }

    /**
     * Determine whether this Request has a Content-type of
     * application/json.
     *
     * @return bool true if it has, otherwise false
     */
    protected function hasJSONContentType()
    {
        return 'application/json' === $this->contentType();
    }

    /**
     * Decode the request body using json_decode and utf8decode.
     *
     * @return mixed the decoded request body
     */
    protected function parseJSONBody()
    {
        $body = file_get_contents('php://input');

        return studip_utf8decode(json_decode($body, true));
    }

    /**
     * Exception handler called when the performance of an action raises an
     * exception.
     *
     * @param object $exception the thrown exception
     */
    public function rescue($exception)
    {
        if ($exception instanceof \Cliqr\RecordNotFound) {
            return $this->dispatcher->trails_error(
                new \Trails_Exception(404, 'Record not found'));
        } else {
            throw $exception;
        }
    }

    protected static function ensureMD5($md5ish)
    {
        if (!preg_match('/^[0-9a-f]{32}$/', $md5ish)) {
            throw new \Trails_Exception(400);
        }

        return $md5ish;
    }

    // require a cid; throw a 400 otherwise
    protected function requireContext()
    {
        $cid = self::ensureMD5(\Request::option('cid'));

        if (!$this->plugin->isActivated($cid)) {
            throw new \Trails_Exception(404, 'Das Plugin ist hier nicht aktiviert.');
        }

        return $cid;
    }

    // require ´tutor´ permission; throw a 403 otherwise

    /**
     * @SuppressWarnings(PHPMD.Superglobals)
     */
    protected static function requireAuthorisation($cid)
    {
        if (!$GLOBALS['perm']->have_studip_perm('tutor', $cid)) {
            throw new \Trails_Exception(403);
        }
    }

    protected function can($action, $resource, $resourceValue = null)
    {
        return $this->container['authority']->can($action, $resource, $resourceValue);
    }

    protected function cannot($action, $resource, $resourceValue = null)
    {
        return $this->container['authority']->cannot($action, $resource, $resourceValue);
    }

    /**
     * ignore namespace of controllers
     * {@inheritdoc}
     *
     * @SuppressWarnings(PHPMD.CamelCaseMethodName))
     */
    public function get_default_template($action)
    {
        $class = array_pop(explode('\\', get_class($this)));
        $controllerName =
            \Trails_Inflector::underscore(substr($class, 0, -10));

        return $controllerName.'/'.$action;
    }

    protected function getKnownTypes()
    {
        return [
            'multiple-choice' => '\\Cliqr\\TaskTypes\\MultipleChoice',
            'scales' => '\\Cliqr\\TaskTypes\\Scales',
        ];
    }

    protected function getTaskType($type)
    {
        $knownTypes = $this->getKnownTypes();
        $klass = $knownTypes[$type];

        return new $klass();
    }
}

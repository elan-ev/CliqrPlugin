<?

require_once 'cliqr_controller.php';

require_once dirname(__FILE__) . '/../models/Question.php';

class CliqrStudipController extends StudipController
{
    function before_filter(&$action, &$args)
    {
        $this->plugin = $this->dispatcher->plugin;
    }

    function poll_url($cid)
    {
        global $ABSOLUTE_URI_STUDIP;
        URLHelper::setBaseUrl($ABSOLUTE_URI_STUDIP);
        $url = current(explode('?', $this->url_for('poll', $cid)));
        return $url;
    }


    function url_for($to)
    {
        $args = func_get_args();

        # find params
        $params = array();
        if (is_array(end($args))) {
            $params = array_pop($args);
        }

        # urlencode all but the first argument
        $args = array_map('urlencode', $args);
        $args[0] = $to;

        return PluginEngine::getURL($this->dispatcher->plugin, $params, join('/', $args));
    }

    function render_json($data)
    {
        # TODO besser mit trails
        header('Content-Type: application/json');

        $this->render_text(json_encode($data));
    }

    /**
     * Exception handler called when the performance of an action raises an
     * exception.
     *
     * @param  object     the thrown exception
     */
    function rescue($exception)
    {
        if ($exception instanceof \Cliqr\RecordNotFound) {
            return $this->dispatcher->trails_error(new Trails_Exception(404));
        } else {
            throw $exception;
        }
    }
}

<?

require_once 'cliqr_controller.php';

class CliqrStudipController extends StudipController
{
    function before_filter(&$action, &$args)
    {
        $this->plugin = $this->dispatcher->plugin;
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
}

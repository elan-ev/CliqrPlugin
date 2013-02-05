<?

require_once 'cliqr_controller.php';

class QrController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);
        $args = func_get_args();
        $action = "show";
    }

    function show_action($cid)
    {
        $url = $this->generateURL($cid);
        $this->renderQRCode($url);
        $this->render_nothing();
    }

    private function generateURL($cid)
    {
        $poll_url = $this->poll_url($cid);
        $short_url = $this->plugin->config['shortener']->shorten($poll_url);
        return $short_url;
    }

    private function renderQRCode($url)
    {
        $enc = QRencode::factory();
        $enc->size = 5;
        $enc->margin = 2;
        echo $enc->encodeSVG($url);
    }
}

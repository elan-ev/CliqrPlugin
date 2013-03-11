<?

require_once 'cliqr_controller.php';

class QrController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        # URL: /cliqr/qr/:id
        $cid = self::ensureMD5($action);

        $action = "show";
        $args = array($cid);
    }

    function show_action($cid)
    {
        $url = $this->generateURL($cid);
        $this->renderQRCode($url);
    }

    private function generateURL($cid)
    {
        $poll_url = $this->poll_url($cid);
        $short_url = $this->plugin->config['shortener']->shorten($poll_url);
        return $short_url;
    }

    private function renderQRCode($url)
    {
        $filename = $this->generateFilename($url);

        if (!file_exists($filename)) {
            $this->createQRCode($url, $filename);
        }

        $this->response->add_header('Content-Type', 'image/svg+xml');
        $this->render_text(file_get_contents($filename));
    }

    private function createQRCode($url, $filename)
    {
        $enc = QRencode::factory();
        $enc->size = 5;
        $enc->margin = 2;
        # bug!
        $enc->fore_color = 0x101010;
        return $enc->encodeSVG($url, $filename);
    }

    private function generateFilename($url)
    {
        return $GLOBALS['TMP_PATH'] . '/cliqr-' . md5($url) . '.svg';
    }
}

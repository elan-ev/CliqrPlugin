<?php

namespace Cliqr;

require_once 'cliqr_studip_controller.php';

class QrController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        // URL: /cliqr/qr/:id
        $cid = self::ensureMD5($action);

        $action = 'show';
        $args = array($cid);
    }

    public function show_action($cid)
    {
        $url = $this->generateURL($cid);
        $this->renderQRCode($url);
    }

    private function generateURL($cid)
    {
        $polls_url = $this->polls_url($cid);
        $short_url = $this->plugin->config['shortener']->shorten($polls_url);

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
        $renderer = new \BaconQrCode\Renderer\Image\Svg();
        $renderer->setHeight(256);
        $renderer->setWidth(256);
        $renderer->setMargin(0);
        $writer = new \BaconQrCode\Writer($renderer);
        $writer->writeFile($url, $filename);
    }

    private function generateFilename($url)
    {
        return $GLOBALS['TMP_PATH'].'/cliqr-'.md5($url).'.svg';
    }
}

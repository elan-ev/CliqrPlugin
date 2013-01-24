<?
require_once dirname(dirname(dirname(__FILE__))) . "/phpqrcode/qrlib.php";

require_once 'cliqr_controller.php';

class QrController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);
        $args = func_get_args();
        $action = "show";
    }

    function show_action($cid) {
        QRcode::png($this->poll_url($cid));
        $this->render_nothing();
    }
}

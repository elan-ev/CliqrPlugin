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

    function show_action($id) {
        global $ABSOLUTE_URI_STUDIP;

        URLHelper::setBaseUrl($ABSOLUTE_URI_STUDIP);
        $url = current(explode('?', $this->url_for('questions/todo', $id)));
        QRcode::png($url);
        $this->render_nothing();
    }
}

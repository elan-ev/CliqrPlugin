<?
global $template_factory;
$this->set_layout($template_factory->open('layouts/base_without_infobox'));

class SelfDestroyingMessageBox extends MessageBox {
    public static function info($message, $details = array(), $close_details = false)
    {
        return new MessageBox('info self-destroy', $message, $details, $close_details);
    }
}

if ($flash['error']) {
    echo MessageBox::error('Fehler', array($flash["error"]));
}
if ($flash['info']) {
    echo SelfDestroyingMessageBox::info($flash["info"]);
}

$ASSETS = $plugin->getPluginURL() . '/assets/';
PageLayout::addStylesheet($ASSETS . 'questions/styles.css');
PageLayout::addScript($ASSETS . 'vendor/jquery.isotope.min.js');
PageLayout::addScript($ASSETS . 'vendor/validator.js');
PageLayout::addScript($ASSETS . 'questions/script.js'); # TODO deprecate this


PageLayout::addHeadElement('script', array(),
'// TODO refine this
var cliqr = {model: {}, config: {
    PLUGIN_URL : "' . htmlReady(current(explode('?', $controller->url_for("")))) . '"
  , CID        : "' . htmlReady($cid) . '"
  , ASSETS     : "' . htmlReady($ASSETS) . '"
}}
');
?>

<!-- BEGIN CLIQR PAGE -->
<div class="page">
<?= $content_for_layout ?>
</div>
<!-- END CLIQR PAGE -->

<?= $this->render_partial('mustaches/_include_js_templates', array('prefix' => 'questions-')) ?>

<script data-main="<?= $ASSETS ?>js/require/questions.js"
        src="<?= $ASSETS ?>js/vendor/require.js"></script>

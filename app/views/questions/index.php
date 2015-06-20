<?
global $template_factory;
$this->set_layout($template_factory->open('layouts/base_without_infobox'));

$ASSETS = $plugin->getPluginURL() . '/assets/';
PageLayout::addStylesheet($ASSETS . 'css/questions/styles.css');
PageLayout::addScript($ASSETS . 'js/vendor/validator.js');

PageLayout::addHeadElement('script', array(),
'
var cliqr = {bootstrap: {}, config: {
    PLUGIN_URL : "' . htmlReady(current(explode('?', $controller->url_for("")))) . '"
  , CID        : "' . htmlReady($cid) . '"
  , ASSETS     : "' . htmlReady($ASSETS) . '"
  , SHORT_URL  : "' . htmlReady($short_url) . '"
}};
');
?>

<!-- BEGIN CLIQR PAGE -->
<script>
cliqr.bootstrap.POLLS = <?= json_encode(array_map(function ($q) { return $q->toJSON(); }, $questions)) ?>;
</script>
<div id="cliqr-container"></div>
<!-- END CLIQR PAGE -->

<?= $this->render_partial('hbs/_include_js_templates', array('prefix' => 'questions-')) ?>

<script data-main="<?= $ASSETS ?>js/require/questions.js"
        src="<?= $ASSETS ?>js/vendor/require.js"></script>

<?= $this->render_partial('_noscript') ?>

<?
global $template_factory;
$this->set_layout($template_factory->open('layouts/base_without_infobox'));

$PLGNURL = $plugin->getPluginURL();
$ASSETS = $PLGNURL . '/assets/';
PageLayout::addStylesheet($ASSETS . 'css/questions/styles.css');
PageLayout::addScript($ASSETS . 'js/vendor/jquery.fittext.js');
PageLayout::addScript($ASSETS . 'js/vendor/jquery.elastic.js');

PageLayout::addHeadElement('script', array(), '
var cliqr = {
  bootstrap: ' . json_encode(studip_utf8encode($json))  . ',
  config: {
    PLUGIN_URL : "' . htmlReady(current(explode('?', $controller->url_for('')))) . '"
  , CID        : "' . htmlReady($cid) . '"
  , SHORT_URL  : "' . htmlReady($short_url) . '"
}};');
?>

<!-- BEGIN CLIQR PAGE -->
<div id="cliqr-container"></div>
<?= $this->render_partial('_noscript') ?>

<link charset="utf-8" href="<?= $PLGNURL ?>/static/bundle.css" rel="stylesheet" media="screen, print">
<script charset="utf-8" src="<?= $PLGNURL ?>/static/vendor.bundle.js"></script>
<script charset="utf-8" src="<?= $PLGNURL ?>/static/bundle.js"></script>

<!-- END CLIQR PAGE -->

<?
global $template_factory;
$this->set_layout($template_factory->open('layouts/base'));

$PLGNURL = $plugin->getPluginURL();
$ASSETS = $PLGNURL . '/assets/';
#PageLayout::addStylesheet($ASSETS . 'css/questions/styles.css');

PageLayout::addHeadElement('script', array(), '
var cliqr = {
  bootstrap: ' . json_encode(studip_utf8encode($json))  . ',
  config: {
    PLUGIN_URL : "' . htmlReady(current(explode('?', $controller->url_for('')))) . '"
  , ASSETS_URL : "' . htmlReady($PLGNURL) . '/"
  , CID        : "' . htmlReady($cid) . '"
  , SHORT_URL  : "' . htmlReady($short_url) . '"
}};');
?>

<!-- BEGIN CLIQR PAGE -->
<div id="cliqr"></div>
<?= $this->render_partial('_noscript') ?>

<link charset="utf-8" href="<?= $PLGNURL ?>/static/studip-cliqr.css" rel="stylesheet" media="screen, print">
<script charset="utf-8" src="<?= $PLGNURL ?>/static/studip-cliqr.js"></script>
<!-- END CLIQR PAGE -->

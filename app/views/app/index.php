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
<div id="cliqr-container"></div>
<?= $this->render_partial('_noscript') ?>

<? if (defined('WDS_ACTIVATED') && constant('WDS_ACTIVATED')) { ?>
    <link charset="utf-8" href="https://localhost:8081/bundle.css" rel="stylesheet" media="screen, print">
    <script charset="utf-8" src="https://localhost:8081/studip.js"></script>
<? } else { ?>
    <link charset="utf-8" href="<?= $PLGNURL ?>/static/bundle.css" rel="stylesheet" media="screen, print">
    <script charset="utf-8" src="<?= $PLGNURL ?>/static/studip.js"></script>
<? } ?>
<!-- END CLIQR PAGE -->

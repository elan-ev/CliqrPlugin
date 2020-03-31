<?
global $template_factory;
$this->set_layout($template_factory->open('layouts/base'));

$PLGNURL = $plugin->getPluginURL();
$PLGNVRSN = studip_utf8encode($plugin->getPluginVersion());

PageLayout::addHeadElement('script', array(), '
var cliqr = {
  bootstrap: ' . json_encode(studip_utf8encode($json))  . ',
  config: {
    PLUGIN_URL : "' . htmlReady(current(explode('?', $controller->url_for('')))) . '"
  , ASSETS_URL : "' . htmlReady($PLGNURL) . '/"
  , CID        : "' . htmlReady($cid) . '"
  , SHORT_URL  : "' . htmlReady($short_url) . '"
  },
  version: '.json_encode($PLGNVRSN).'
};');
?>

<!-- BEGIN CLIQR PAGE -->
<div id="cliqr"></div>
<?= $this->render_partial('_noscript') ?>

<link charset="utf-8" href="<?= $PLGNURL ?>/dist/studip-cliqr.css?v=<?= htmlReady($PLGNVRSN) ?>" rel="stylesheet" media="screen, print">
<script charset="utf-8" src="<?= $PLGNURL ?>/dist/studip-cliqr.js?v=<?= htmlReady($PLGNVRSN) ?>"></script>
<!-- END CLIQR PAGE -->

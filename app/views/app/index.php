<?
global $template_factory;
$this->set_layout($template_factory->open('layouts/base'));

$PLGNURL = $plugin->getPluginURL();
$PLGNVRSN = $plugin->getPluginVersion();

$script = [
    'bootstrap' => $json,
    'config' => [
        'ASSETS_URL' => $PLGNURL,
        'CID' => $cid,
        'PLUGIN_URL' => current(explode('?', $controller->url_for(''))),
        'SHORT_URL' => $short_url,
    ],
    'version' => $PLGNVRSN,
];

PageLayout::addHeadElement(
    'script',
    [],
    'var cliqr = ' . json_encode($script, JSON_HEX_TAG | JSON_HEX_AMP),
);
?>

<!-- BEGIN CLIQR PAGE -->
<?php echo file_get_contents(__DIR__ . '/../../../dist/sprite.svg') ?>
<div id="cliqr"></div>
<?= $this->render_partial('_noscript') ?>

<link charset="utf-8" href="<?= $PLGNURL ?>/dist/studip-cliqr.css?v=<?= htmlReady($PLGNVRSN) ?>" rel="stylesheet" media="screen, print">
<script src="<?= $PLGNURL ?>/dist/backbone-min.js"></script>
<script charset="utf-8" src="<?= $PLGNURL ?>/dist/studip-cliqr.js?v=<?= htmlReady($PLGNVRSN) ?>"></script>
<!-- END CLIQR PAGE -->
<!DOCTYPE html>
<html lang="de">
    <head>
        <!-- Required meta tags always come first -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Stud.IP-Cliqr: <?= htmlReady($course->name) ?></title>
        <?
        $PLGNURL = $plugin->getPluginURL();
        $PLGNVRSN = studip_utf8encode($plugin->getPluginVersion());
        $ASSETS = $PLGNURL . '/dist/';

        $cliqrConfig = array_map('htmlReady', [
            'PLUGIN_URL' => current(explode('?', $controller->url_for(''))),
            'ASSETS_URL' => $PLGNURL . '/',
            'CID' => $cid
        ]);
        ?>
        <link rel="stylesheet" href="<?= $ASSETS ?>bulma/bulma.css?v=<?= htmlReady($PLGNVRSN) ?>">
        <link rel="stylesheet" href="<?= $ASSETS ?>rangeslider-2.3.2/rangeslider.min.css" />

        <script>
        var STUDIP = {
            ABSOLUTE_URI_STUDIP: "<?= $GLOBALS['ABSOLUTE_URI_STUDIP'] ?>",
            ASSETS_URL: "<?= $GLOBALS['ASSETS_URL'] ?>",
            STUDIP_SHORT_NAME: "<?= Config::get()->STUDIP_SHORT_NAME ?>"
        };

        var cliqr = {
            bootstrap: <?= json_encode(studip_utf8encode($json)) ?>,
            config: <?= json_encode(studip_utf8encode($cliqrConfig)) ?>,
            version: <?= json_encode($PLGNVRSN) ?>
        };
        </script>
    </head>
    <body>

        <!-- BEGIN CLIQR PAGE -->
        <div id="cliqr-poll-container"></div>
        <?= $this->render_partial('_noscript') ?>
        <!-- END CLIQR PAGE -->

        <script src="<?= $ASSETS ?>jquery-3.3.1/jquery-3.3.1.min.js"></script>
        <script src="<?= $ASSETS ?>rangeslider-2.3.2/rangeslider.min.js"></script>
        <script src="<?= $ASSETS ?>underscore-1.9.1/underscore-min.js"></script>
        <script src="<?= \Assets::javascript_path('mathjax/MathJax.js?config=TeX-AMS_HTML,default') ?>"></script>
        <script charset="utf-8" src="<?= $PLGNURL ?>/dist/polls.js?v=<?= htmlReady($PLGNVRSN) ?>"></script>

    </body>
</html>

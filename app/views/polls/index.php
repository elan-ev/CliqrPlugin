<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- Required meta tags always come first -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">

        <?
        $PLGNURL = $plugin->getPluginURL();
        $ASSETS = $PLGNURL . '/assets/';
        ?>

        <link rel="stylesheet" href="<?= $ASSETS ?>vendor/bootstrap/dist/css/bootstrap.min.css">

        <script>
         var STUDIP = {
             ABSOLUTE_URI_STUDIP: "<?= $GLOBALS['ABSOLUTE_URI_STUDIP'] ?>",
             ASSETS_URL: "<?= $GLOBALS['ASSETS_URL'] ?>",
             STUDIP_SHORT_NAME: "<?= Config::get()->STUDIP_SHORT_NAME ?>"
         };

         var cliqr = {
             bootstrap: <?= json_encode(studip_utf8encode($json)) ?>,
             config: {
                 PLUGIN_URL : "<?= htmlReady(current(explode('?', $controller->url_for('')))) ?>"
               , ASSETS_URL : "<?= htmlReady($PLGNURL) ?>/"
               , CID        : "<?= htmlReady($cid) ?>"
               , SHORT_URL  : "<?= htmlReady($short_url) ?>"
             }};
        </script>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/rangeslider.js/2.2.1/rangeslider.min.css" integrity="sha256-S6p5z6bvs2VqkMZwBeBfRARsc3kToRslSBxY0ueBY8U=" crossorigin="anonymous" />
    </head>
    <body>

        <!-- BEGIN CLIQR PAGE -->
        <div id="cliqr-poll-container"></div>
        <?= $this->render_partial('_noscript') ?>
        <!-- END CLIQR PAGE -->

        <!-- jQuery first, then Tether, then Bootstrap JS. -->
        <script src="<?= $ASSETS ?>vendor/jquery/dist/jquery.min.js"></script>
        <script src="<?= $ASSETS ?>vendor/tether/dist/js/tether.min.js"></script>
        <script src="<?= $ASSETS ?>vendor/bootstrap/dist/js/bootstrap.min.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/rangeslider.js/2.2.1/rangeslider.min.js" integrity="sha256-m1d+U813zD9X9LX/Wb7Q1oH4XiVmqo6uk6kcA2zv7ug=" crossorigin="anonymous"></script>

        <script src="<?= \Assets::javascript_path('mathjax/MathJax.js?config=TeX-AMS_HTML,default') ?>"></script>

        <? if (defined('WDS_ACTIVATED') && constant('WDS_ACTIVATED')) { ?>
            <link charset="utf-8" href="http://localhost:8081/bundle.css" rel="stylesheet" media="screen, print">
            <script charset="utf-8" src="http://localhost:8081/polls.js"></script>
        <? } else { ?>
            <link charset="utf-8" href="<?= $PLGNURL ?>/static/bundle.css" rel="stylesheet" media="screen, print">
            <script charset="utf-8" src="<?= $PLGNURL ?>/static/polls.js"></script>
        <? } ?>

    </body>
</html>

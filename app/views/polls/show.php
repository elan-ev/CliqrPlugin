<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- Required meta tags always come first -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.3/css/bootstrap.min.css" integrity="sha384-MIwDKRSSImVFAZCVLtU0LMDdON6KVCrZHyVQQj6e8wIEJkW4tvwqXrbMIya1vriY" crossorigin="anonymous">

        <?
        $PLGNURL = $plugin->getPluginURL();
        $ASSETS = $PLGNURL . '/assets/';
        ?>

        <script>
         var cliqr = {
             bootstrap: <?= json_encode(studip_utf8encode($json)) ?>,
             config: {
                 PLUGIN_URL : "<?= htmlReady(current(explode('?', $controller->url_for('')))) ?>",
                 CID        : "<?= htmlReady($cid) ?>",
                 SHORT_URL  : "<?= htmlReady($short_url) ?>"
             }};
        </script>

    </head>
    <body>

        <!-- BEGIN CLIQR PAGE -->
        <div id="cliqr-poll-container"></div>
        <?= $this->render_partial('_noscript') ?>
        <!-- END CLIQR PAGE -->

        <!-- jQuery first, then Tether, then Bootstrap JS. -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js" integrity="sha384-THPy051/pYDQGanwU6poAc/hOdQxjnOEXzbT+OuUAFqNqFjL+4IGLBgCJC3ZOShY" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.2.0/js/tether.min.js" integrity="sha384-Plbmg8JY28KFelvJVai01l8WyZzrYWG825m+cZ0eDDS1f7d/js6ikvy1+X+guPIB" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.3/js/bootstrap.min.js" integrity="sha384-ux8v3A6CPtOTqOzMKiuo3d/DomGaaClxFYdCu2HPMBEkf6x2xiDyJ7gkXU0MWwaD" crossorigin="anonymous"></script>

        <script src="<?= $ASSETS ?>js/vendor/jquery.fittext.js"></script>
        <script src="<?= $ASSETS ?>js/vendor/jquery.elastic.js"></script>


        <? if (TRUE || WDS ) { ?>
            <link charset="utf-8" href="http://localhost:8081/bundle.css" rel="stylesheet" media="screen, print">
            <script charset="utf-8" src="http://localhost:8081/vendor.bundle.js"></script>
            <script charset="utf-8" src="http://localhost:8081/polls.js"></script>
        <? } else { ?>
            <link charset="utf-8" href="<?= $PLGNURL ?>/static/bundle.css" rel="stylesheet" media="screen, print">
            <script charset="utf-8" src="<?= $PLGNURL ?>/static/vendor.bundle.js"></script>
            <script charset="utf-8" src="<?= $PLGNURL ?>/static/polls.js"></script>
        <? } ?>

    </body>
</html>

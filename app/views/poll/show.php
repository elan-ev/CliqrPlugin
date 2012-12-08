<? $assets_url = $controller->plugin->getPluginUrl() . '/assets/'; ?>
<!DOCTYPE html>
<html>
  <head>
    <title>Stud.IP &ndash; Cliqr</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="<?= $assets_url ?>vendor/jquery.mobile-1.2.0.css" />
    <link rel="stylesheet" href="<?= $assets_url ?>/presentation.css"/>

<?= $this->render_partial('mustaches/_include_js_templates', array('prefix' => 'poll')) ?>

    <script src="<?= $assets_url ?>vendor/jquery-1.8.2.js"></script>
    <script src="<?= $assets_url ?>vendor/underscore.js"></script>
    <script src="<?= $assets_url ?>vendor/mustache.js"></script>
    <script src="<?= $assets_url ?>vendor/backbone.js"></script>

    <script src="<?= $assets_url ?>jqm-config.js"></script>
    <script src="<?= $assets_url ?>vendor/jquery.mobile-1.2.0.min.js"></script>

    <script src="<?= $assets_url ?>poll.js"></script>

<?
$polls = array_map(function ($q) {
    $json = $q->toJSON();
    foreach ($json['answers'] as &$answer) {
      unset($answer['counter']);
    }
    return $json;
  }, $questions);
?>

    <script>
      cliqr.config.PLUGIN_URL = "<?= htmlReady(current(explode('?', $controller->url_for("")))) ?>";
      cliqr.config.RANGE_ID   = "<?= htmlReady($range_id) ?>";
      cliqr.config.POLLS      = <?= json_encode($polls) ?>;
    </script>

  </head>
  <body>
    <noscript>Kein JS :-( </noscript>
  </body>
</html>

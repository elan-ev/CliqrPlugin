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

    <script src="http://js.pusher.com/1.12/pusher.min.js"></script>

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
      cliqr.config.PLUGIN_URL     = "<?= htmlReady(current(explode('?', $controller->url_for("")))) ?>";
      cliqr.config.CID            = "<?= htmlReady($range_id) ?>";
      cliqr.config.POLLS          = <?= json_encode($polls) ?>;
      cliqr.config.PUSHER_APP_KEY = "<?= htmlReady($plugin->config['ini']['pusher']['key']) ?>";
      cliqr.config.PUSHER_CHANNEL = "<?= htmlReady($plugin->config['pusher_channel']($range_id)) ?>";
    </script>

  </head>
  <body>
    <noscript>
      <h1>
      <?= _("Sie können Cliqr nur verwenden, wenn Sie in Ihrem Browser JavaScript aktiviert haben.") ?>
      </h1>
    </noscript>
  </body>
</html>

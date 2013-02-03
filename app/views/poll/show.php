<? $ASSETS = $controller->plugin->getPluginUrl() . '/assets/'; ?>
<!DOCTYPE html>
<html>
  <head>
    <title>Stud.IP &ndash; Cliqr</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="<?= $ASSETS ?>vendor/jquery.mobile-1.2.0.css" />
    <link rel="stylesheet" href="<?= $ASSETS ?>/presentation.css"/>


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
      var cliqr = { config: {
          PLUGIN_URL     : "<?= htmlReady(current(explode('?', $controller->url_for("")))) ?>"
        , CID            : "<?= htmlReady($range_id) ?>"
        , ASSETS         : "<?= htmlReady($ASSETS) ?>"
        , POLLS          : <?= json_encode($polls) ?>
        , PUSHER_APP_KEY : "<?= htmlReady($plugin->config['ini']['pusher']['key']) ?>"
        , PUSHER_CHANNEL : "<?= htmlReady($plugin->config['pusher_channel']($range_id)) ?>"
      }};
    </script>

    <?= $this->render_partial('mustaches/_include_js_templates', array('prefix' => 'poll')) ?>

  </head>
  <body>
    <noscript>
      <h1>
      <?= _("Sie können Cliqr nur verwenden, wenn Sie in Ihrem Browser JavaScript aktiviert haben.") ?>
      </h1>
    </noscript>

    <script src="http://js.pusher.com/1.12/pusher.min.js"></script>

    <script data-main="<?= $ASSETS ?>js/require_main_poll.js"
            src="<?= $ASSETS ?>js/vendor/require.js"></script>

</body>
</html>

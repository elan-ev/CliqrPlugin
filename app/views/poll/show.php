<!DOCTYPE html>
<html>
  <head>
    <title>Stud.IP &ndash; Cliqr</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.css" />
    <link rel="stylesheet" href="<?= $controller->plugin->getPluginUrl() ?>/assets/presentation.css"/>
    <script src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
    <script src="<?= $controller->plugin->getPluginUrl() ?>/assets/jqm-config.js"></script>
    <script src="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js"></script>
  </head>
  <body>

    <div data-role="page">

      <div data-role="header">
        <h1>Stud.IP &ndash; Cliqr</h1>
      </div>

      <div data-role="content">
        <form action="<?= $controller->url_for('presentations/update', $question->getVoteID()) ?>" method="post">

          <fieldset class="question" data-role="controlgroup">

            <legend><?= htmlReady($question->getTitle()) ?></legend>

            <? foreach ($question->getAnswers() as $i => $answer) { ?>

              <label>
                <input type="radio" name="choice" value="<?= $answer['answer_id'] ?>">
                <span class="nominal"><?= chr(ord("A") + $i % 26) ?>:</span>
                <?= htmlReady($answer['text']) ?>
              </label>

            <? } ?>

          </fieldset>

          <fieldset>
            <button type="submit" data-theme="a">Submit</button>
          </fieldset>
        </form>
      </div>

    </div>

  </body>
</html>

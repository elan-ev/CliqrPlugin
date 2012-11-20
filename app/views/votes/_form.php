<form class="vote-form" action="<?= $controller->url_for("votes/create") ?>" method="post">
  <input type=submit>
  <fieldset>
    <legend><?= _("Frage") ?></legend>
    <label for="question"><?= _("Was möchten Sie fragen?") ?></label>
    <div class="control-group">
      <input autocomplete="off" id="question-text" name="question"
             type="text" value="" required>
    </div>
  </fieldset>

  <fieldset>
    <legend><?= _("Antwortmöglichkeiten") ?></legend>
    <label class="control-label">
      Tragen Sie die Antworten ein
    </label>
    <div class="control-group">
      <?= $this->render_partial("votes/_choice") ?>
      <div class="choice-new">Click here to add option</div>
    </div>
  </fieldset>

  <fieldset>
    <div class="button-group">
      <?= \STUDIP\Button::create("Save and return to home") ?>
      <?= \STUDIP\Button::create("Create another question") ?>
      <?= \STUDIP\Button::create("Start presenting") ?>
    </div>
  </fieldset>
</form>

<script id="template-vote-form-choice" type="text/html">
  <?= $this->render_partial("votes/_choice"/*, array("value" => "<%= value %>")*/) ?>
</script>

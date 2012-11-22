<?
if ($question) {
    $form_action = $controller->url_for("questions/update", $question->getVoteId());
    $answers = $question->getAnswers();
}

else {
    $form_action = $controller->url_for("questions/create");
    $answers = array(array());
}
?>

<form class="vote-form" action="<?= $form_action ?>" method="post">
  <fieldset>
    <legend><?= _("Frage") ?></legend>
    <label for="question"><?= _("Was möchten Sie fragen?") ?></label>
    <div class="control-group">
      <input autocomplete="off" id="question-text" name="question"
             type="text"
             value="<?= $question ? htmlReady($question->getTitle()) : ''?>"
             required>
    </div>
  </fieldset>

  <fieldset>
    <legend><?= _("Antwortmöglichkeiten") ?></legend>
    <label class="control-label">
        <?= _("Tragen Sie die Antworten ein") ?>
    </label>
    <div class="control-group choices">
      <? foreach ($answers as $answer) { ?>
          <?= $this->render_partial("questions/_choice", $answer) ?>
      <? } ?>
      <div class="choice-new">Click here to add option</div>
    </div>
  </fieldset>

  <fieldset>
    <div class="button-group">
      <?= \STUDIP\Button::create("Speichern") ?>
<?= \STUDIP\Button::create("Speichern und eine weitere Frage anlegen", array("disabled"=>"disabled")) ?>
<?= \STUDIP\Button::create("Frage direkt starten", array("disabled"=>"disabled")) ?>
    </div>
  </fieldset>
</form>

<script id="template-vote-form-choice" type="text/html">
  <?= $this->render_partial("questions/_choice") ?>
</script>

<? var_dump($question) ?>

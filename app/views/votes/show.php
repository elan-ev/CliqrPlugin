<? $body_id = "cliqr-show"; ?>

<h2><?= htmlReady($question->getTitle()) ?></h2>

<table class="results">
<? foreach ($question->getAnswers() as $answer) { ?>
  <tr>
    <th>
      <?= htmlReady($answer['text']) ?>
    </th>
    <td data-count="<?= intval($answer['counter']) ?>"><?= intval($answer['counter']) ?></td>
  </tr>
<? } ?>
</table>

<div class="appeal">
  Vote at <strong>v.uos.de</strong> using id: <strong>28851</strong>
  <a href="<?= $controller->url_for('qr', $question->getVoteID()) ?>"></a>
</div>

<div class="button-group vote-controls">
  <?= \STUDIP\LinkButton::create(_("Ändern"), $controller->url_for('votes/edit', $question->getVoteID())) ?>
  <?= \STUDIP\LinkButton::create(_("Show/Hide Results")) ?>
  <?= \STUDIP\LinkButton::create(_("Zurücksetzen")) ?>

  <form action="<?= $controller->url_for('votes/destroy', $question->getVoteID()) ?>" method="POST">
    <?= \STUDIP\Button::create(_("Löschen")) ?>
  </form>
</div>

<pre>
id:        <?= htmlReady($question->getVoteID()) ?>

startdate: <?= date("r", $question->getStartdate()) ?>

stopdate:  <?= date("r", $question->getStopdate()) ?>

<?= var_dump(json_encode($question->toJSON())) ?>
</pre>

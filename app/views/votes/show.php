<? $body_id = "cliqr-show"; ?>

<h2><?= htmlReady($vote->getTitle()) ?></h2>

<table class="results">
<? foreach ($vote->getAnswers() as $answer) { ?>
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
  <a href="<?= $controller->url_for('qr', $vote->getVoteID()) ?>"></a>
</div>

<div class="button-group vote-controls">
  <?= \STUDIP\LinkButton::create(_("Ändern"), $controller->url_for('votes/edit', $vote->getVoteID())) ?>
  <?= \STUDIP\LinkButton::create(_("Show/Hide Results")) ?>
  <?= \STUDIP\LinkButton::create(_("Zurücksetzen")) ?>

  <form action="<?= $controller->url_for('votes/destroy', $vote->getVoteID()) ?>" method="POST">
    <?= \STUDIP\Button::create(_("Löschen")) ?>
  </form>
</div>

<pre>
id:        <?= htmlReady($vote->getVoteID()) ?>

startdate: <?= date("r", $vote->getStartdate()) ?>

stopdate:  <?= date("r", $vote->getStopdate()) ?>
</pre>

<?= $this->render_partial('votes/_form') ?>

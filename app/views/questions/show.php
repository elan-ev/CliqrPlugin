<?
$body_id = "cliqr-show";
$id = $question->getVoteID();
?>

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

<?
$poll_url = $controller->poll_url($cid);
$short_url = $shortener->shorten($poll_url);
?>
<div class="appeal">
  Vote at <a href="<?= $poll_url ?>"><?= $short_url ?></a>
  <a class="qr" href="<?= $controller->url_for('qr', $id) ?>"></a>
</div>

<div class="button-group vote-controls">
  <?= \STUDIP\LinkButton::create(_("Ändern"), $controller->url_for('questions/edit', $id)) ?>
  <?= \STUDIP\LinkButton::create(_("Show/Hide Results")) ?>
  <?= \STUDIP\LinkButton::create(_("Zurücksetzen")) ?>

  <form action="<?= $controller->url_for('questions/destroy', $id) ?>" method="POST">
    <?= \STUDIP\Button::create(_("Löschen")) ?>
  </form>
</div>

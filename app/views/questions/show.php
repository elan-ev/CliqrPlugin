<?
$body_id = "cliqr-show";
$id = $question->getVoteID();

var_dump(date("r", $question->startdate), date("r", $question->stopdate));
?>


<div class="question state-<?= htmlReady($question->getState()) ?>">


  <h2><?= htmlReady($question->getQuestion()) ?></h2>
  <table class="results<?= $show_results ? '' : ' hide' ?>">
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

  <!-- START/STOP -->

    <? if ($question->isActive()) : ?>
      <form action="<?= $controller->url_for('questions/stop', $id) ?>" method="POST">
        <?= \STUDIP\Button::create(_("Stoppen")) ?>
      </form>
    <? else : ?>
      <form action="<?= $controller->url_for('questions/start', $id) ?>" method="POST">
        <?= \STUDIP\Button::create(_("Starten")) ?>
      </form>
    <? endif ?>

  <!-- SHOW/HIDE RESULTS -->

    <form action="<?= $controller->url_for('questions/show', $id) ?>" method="GET">
      <input type="hidden" name="show_results" value="<?= $show_results ? 0 : 1 ?>">
      <input type="hidden" name="cid" value="<?= $cid ?>">
      <?= \STUDIP\Button::create($show_results ? _("Hide Results") : _("Show Results")) ?>
    </form>

  <!-- EDIT -->

    <?= \STUDIP\LinkButton::create(_("Ändern"),  $controller->url_for('questions/edit', $id)) ?>

  <!-- DELETE -->

    <form action="<?= $controller->url_for('questions/destroy', $id) ?>" method="POST">
      <?= \STUDIP\Button::create(_("Löschen")) ?>
    </form>


  <!-- RESET -->

  <!--
    <?= \STUDIP\LinkButton::create(_("Zurücksetzen")) ?>
  -->
  </div>
</div>

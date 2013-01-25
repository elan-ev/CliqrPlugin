<?
$body_id = "cliqr-show";
$id = $question->getVoteID();
$state_text =
  $question->isNew()
    ? _("neu")
    : ($question->isActive()
      ? _("läuft")
      : _("alt"));

?>


<div class="question state-<?= htmlReady($question->getState()) ?><?= $show_results ? '' : ' hide-results' ?>">


  <h2><span class="state"><?= $state_text ?></span> <?= htmlReady($question->getQuestion()) ?></h2>

  <?= $this->render_partial('questions/_show_controls', compact('id')) ?>

  <?
  $poll_url = $controller->poll_url($cid);
  $short_url = $shortener->shorten($poll_url);
  ?>
  <div class="appeal vote">
    <a class="short" alt="Vote at" href="<?= $poll_url ?>"><?= $short_url ?></a>
    <a class="qr" href="<?= $controller->url_for('qr', $cid) ?>"></a>
  </div>
  <div class="appeal start">
    <?= $this->render_partial('questions/_appeal_start', compact('id')) ?>
  </div>

</div>

<script>
// bootstrap shown question
cliqr.model.$currentQuestion = <?= json_encode($question->toJSON()) ?>;
</script>

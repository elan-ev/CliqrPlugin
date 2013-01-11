<?
$body_id = "cliqr-show";
$id = $question->getVoteID();
?>


<div class="question state-<?= htmlReady($question->getState()) ?><?= $show_results ? '' : ' hide-results' ?>">


  <h2><?= htmlReady($question->getQuestion()) ?></h2>

  <ol class="results">
  <? foreach ($question->getAnswers() as $i => $answer) { ?>
    <li>
      <span class="text">
        <span class="nominal"><?= chr(ord("A")+$i%26) ?>:</span>
        <?= htmlReady($answer['text']) ?>
      </span>
      <span class="count" data-count="<?= intval($answer['counter']) ?>"><?= intval($answer['counter']) ?></span>
     </li>
  <? } ?>
  </ol>

  <?= $this->render_partial('questions/_show_controls', compact('id')) ?>

<?  var_dump(date("r", $question->startdate), date("r", $question->stopdate), $question); ?>


  <?
  $poll_url = $controller->poll_url($cid);
  $short_url = $shortener->shorten($poll_url);
  ?>
  <div class="appeal vote">
    <a class="short" alt="Vote at" href="<?= $poll_url ?>"><?= $short_url ?></a>
    <a class="qr" href="<?= $controller->url_for('qr', $id) ?>"></a>
  </div>
  <div class="appeal start">
    <?= $this->render_partial('questions/_appeal_start', compact('id')) ?>
  </div>

</div>

<script>
// bootstrap shown question
cliqr.model.$currentQuestion = <?= json_encode($question->toJSON()) ?>;
</script>

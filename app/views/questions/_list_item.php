<?php
$counter = array_reduce($question->getAnswers(), function ($sum, $answer) { return $sum + $answer['counter']; }, 0);
$id = $question->getVoteID();
?>
<li class="question state-<?= $question->getState() ?>">
  <a href="<?= $controller->url_for('questions/show', $id) ?>#layout_page">
    <div class="count" title="<?= sprintf(_('%d Teilnehmer'), $counter) ?>"><?= intval($counter) ?></div>
    <div class="detail">
      <h4><?= htmlReady($question->getQuestion()) ?></h4>
      <? foreach ($question->getAnswers() as $answer): ?>
      <span class="answer"><?= htmlReady(my_substr($answer['text'], 0, 10)) ?></span>
      <? endforeach ?>
    </div>
  </a>

  <div class="control">
    <a class="edit"   alt="edit"   title="edit"   href="<?= $controller->url_for('questions/edit', $id) ?>"></a>
    <form
       action="<?= $controller->url_for('questions/destroy', $id) ?>"
       method="POST">
      <button type="submit" class="delete" alt="delete" title="delete"></button>
    </form>
  </div>

</li>

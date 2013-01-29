<?
$body_id = "cliqr-show";
$id = $question->getVoteID();
$state_text =
  $question->isNew()
    ? _("neu")
    : ($question->isActive()
      ? _("läuft")
      : _("alt"));

$poll_url = $controller->poll_url($cid);
$short_url = $shortener->shorten($poll_url);
?>

<div class="question state-<?= htmlReady($question->getState()) ?>">

  <h2><span class="state"><?= $state_text ?></span> <?= htmlReady($question->getQuestion()) ?></h2>

  <?= $this->render_partial('questions/_show_controls', compact('id')) ?>

  <div class="appeal vote">
    <a class="short" alt="Vote at" href="<?= $poll_url ?>"><?= $short_url ?></a>
    <a class="qr" href="<?= $controller->url_for('qr', $cid) ?>"></a>
  </div>
  <div class="appeal start">
    <form action="<?= $controller->url_for('questions/start', $id) ?>" method="POST">
      <?= CSRFProtection::tokenTag() ?>
      <?= \STUDIP\Button::create($question->isNew() ? _("Frage starten") : _("Frage erneut starten"), '') ?>
    </form>
    <span class="loader">
      loading&hellip;
    </span>
  </div>

</div>

<script>
// bootstrap shown question
cliqr.model.$currentQuestion = <?= json_encode($question->toJSON()) ?>;
</script>

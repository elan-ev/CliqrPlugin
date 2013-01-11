<? $body_id = "cliqr-index"; ?>


<?php
$qs = array(
    'new' => array(),
    'active' => array(),
    'stopped' => array(),
);
foreach ($questions as $question) {
    if ($question->isNew()) {
        $qs['new'][] = $question;
    } elseif ($question->isActive()) {
        $qs['active'][] = $question;
    } elseif ($question->isStopped()) {
        $qs['stopped'][] = $question;
    }
}
?>
<div class="page">

  <h3>
    <?= _('Neue Fragen') ?>
    <?= $this->render_partial('questions/_quick_new') ?>
  </h3>
  <?= $this->render_partial('questions/_list', array('key' => 'new', 'qs' => $qs)) ?>


  <h3><?= _('Laufende Fragen') ?></h3>
  <?= $this->render_partial('questions/_list', array('key' => 'active', 'qs' => $qs)) ?>


  <h3><?= _('Gestoppte Fragen') ?></h3>
  <?= $this->render_partial('questions/_list', array('key' => 'stopped', 'qs' => $qs)) ?>

</div>

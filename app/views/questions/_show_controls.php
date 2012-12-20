  <div class="controls">

  <!-- START/STOP -->

    <? if ($question->isActive()) : ?>
      <form action="<?= $controller->url_for('questions/stop', $id) ?>" method="POST">
        <?= \STUDIP\Button::create(_("Stoppen"), '') ?>
      </form>
    <? else : ?>
      <form action="<?= $controller->url_for('questions/start', $id) ?>" method="POST">
        <?= \STUDIP\Button::create(_("Starten"), '') ?>
      </form>
    <? endif ?>

  <!-- SHOW/HIDE RESULTS -->

    <form action="<?= $controller->url_for('questions/show', $id) ?>" method="GET">
      <input type="hidden" name="show_results" value="<?= $show_results ? 0 : 1 ?>">
      <input type="hidden" name="cid" value="<?= $cid ?>">
      <?= \STUDIP\Button::create($show_results ? _("Ergebnisse verstecken") : _("Ergebnisse zeigen"), '') ?>
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

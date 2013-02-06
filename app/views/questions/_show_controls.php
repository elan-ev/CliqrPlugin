  <div class="controls">

  <!-- STOP -->
    <? if ($question->isActive()) : ?>
      <form action="<?= $controller->url_for('questions/stop', $id) ?>" method="POST">
        <?= CSRFProtection::tokenTag() ?>
        <?= \STUDIP\Button::create(_("Stoppen"), '') ?>
      </form>
    <? endif ?>

  <!-- EDIT -->
    <?= \STUDIP\LinkButton::create(_("Ändern"),  $controller->url_for('questions/edit', $id)) ?>

  <!-- DELETE -->
    <form action="<?= $controller->url_for('questions/destroy', $id) ?>" method="POST">
      <?= \STUDIP\Button::create(_("Löschen")) ?>
    </form>

  </div>

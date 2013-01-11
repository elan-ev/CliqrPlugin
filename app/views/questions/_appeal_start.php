<form action="<?= $controller->url_for('questions/start', $id) ?>" method="POST">
  <?= CSRFProtection::tokenTag() ?>
  <?= \STUDIP\Button::create(_("Frage starten"), '') ?>
</form>
<span class="loader">
  loading&hellip;
</span>

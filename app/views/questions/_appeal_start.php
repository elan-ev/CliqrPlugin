<form action="<?= $controller->url_for('questions/start', $id) ?>" method="POST">
  <?= CSRFProtection::tokenTag() ?>
<?= \STUDIP\Button::create($question->isNew() ? _("Frage starten") : _("Frage erneut starten"), '') ?>
</form>
<span class="loader">
  loading&hellip;
</span>

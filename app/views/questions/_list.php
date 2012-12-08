<div class="questions">
  <? if (sizeof($qs[$key])) { ?>
    <ol id="<?= htmlReady($key) ?>-questions">
      <? foreach ($qs[$key] as $question) { ?>
        <?= $this->render_partial('questions/_list_item', compact('question')) ?>
      <? } ?>
    </ol>
  <? } else { ?>
  <div class="empty">
  <? switch ($key) {
    case 'new':     echo _("keine neuen Fragen"); break;
    case 'active':  echo _("keine laufenden Fragen"); break;
    case 'stopped': echo _("keine gestoppten Fragen"); break;
  } ?>
  </div>
  <? } ?>
</div>

<div class="questions" id="<?= htmlReady($key) ?>-questions">
  <? if ($key === "stopped") { ?>
    <ul class="sort-by">
      <li><span data-attribute="question" class="selected"><?= _("alphabetisch") ?></span></li>
      <li><span data-attribute="counter"><?= _("nach Aktivität") ?></span></li>
      <li><span data-attribute="startdate"><?= _("nach Startdatum") ?></span></li>
    </ul>
  <? } ?>

  <? if (sizeof($qs[$key])) { ?>
    <ol>
      <? foreach ($qs[$key] as $question) { ?>
        <?= $this->render_partial('questions/_list_item', compact('question')) ?>
      <? } ?>
    </ol>
  <? } else { ?>
  <div class="empty">
  <? switch ($key) {
    case 'new':     echo _("keine geplanten Fragen"); break;
    case 'active':  echo _("keine laufenden Fragen"); break;
    case 'stopped': echo _("keine gestoppten Fragen"); break;
  } ?>
  </div>
  <? } ?>
</div>

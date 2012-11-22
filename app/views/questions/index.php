<? $body_id = "cliqr-index"; ?>

<table border="0" cellpadding="2" cellspacing="0" width="99%">
    <tr>
       <th class="steel">&nbsp;</th>
       <th class="steel" align="left"><?= _("Titel") ?></th>
       <th class="steel"><?= _("Antwortmöglichkeiten") ?></th>
       <th class="steel">&nbsp;</th>
       <th class="steel">&nbsp;</th>
       <th class="steel">&nbsp;</th>
    </tr>

<?
$i = 1;
foreach ($questions as $question) {
    $showUrl    = $controller->url_for('questions/show',    $question->getVoteID());
    $resultsUrl = $controller->url_for('questions/results', $question->getVoteID());
    $startUrl   = $controller->url_for('questions/start',   $question->getVoteID());
    $stopUrl    = $controller->url_for('questions/stop',    $question->getVoteID());
    ?>
    <tr>
        <td class="steel1"><?= $i++ ?>.</td>
        <td class="steel1" align="left"><?= htmlReady($question->getTitle()) ?></td>
        <td class="steel1" align="center">
            <?= count($question->getAnswers()) ?>
        </td>
        <td class="steel1" align="center">
            <a href="<?= $showUrl ?>"><?= ("anzeigen") ?></a>
        </td>
        <td class="steel1" align="center">
              <? if ($question->isActive()) { ?>
                  <a href="<?= $stopUrl ?>"><?= _("Start") ?></a>
              <? } else { ?>
                  <a href="<?= $startUrl ?>"><?= _("Stop") ?></a>
              <? } ?>
        </td>
        <td class="steel1" align="center">
            <a href="<?= $resultsUrl ?>"><?= _("Ergebnisse") ?></a>
        </td>
    </tr>
<? } ?>
</table>

<?= \STUDIP\LinkButton::create(_("Neue Frage anlegen"), $controller->url_for("questions/new")) ?>

<ol id="questions">
  <? foreach ($questions as $question) { $id = $question->getVoteID(); ?>

  <? $alt = sprintf('alt="%s" title="%1$s"', htmlReady($question->getTitle())); ?>

  <li <?= $alt ?>>
    <div class="question">

      <a class="hover" href="<?= $controller->url_for('questions/show', $id) ?>">
        <span class="show_audience" <?= $alt ?>>
          Show audience
        </span>
      </a>

      <div class="control">
        <a class="edit"   alt="edit"   title="edit"   href="<?= $controller->url_for('questions/edit', $id) ?>"></a>
        <form
           action="<?= $controller->url_for('questions/destroy', $id) ?>"
           method="POST">
          <button type="submit" class="delete" alt="delete" title="delete"></button>
        </form>
      </div>
    </div>

    <div class="title" <?= $alt ?>>
      <?= htmlReady($question->getTitle()) ?>
    </div>
  </li>
  <? } ?>
</ol>

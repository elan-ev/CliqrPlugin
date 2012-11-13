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
foreach ($this->votes as $vote) {
    $showUrl    = $controller->url_for('votes/show',    $vote->getVoteID());
    $resultsUrl = $controller->url_for('votes/results', $vote->getVoteID());
    $startUrl   = $controller->url_for('votes/start',   $vote->getVoteID());
    $stopUrl    = $controller->url_for('votes/stop',    $vote->getVoteID());
    ?>
    <tr>
        <td class="steel1"><?= $i++ ?>.</td>
        <td class="steel1" align="left"><?= htmlReady($vote->getTitle()) ?></td>
        <td class="steel1" align="center">
            <?= count($vote->getAnswers()) ?>
        </td>
        <td class="steel1" align="center">
            <a href="<?= $showUrl ?>"><?= ("anzeigen") ?></a>
        </td>
        <td class="steel1" align="center">
              <? if ($vote->isActive()) { ?>
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

<ol id="questions">
  <? foreach ($this->votes as $vote) { ?>

  <? $alt = sprintf('alt="%s" title="%1$s"', htmlReady($vote->getTitle())); ?>

  <li <?= $alt ?>>
    <div class="question">

      <a class="hover" href="<?= $controller->url_for('votes/show', $vote->getVoteID()) ?>">
        <span class="show_audience" <?= $alt ?>>
          Show audience
        </span>
      </a>

      <div class="control">
        <a class="edit"   alt="edit"   title="edit"   href="<?= $controller->url_for('test') ?>"></a>
        <a class="delete" alt="delete" title="delete" href="/d/lkk"></a>
      </div>
    </div>

    <div class="title" <?= $alt ?>>
      <?= htmlReady($vote->getTitle()) ?>
    </div>
  </li>
  <? } ?>
</ol>

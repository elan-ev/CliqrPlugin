<h1>Umfragen</h1>

<table border="0" cellpadding="2" cellspacing="0" width="99%">
    <tr>
       <th class="steel">&nbsp;</th>
       <th class="steel" align="left">Titel</th>
       <th class="steel">Fragen</th>
       <th class="steel">&nbsp;</th>
       <th class="steel">&nbsp;</th>
    </tr>
    
    <?php
    $i = 1;
    foreach($this->votes as &$vote):
        $showUrl = PluginEngine::GetLink($GLOBALS["plugin"], array(),
                'cliqrplugin/show/' . $vote->getVoteID());
        $resultsUrl = PluginEngine::GetLink($GLOBALS["plugin"], array(),
                'cliqrplugin/results/' . $vote->getVoteID());
        $stopUrl = PluginEngine::GetLink($GLOBALS["plugin"], array(),
                'cliqrplugin/stop/' . $vote->getVoteID());
    ?>
    <tr>
        <td class="steel1"><?php echo "$i." ?></td>
        <td class="steel1" align="left"><?php echo $vote->getTitle() ?></td>
        <td class="steel1" align="center">
            <?php echo count($vote->getAnswers()) ?>
        </td>
        <td class="steel1" align="center">
            <?php
            if(!$vote->isActive()):
                printf("<a href='%s'>Start</a>", $showUrl);
            else:
                printf("<a href='%s'>Stop</a>", $stopUrl);
            endif;
            ?>
        </td>
        <td class="steel1" align="center">
            <a href="<?php echo $resultsUrl; ?>">Ergebnisse</a>
        </td>
    </tr>
    <?php
        $i++;
    endforeach;
    ?>
</table>
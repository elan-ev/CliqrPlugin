<?php
global $sess;
require_once "{$GLOBALS["STUDIP_BASE_PATH"]}/lib/vote/view/vote_show.lib.php";

foreach($votes as &$vote) {
    // users are not logged in, thus handle votes anonymous
    $vote->anonymous = true;
    
    // form header
    printf('<form action="%s" method="post">',
            PluginEngine::getLink($GLOBALS["plugin"], array(), "cliqrplugin/vote"));
    printf('<input type="hidden" name="voteId" value="%s" />', $vote->getVoteId());
    echo CSRFProtection::tokenTag();
    
    // vote header
    echo '<table role="article" border="0" cellspacing="0" cellpadding="0" width="100%">';
    printf('<tr>%s</tr>', printhead (0, 0, "", "open", false,
            Assets::img(VOTE_ICON_VOTE, array('class' => 'text-bottom')),
            htmlReady($vote->getTitle()), date("d.m.Y", $vote->getChangeDate()),
            $vote->getChangeDate(), false));
    
    // the form
    echo '<tr><td class="printcontent"></td><td class="printcontent" colspan="3">';
    $answers = $vote->getAnswers();
    $type = $vote->isMultiplechoice() ? "checkbox" : "radio";
    echo "<br><b>\n  <font size=\"-1\">\n   ";
    echo formatReady($vote->getQuestion());
    echo "\n  </font>\n </b>\n<br><br>\n";
    $i = 0;
    echo "<table border=\"0\" cellspacing=\"0\" cellpadding=\"3\">\n";
    foreach ($answers as $key => $value) {
        $id = "vote_" . $vote->getVoteID() . "_answer_" . $key;
        echo " <tr valign=\"middle\">\n";
        echo "  <td>\n";
        echo "   <input ".
      "type=\"".$type."\" ".
      "name=\"answer[".$i."]\" ".
      "id=\"{$id}\" ".
      "value=\"".$key."\">\n";
        echo "  </td>\n";
        echo "  <td>\n";
        echo "   <label for=\"{$id}\">\n";
        echo "    <font size=-1>".formatReady($value["text"])."</font>\n";
        echo "   </label>\n";
        echo "  </td>\n";
        echo " </tr>\n";

        if ($vote->isMultipleChoice ()) {
            $i++;
        }
    }
    echo "</table>\n";
    
    echo "</td></tr>";
    
    echo "</table>";
    
    // form footer
    echo "<br>";
    
    // show vote metadata
    echo createVoteInfo($vote, false);
    
    echo "<br>";
    echo '<div align="center">';
    
    // submit button
    echo "<input type=\"image\" " .
     "name=\"voteButton\" border=\"0\" " .
     makeButton ("abschicken", "src") .
     tooltip(_("Geben Sie hier Ihre Stimme ab!")) .
     ">";
    echo "</div>";
    echo "<br>";
    echo "</form>";
}
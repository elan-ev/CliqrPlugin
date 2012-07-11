<?php
foreach($votes as &$vote) {
    echo $this->render_partial("cliqrplugin/results", array("vote" => $vote));
}
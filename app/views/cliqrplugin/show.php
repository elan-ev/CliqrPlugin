<div id="cliqr_qrcode">
    <?php
    $actionPath = PluginEngine::getUrl($GLOBALS["plugin"], array(),
            "cliqrplugin/showpublic/{$voteId}");
    $publicUrl = sprintf("http://%s%s",
                    $_SERVER["HTTP_HOST"],
                    $actionPath);
    $imageUrl = PluginEngine::getLink($GLOBALS["plugin"],
            array("url" => Request::url()),
            "cliqrplugin/qrcode");
    echo "<img src='" . $imageUrl . "'/>";
    ?>
</div>

<div id="cliqr_shorturl"></div>

<div id="cliqr_vote_results"></div>
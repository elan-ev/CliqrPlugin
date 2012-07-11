<?php
require_once(__DIR__ . "/../../../api/urlshortener.php");
?>

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

<div id="cliqr_shorturl">
    <?php
    $urlApi = new UrlShortener("apiKey");
    echo $urlApi->shorten($publicUrl);
    Con
    ?>
</div>

<div id="cliqr_vote_results"></div>
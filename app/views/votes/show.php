<?php
require_once(__DIR__ . "/../../../api/urlshortener.php");
?>

<div id="cliqr_qrcode">
    <?php
    URLHelper::removeLinkParam("cid");
    $actionPath = PluginEngine::getUrl($GLOBALS["plugin"], array(),
            "cliqrplugin/showpublic/" . $courseId);
    URLHelper::addLinkParam("cid", $courseId);
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
    $config = Config::getInstance();
    $urlApi = new UrlShortener($config->getValue("CLIQR_URL_SHORTENER_API_KEY"));
    echo $urlApi->shorten($publicUrl);
    ?>
</div>

<div id="cliqr_vote_results"></div>
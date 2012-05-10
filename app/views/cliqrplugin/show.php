<h1>QR-Code dieser Seite:</h1>

<?php
$imageUrl = PluginEngine::getLink($GLOBALS["plugin"],
        array("url" => Request::url()),
        "cliqrplugin/qrcode");
echo "<img src='" . $imageUrl . "'/>";

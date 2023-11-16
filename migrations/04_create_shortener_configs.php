<?php
class CreateShortenerConfigs extends Migration
{
    public function description()
    {
        return "create configuration entries for the URL shortener";
    }

    public function up()
    {
        $cfg = Config::getInstance();
        $cfg->create('CLIQR_URL_SHORTENER_CLASS', [
            'type'        => 'string',
            'description' => 'Klasse des zu verwendenden URL Shorteners. Gegenüber der Konfigurationsdatei hat diese Konfiguration Vorrang. Verfügbare Shortener-Klassen: BasicShortener, MockShortener, GoogleShortener, YourlsShortener'
        ]);
        $cfg->create('CLIQR_BASIC_SHORTENER_URL', [
            'type'        => 'string',
            'description' => 'URL für den BasicShortener, die den Wert in der Konfigurationsdatei überschreibt. Beispiel: https://vt.uos.de/shorten.php?longurl=%s'
        ]);

        $cfg->delete('CLIQR_URL_SHORTENER_API_KEY');
    }

    public function down()
    {
        $cfg = Config::getInstance();
        $cfg->delete("CLIQR_URL_SHORTENER_CLASS");
        $cfg->delete("CLIQR_BASIC_SHORTENER_URL");

        $cfg->create('CLIQR_URL_SHORTENER_API_KEY', [
            'comment' => 'API Key für den Zugriff auf die Google URL Shortener API'
        ]);
    }
}
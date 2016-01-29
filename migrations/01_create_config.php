<?php
class CreateConfig extends Migration
{
    public function description()
    {
        return "create a configuration entry for the URL shortener service API key";
    }

    public function up()
    {
        $cfg = Config::getInstance();
        $cfg->create('CLIQR_URL_SHORTENER_API_KEY', array(
            'comment' => 'API Key für den Zugriff auf die Google URL Shortener API'));
    }

    public function down()
    {
        $cfg = Config::getInstance();
        $cfg->delete("CLIQR_URL_SHORTENER_API_KEY");
    }
}
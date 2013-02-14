# Stud.IP Cliqr

## Description

This plugin is a software clicker solution with a strong emphasis on
ease of use for lecturers and students. As minor feature the plugin
displays the URL of the students' voting page as a QR code which lends
its name to the plugin.

## Installation

### Vorraussetzungen schaffen:
     - git installieren
     - github-Account anlegen
     - Composer installieren http://getcomposer.org/
     - Google-API-Key besorgen:
       https://developers.google.com/url-shortener/v1/getting_started#APIKey

### Cliqr clonen:
     - https://github.com/luniki/CliqrPlugin forken
     - und lokal auschecken nach /path/to/CliqrPlugin

### PHP-Dependencies installieren:
     - in /path/to/CliqrPlugin: % composer update

### Cliqr für den lokalen Gebrauch konfigurieren:
     - in /path/to/CliqrPlugin: % cp config.php.dist config.php
     - config.php bearbeiten: Google-API-Key eintragen und Google
       shortener aktivieren

### Plugin-Paket erstellen:
     - in /path/to/CliqrPlugin: % zip -r /tmp/cliqr.zip *
     - Diese .zip-Datei im eigenen Stud.IP wie gewohnt installieren.

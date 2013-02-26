# Stud.IP Cliqr

## Description

This plugin is a software clicker solution with a strong emphasis on
ease of use for lecturers and students. As minor feature the plugin
displays the URL of the students' voting page as a QR code which lends
its name to the plugin.

## Wozu ist "Cliqr" gut?
Mit Cliqr lässt sich ein so genanntes Peer Instruction nach Eric Mazur
durchführen. Dies in eine Methode, mit der die Studierenden in Vorlesungen 
besser eingebunden werden und die Möglichkeit erhalten, ihr Verständnis über 
die vorgetragenen Lerninhalte zu überprüfen. 

## Wie geht das?
Der Vortragende stellt alle 20-30 Minuten eine Frage mit mehreren 
Antwortoptionen (Single-Choice-Frage) ans Plenum. Jeder Studierende ist 
aufgefordert, diese Frage zu beantworten. Seine Antwort wird mit Cliqr 
statistisch erfasst, d.h. der Lehrende sieht nur, welche Antwortoptionen 
das Plenum präferiert. Zur Beantwortung der Frage verwenden die Studierenden 
ein mitgebrachtes internetfähiges Endgerät, z.B. ihr Mobiltelefon, ein 
Tablet oder ein Notebook und stimmen auf einer Web-Site ab. Je nachdem, 
ob das Plenum überwiegend auf die richtige Antwort getippt hat oder ob 
eher die falschen Antwortoptionen gewählt wurden, führt der Lehrende 
seine Lehre fort.

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

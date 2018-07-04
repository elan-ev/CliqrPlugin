

# Stud.IP Cliqr


## Beschreibung

Dieses Plugin ist eine (Software-)Audience Response System (Clicker), das sehr viel Wert auf einfache Bedienung für
Lehrende und Studierende legt. Als kleines Feature zeigt das Plugin die URL der Abstimmungsseite als QR-Code an. So
kommt das Plugin zu seinem Namen.


### Wozu ist Stud.IP Cliqr gut?

Mit *Stud.IP Cliqr* lässt sich ein so genanntes *Peer Instruction* nach Eric Mazur durchführen. Dies ist eine Methode, mit
der die Studierenden in Vorlesungen besser eingebunden werden und die Möglichkeit erhalten, ihr Verständnis über die
vorgetragenen Lerninhalte zu überprüfen.


### Wie geht das *Peer Instruction*?

Der Vortragende stellt alle 20-30 Minuten eine Frage mit mehreren Antwortoptionen (Single-Choice-Frage) ans Plenum.
Jeder Studierende ist aufgefordert, diese Frage zu beantworten. Seine Antwort wird mit *Stud.IP Cliqr* statistisch
erfasst, d.h. der Lehrende sieht nun, welche Antwortoptionen das Plenum präferiert. Zur Beantwortung der Frage verwenden
die Studierenden ein mitgebrachtes, internetfähiges Endgerät, z.B. ihr Smartphone, Tablet oder Notebook und stimmen auf
einer Website ab. Je nachdem, ob das Plenum überwiegend auf die richtige Antwort getippt hat oder ob eher die falschen
Antwortoptionen gewählt wurden, führt der Lehrende seine Lehre fort.

Es wird die folgende Vorgehensweise empfohlen:

-   >80% der Studierenden haben richtig geantwortet: Der Lehrende gibt vertiefende Erklärungen zu den vorgetragenen Inhalten und wendet sich dann einem neuen Thema zu.
-   30-80% haben richtig geantwortet: Der Lehrende fordert die Studierenden auf mit ihren Nachbarn über die Antwortoptionen zu diskutieren, um so auf das richtige Ergebnis zu kommen. Danach lässt er erneut abstimmen.
-   <30% der Studierenden haben richtig geantwortet: Der Lehrende erläutert noch mal die vorgetragenen Inhalte und lässt erneut abstimmen.


### Was für Erfahrungen gibt es?

Technologien wie *Stud.IP Cliqr* haben eine große Verbreitung in
den letzten Jahren erfahren und viele Lehrende bedienen sich
weltweit dieser Methode. Exemplarisch gibt der nachfolgende Film (3
Minuten) die Erfahrungen von Prof. Dr. Riegler wieder:

<https://www.youtube.com/watch?v=pq9LV1Oj3gs>


## Installation

*Stud.IP Cliqr* ist ein Plugin für das Lernmanagementsystem
[Stud.IP](https://studip.de). Um das Plugin verwenden zu können, muss der
Systemadministrator der Stud.IP-Installation das [Plugin
installieren.](https://hilfe.studip.de/admin/Admins/PluginVerwaltung) Das Plugin selbst kann man [direkt herunterladen](https://github.com/luniki/CliqrPlugin/releases) oder
selbst kompilieren (siehe unten).

Sobald *Stud.IP Cliqr* in die Stud.IP-Installation aktiviert wurde,
kann es in jeder Veranstaltung integriert werden: Dazu geht man
genauso vor, [wie man auch das Forum, den Dateibereich oder das Wiki
hinzufügen würde.](https://hilfe.studip.de/help/4.0/de/Basis/VeranstaltungenVerwaltenModule)


## Kompilieren

Um *Stud.IP Cliqr* selbst zu kompilieren, benötigt man:

-   [PHP](https://secure.php.net/) (mind. v5.6) und
-   [Node.js](https://nodejs.org) (und das darin enthaltene `npm`)

Sobald man *Stud.IP Cliqr* ausgecheckt hat:

    git clone -q https://github.com/luniki/CliqrPlugin.git
    cd CliqrPlugin

muss [Composer](https://getcomposer.org), ein PHP Dependency Manager, installiert werden:

    wget "https://getcomposer.org/composer.phar"

Nun werden die notwendigen PHP-Pakete mit `composer` installiert:

    php composer.phar install --no-dev

Zum Kompilieren des JavaScript-Codes benötigen wir JavaScript-Pakete, die mit `npm` installiert werden:

    npm install

Jetzt kann es mit dem Kompilieren losgehen:

    npm run build-prod

Zum Schluß muss noch das Stud.IP-Plugin gepackt werden:

    npm run zip > /dev/null

Das Endergebnis ist eine fertige ZIP-Datei, die in Stud.IP-Installationen wie üblich eingespielt werden kann.


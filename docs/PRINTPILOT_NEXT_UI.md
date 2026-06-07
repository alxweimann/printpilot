# PrintPilot Next UI

## Stand: Design Sprint 22

Aktueller Fokus: Auftragstaschen-Header mit freigestelltem PrintPilot-Logo stabilisieren und die offiziellen PrintPilot-Farbwerte im UI-Stand verankern.

### Umgesetzt

- Seitenhintergrund konsequent auf Weiß gesetzt (`:root`, `body`, `.pp-app`, `.pp-main`, `.pp-order-pocket`).
- Header-Geometrie der Auftragstasche beruhigt:
  - dekorative Schwingung/Schräge im Auftragstaschen-Header entfernt,
  - flacher weißer Header mit klarer Trennlinie zwischen Logo, Titel, Auftragsnummer und QR-Bereich,
  - Logo-Bereich auf feste, ruhigere Maße reduziert.
- Neues PrintPilot-Logo übernommen:
  - gelieferte Logo-Datei wurde vom dunklen Fond freigestellt,
  - `PRINT` wurde von Weiß auf PrintPilot-Navy gesetzt,
  - `PILOT` und Bildmarke bleiben PrintPilot-Blau,
  - Asset liegt unter `src/assets/logo/printpilot-logo-transparent.png`.
- Offizielle Farbwerte ergänzt:
  - PrintPilot-Blau: `#009FE3`,
  - PrintPilot-Navy: `#162751`,
  - Weiß: `#FFFFFF`.
- Bottom-Navigation finaler gestaltet:
  - durchgehender Footer über die gesamte Breite,
  - dunkler Verlauf wie im Mockup,
  - klare Segmenttrennung ohne Pill-Optik,
  - aktiver Zustand für „Aufträge“ mit blauem Akzentstrich,
  - bessere Hover- und Focus-Zustände.
- Karten bleiben weiß, kompakt und technisch; Schatten und Linien wurden bewusst ruhig gehalten.

### Nächster sinnvoller Schritt

Als nächstes sollte die Auftragstasche einmal lokal im Browser geprüft werden: Logo-Größe, Abstand zum Titelbereich und QR-Bereich. Danach können wir die restlichen Kartenhöhen und Innenabstände vereinheitlichen.


## Sprint 7 – Auftragstaschen-Header beruhigt

- Die dekorative Schwingung im Header der Auftragstasche wurde entfernt.
- Das gelieferte PrintPilot-Logo wurde als echtes Bildasset in die Auftragstasche eingebaut.
- Header bleibt weiß, klar und flach; Logo, Titel, Auftragsnummer und QR-Bereich sind sauber getrennt.
- Ziel: ruhigerer, technischer Look ohne unruhige Kurvenform.


## Sprint 8 – finales Logo übernommen

- Das erneut gelieferte PrintPilot-Logo (`Logo.png`) wurde als finales Header-Asset übernommen.
- Die Auftragstasche referenzierte `src/assets/logo/printpilot-logo-header.png`.
- Header blieb ohne zusätzliche dekorative Schwingung; die einzige Rundung stammte aus dem Logo selbst.
- Logo-Spalte und Logo-Größe wurden angepasst, damit das vollständige Logo lesbar bleibt.


## Sprint 9 – Logo freigestellt

- Das Logo wurde vom dunklen Hintergrund getrennt und als transparentes PNG gespeichert.
- Der weiße `PRINT`-Schriftzug wurde in `#162751` umgefärbt, damit das Logo auf weißem App-Hintergrund lesbar ist.
- Das offizielle Blau `#009FE3` wurde in CSS und Design-Tokens übernommen.
- Die Header-Maße wurden auf das freigestellte Logo angepasst.


## Design Sprint 10 – Header-Feinschliff und Asset-Aufräumung

- Auftragstaschen-Logo im Header kompakter gesetzt und mit mehr Innenabstand versehen.
- Vertikale Trennlinien im Header dezenter abgestimmt.
- Unteres Content-Padding erhöht, damit die feste Bottom-Navigation keine Karteninhalte mehr überdeckt.
- Temporäre Logo-Dateien entfernt; aktive Logo-Datei bleibt `src/assets/logo/printpilot-logo-transparent.png`.
- ZIP-Dateien sollen nicht ins Repository committed werden.


## Design Sprint 11 – Header-Trennlinie korrigiert

- Die Trennlinie zwischen Logo-Bereich und Auftragstaschen-Titel wurde von voller Headerhöhe auf die gleiche optische Höhe wie die QR-Trennlinie reduziert.
- Umsetzung über eine kurze, vertikal zentrierte Pseudo-Element-Linie am Logo-Bereich.
- Header-Logo, Headerhöhe und QR-Bereich bleiben unverändert.

## Design Sprint 12 – Karten-Icons vereinheitlicht

- Die generischen Zeichen-Icons in der Auftragstasche wurden durch einheitliche SVG-Line-Icons ersetzt.
- Top-Info-Karten und Inhaltskarten nutzen jetzt denselben Icon-Stil: ruhige Kachel, PrintPilot-Blau, gleiche Strichstärke und klare Symbolik.
- Eingeführte Icons: Kunde, Ansprechpartner, Datum, Liefertermin, Produkt, Druckdaten, Termine, Produktions-Checkliste, Nutzenplan, Vorschau, Weiterverarbeitung, Dateien, Notizen, Maschine und Kommentare/Verlauf.
- Der Header aus Sprint 11 wurde nicht verändert.
- Die CSS-Klassen `.pp-pocket-icon`, `.pp-top-info-card__icon` und `.pp-panel__icon` definieren den gemeinsamen Icon-Look.


## Design Sprint 13 – Top-Info-Icons feiner ausgerichtet

- Top-Info-Icons unterhalb des Headers verkleinert.
- Mehr Abstand zwischen Icon-Kacheln und vertikalen Trennlinien gesetzt.
- Karten-Icons in den Hauptbereichen unverändert gelassen.
- Header aus Sprint 11/12 nicht verändert.


## Design Sprint 14 – Status-/Prozess-Pills ruhiger

- Status-Buttons in der Statusübersicht kleiner und kompakter gesetzt.
- Pfeiltrenner in der Statusübersicht verkleinert und leichter gewichtet.
- Schriftgewicht in den Status-Pills reduziert, damit die Buttons weniger massiv wirken.
- Weiterverarbeitungs-Pills kompakter gemacht und Spaltenbreite reduziert.
- Header, Logo, Trennlinien und Karten-Icons aus Sprint 13 unverändert gelassen.

## Design Sprint 16 – Maschinenbilder als Hybrid/Fallback vorbereitet

- Für Maschinen wurde Option C vorbereitet: echte Maschinenbilder können später verwendet werden, ansonsten greift automatisch eine neutrale SVG-Illustration je Maschinentyp.
- Neuer Asset-Ordner `src/assets/machines/` mit einheitlichen Fallback-Illustrationen:
  - `machine-digital-color.svg`,
  - `machine-digital-mono.svg`,
  - `machine-wide-format.svg`,
  - `machine-inkjet.svg`,
  - `machine-finishing.svg`.
- Die Maschinenkarte in der Auftragstasche wurde auf eine strukturierte `MachineCard` umgestellt.
- Aktuell verwendet `Xerox® Iridesse 1` den Fallback `digital-color`; später kann per `image` ein echtes Maschinenfoto gesetzt werden.
- Header, Footer, Logo, Top-Info-Bereich und übrige Karten wurden nicht verändert.
- ZIP-Dateien sollen weiterhin nicht ins Repository committed werden.

## Design Sprint 17 – Maschinenkarte veredelt

- Die Maschinenkarte wurde optisch hochwertiger aufgebaut, ohne Header, Footer oder übrige Karten anzufassen.
- Die Maschinen-Illustration sitzt jetzt in einer größeren, ruhigeren Bildfläche mit dezenter Tiefenwirkung.
- Maschinentyp wird als kleiner Label-Badge direkt in der Bildfläche angezeigt.
- Maschinenname, Status und technische Merkmale wurden klarer gegliedert.
- Merkmale wie `SRA3`, `CMYK` und `Sonderfarbe möglich` werden als kompakte Chips dargestellt.
- Typ, Standort und letzter Service sind als ruhige Meta-Felder vorbereitet.
- Die Hybrid-Logik bleibt bestehen: später kann ein echtes Maschinenbild per `image` gesetzt werden, ansonsten wird die Fallback-Illustration verwendet.

## Design Sprint 18 – Maschinen-Badges vereinheitlicht

- Die Badges/Chips in der Maschinenkarte wurden an die Formsprache der Status-Pills angepasst.
- Maschinentyp-Label und technische Merkmale sind jetzt weniger rund und wirken technischer.
- Schriftgewicht in diesen kleinen Badges wurde reduziert, damit sie weniger massiv erscheinen.
- Meta-Felder in der Maschinenkarte wurden minimal kantiger abgestimmt.
- Header, Footer, Maschinenaufbau und übrige Karten wurden nicht verändert.

## Design Sprint 21 – Logo-Hinterlegung mit CMY-Diagonalstreifen

- Der Logo-Bereich im Auftragstaschen-Header erhielt eine dezente CMY-Hinterlegung als Print-Anspielung.
- Die Streifen werden rein per CSS erzeugt, damit das transparente PrintPilot-Logo sauber bleibt und später unabhängig angepasst werden kann.
- Cyan, Magenta und Yellow sind bewusst zurückhaltend transparent gesetzt, damit der Header nicht unruhig wird.
- Die bestehende Header-Struktur, Trennlinie, QR-Fläche und übrigen Karten wurden nicht verändert.

## Design Sprint 22 – Logo-Bereich vollflächig im Footer-Blau

Der CMY-Diagonalstreifen-Hintergrund aus Sprint 21 wurde wieder entfernt. Der Logo-Bereich im Auftragstaschen-Header ist jetzt vollflächig im dunklen Footer-Blau gehalten, damit Header und Bottom-Navigation eine einheitlichere Klammer bilden. Zusätzlich wurde eine Logo-Variante für dunklen Hintergrund ergänzt (`printpilot-logo-on-navy.png`), bei der der PRINT-Schriftzug weiß statt navy ist.

## Design Sprint 23 – Logo-Hintergrund weich auslaufend

- harte Kante zwischen Logo-Bereich und Auftragstaschen-Titel entfernt
- Logo-Fond bleibt links im dunklen Footer-Blau
- Hintergrund läuft nach rechts per CSS-Verlauf weich ins Weiß aus
- Trennlinie zwischen Logo und Titel entfernt, damit der Übergang ruhiger wirkt
- Logo-Datei, Header-Aufbau, QR-Bereich und Karten nicht verändert

## Design Sprint 24 – Logo-Verlauf auf Logo-Fläche begrenzt

- Der dunkle Logo-Hintergrund läuft jetzt nur innerhalb der linken Logo-Zone aus.
- Der Verlauf beginnt ungefähr nach dem PrintPilot-Schriftzug und endet vor dem Auftragstaschen-Titel.
- Auftragstaschen-Titel, Auftragsnummer und QR-Bereich bleiben vollständig auf weißem Hintergrund.
- Die zuvor zu weit in den Header laufende graue/helle Verlaufsfläche wurde entfernt.
- Keine Änderungen an Karten, Footer, QR-Bereich oder Maschinen-/Timeline-Karten.

## Design Sprint 25 – Weicherer Logo-Verlauf

- Logo-Hintergrund im Auftragstaschen-Header bleibt auf den Brand-Bereich begrenzt.
- Verlauf von Footer-Blau zu Weiß wurde länger und weicher abgestuft.
- Titelbereich, Auftragsnummer, QR-Bereich, Karten und Footer bleiben unverändert.



## Design Sprint 26 – Dateien und Notizen verfeinert

- Dateien-Karte von tabellarischer Roh-Liste auf ruhigere Dateizeilen umgestellt.
- Dateityp, Dateiname, Kategorie, Datum/Uhrzeit und Dateigröße klarer gruppiert.
- PDF/JPG-Badges kleiner, kantiger und passend zur bestehenden Status-Formsprache gestaltet.
- Notizen-Karte auf kompakte Notizkarten umgestellt.
- Wichtige Liefernotiz dezent hervorgehoben.
- Notiz-Meta-Information als ruhige Schlusszeile gesetzt.
- Header, Logo-Verlauf, Footer, Maschinenkarte und übrige Karten nicht verändert.

## Design Sprint 27 – Compact files and notes cards

- Dateien-Karte kompakter gesetzt, damit sie im unteren Kartenraster nicht hinter der Bottom-Navigation verschwindet.
- Dateizeilen, Typ-Badges, Meta-Zeilen und Link-Abstand reduziert.
- Notizen-Karte kompakter gesetzt und interne Scrollbereiche für längere Inhalte vorbereitet.
- Header, Logo-Verlauf, Footer, Maschine und übrige Karten unverändert gelassen.


## Design Sprint 28 – Dateien/Notizen ohne interne Scrollbars

- Interne Scrollbereiche in Dateien- und Notizen-Karte entfernt.
- Karten dürfen wieder natürlich mit dem Seiteninhalt wachsen.
- Gesamtfenster bleibt der führende Scrollbereich.
- Dateien- und Notizen-Optik aus Sprint 26 wiederhergestellt.
- Header, Logo-Verlauf, Footer, Maschine und übrige Karten nicht verändert.


## Design Sprint 29 – Notizen und Verlauf als einheitliche Timeline
- Kommentare / Verlauf wieder auf die ruhige Timeline-Darstellung gesetzt.
- Notizen im gleichen Timeline-Stil aufgebaut, damit beide Karten optisch zusammenpassen.
- Keine internen Scrollbereiche in Notizen/Verlauf; die Seite bleibt der zentrale Scrollbereich.
- Dateien-, Header-, Footer- und Logo-Verlauf nicht verändert.

## Design Sprint 30 – Vorschau-Karte veredelt

- Vorschau-Karte auf eine echte PDF-/Druckvorschau-Anmutung umgestellt.
- Papierbogen mit dezenter Schattenwirkung, Beschnitt-Andeutung und Schnittmarken ergänzt.
- Flyer-Motiv aus der Produktkarte stilistisch in der Vorschau aufgegriffen.
- Dateiname, Druckparameter und Produktionsinfos unterhalb der Vorschau sauber gruppiert.
- Header, Logo-Verlauf, Footer, Dateien, Notizen, Verlauf und Maschinenkarte nicht verändert.

## Design Sprint 31 – Produktions-Checkliste verfeinert

- Produktions-Checkliste auf eine ruhigere Abschnittsstruktur umgestellt.
- Abschnittsköpfe zeigen jetzt erledigte Punkte je Bereich, ohne wie massive Badges zu wirken.
- Checklistenpunkte unterscheiden erledigt, offen und Pflichtpunkt dezent über Farbe und Statuslabel.
- Checkboxen, Abstände und Schriftgewichte an die kantigere PrintPilot-Formsprache angepasst.
- Signaturbereich optisch vom Arbeitsbereich getrennt.
- Header, Logo-Verlauf, Footer, Vorschau, Dateien, Notizen und Verlauf nicht verändert.

## Design Sprint 32 – Produkt und Druckdaten verfeinert

- Produkt-Karte auf eine hochwertigere Produktübersicht umgestellt.
- Produktname, Kurzbeschreibung, Motivfläche und Kernwerte sind jetzt klarer gruppiert.
- Auflage, Endformat und Seitenzahl werden als ruhige Kennzahlen dargestellt.
- Produktdetails wie Papier, Farbigkeit, Rohformat, Nutzen, Beschnitt, Ausschuss und Gewicht bleiben kompakt lesbar.
- Druckdaten-Karte um eine Dateikopfleiste mit PDF-Badge ergänzt.
- Preflight, Farbmodus und Beschnittprüfung werden als kleine Statusfelder dargestellt.
- Druckdaten-Spezifikationen wurden von einer Roh-Tabelle auf eine kompakte Produktionsliste umgestellt.
- Header, Logo-Verlauf, Footer, Vorschau, Maschine, Dateien, Notizen, Verlauf und Checkliste nicht verändert.

## Design Sprint 33 – Termine und Nutzenplan verfeinert

- Termine-Karte von einfacher Zeilenliste auf eine ruhige Produktions-Timeline umgestellt.
- Start- und Liefertermin werden als kompakte Kopfdaten angezeigt.
- Produktionsschritte unterscheiden erledigt, geplant und offen über dezente Marker und Statuslabels.
- Nutzenplan stärker als Druckbogen-/Ausschieß-Ansicht aufgebaut.
- Bogenformat, Nutzen und Druckbogenbedarf werden als kompakte Kennzahlen dargestellt.
- Druckbogen erhält Rasterhintergrund, Beschnitt-Andeutung und 4 × 2 Nutzenflächen.
- Endformat, Anordnung, Beschnitt und Wendeart sind als ruhige Produktionsdetails gruppiert.
- Header, Logo-Verlauf, Footer, Produkt, Druckdaten, Vorschau, Checkliste, Dateien, Notizen und Verlauf nicht verändert.

## Design Sprint 34 – Auftragstasche Final Polish

- Abstände zwischen Karten, Kartenköpfen und Inhaltsgruppen final geglättet.
- Badge-/Chip-Rundungen einheitlicher auf die kantigere PrintPilot-Formsprache abgestimmt.
- Schriftgewichte in Karten, Timelines, Statusfeldern und kleinen Kennzahlen beruhigt.
- Maschinenkarte final auf die ruhigere Variante gesetzt: Status unter dem Maschinennamen, Typ/Standort als Textzeile, keine Mini-Meta-Kacheln mehr.
- Dateien, Notizen, Verlauf, Checkliste, Termine und Nutzenplan optisch weiter vereinheitlicht.
- Responsive-Verhalten der Maschinenkarte bei schmaleren Fenstern verbessert.
- Header, Logo-Verlauf, Footer und zentrale Kartenstruktur nicht verändert.

## Design Sprint 35 – Header-Auftragsnummer und echter QR-Code

- Header-Informationshierarchie verbessert: Die Auftragsnummer ist jetzt klar als "Auftragsnummer" beschriftet.
- Die bisher frei stehende Nummer `PP-2026-00481` wurde in einen eigenen Job-Block gesetzt.
- QR-Platzhalter durch echten QR-Code für `printpilot://orders/PP-2026-00481` ersetzt.
- QR-Bereich zeigt jetzt direkt, welcher Auftrag beim Scannen geöffnet wird.
- Logo-Verlauf, Kartenraster, Footer und alle Inhaltskarten nicht verändert.

## Design Sprint 36 – Header-Balance und QR-Bereich

- Auftragsnummer im Header stärker gewichtet.
- Label „Auftragsnummer“ besser lesbar gesetzt.
- QR-Code im rechten Headerbereich vergrößert.
- QR-Text hierarchisch gegliedert: Aktion, Auftragsnummer, Zielsystem.
- Header-Spalten neu gewichtet, damit Logo, Titel, Auftragsnummer und QR-Bereich ausgewogener wirken.
- Auftragstaschen-Karten und übrige Bereiche unverändert gelassen.


## Design Sprint 37 – Nutzenplan mit realistischem Druckbogenverhältnis

- Nutzenplan-Darstellung fachlich korrigiert: Druckbogenfläche nutzt jetzt ein Verhältnis von ca. 450 × 320 mm.
- Der Nutzenplan füllt die Karte nicht mehr beliebig, sondern bleibt als SRA3-/Digitaldruckbogen proportional nachvollziehbar.
- Bogenformat in der Karte um `450 × 320 mm` ergänzt.
- 4 × 2 Nutzen bleiben als schematische Produktionsansicht erhalten.
- Header, Footer und übrige Auftragstaschen-Karten wurden nicht verändert.

## Design Sprint 38 – Auftragstasche als Design-Referenz stabilisiert

Sprint 38 macht keine großen sichtbaren UI-Umbauten mehr, sondern stabilisiert die Auftragstasche als Referenzscreen für die nächsten PrintPilot-Module.

### Referenzscreen

Die Auftragstasche gilt ab diesem Stand als visuelle Design-Referenz für:

- technische Karten mit Icon-Kachel, ruhigem Rahmen und klarer Inhaltsgruppe,
- kantige Status-Pills, Badges und Produktions-Chips,
- Timeline-Darstellungen für Termine, Notizen und Verlauf,
- Checklisten mit erledigt/offen/Pflichtpunkt-Logik,
- proportional korrekte Nutzenplan-/Druckbogen-Darstellungen,
- Maschinenkarten mit echtem Bild oder SVG-Fallback,
- PDF-/Druckvorschau-Karten mit Beschnitt- und Schnittmarken-Andeutung,
- Header mit Logo, Dokumenttyp, Auftragsnummer und QR-Code.

### UI-Pattern-Registry

Eine kleine Pattern-Registry wurde ergänzt:

```text
src/design-system/ui-patterns.ts
```

Sie dokumentiert die wichtigsten wiederverwendbaren UI-Muster aus der Auftragstasche mit:

- Pattern-ID,
- Kategorie,
- Zweck,
- Referenzbereich,
- relevanten CSS-Klassen,
- möglichen Wiederverwendungen in weiteren Modulen.

Diese Registry ist bewusst leichtgewichtig und greift noch nicht aktiv ins Rendering ein. Sie dient zunächst als stabile technische Notiz direkt im Codebestand, damit die nächsten Module im gleichen Stil aufgebaut werden können.

### Abgeleitete Muster

- `order-pocket-header`: Kopfzeile für Produktionsdokumente mit QR- und Auftragsbezug.
- `technical-panel`: Standardkarte für Produktionsinformationen.
- `status-pill`: kantige Status-/Badge-Formsprache.
- `timeline`: Ereignisstruktur für Termine, Notizen und Verlauf.
- `checklist`: gegliederte Produktionsprüfung.
- `imposition-sheet`: proportionaler Druckbogen/Nutzenplan.
- `machine-card`: Maschinenkarte mit Bild/Fallback-Logik.
- `preview-card`: PDF-/Druckvorschau.

### Nächster sinnvoller Schritt

Auf Basis dieser Referenz kann als nächstes die **Aufträge-Übersicht** oder das **Maschinen-Modul** im gleichen Stil aufgebaut werden. Die Auftragstasche sollte dabei nicht mehr als Experimentierfläche genutzt werden, sondern als stabiler UI-Maßstab.


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

## Design Sprint 39 – Aufträge-Übersicht im PrintPilot-Stil

Sprint 39 leitet die neue Aufträge-Übersicht aus der stabilisierten Auftragstasche ab. Die Auftragstasche selbst wurde nicht verändert; sie bleibt Referenzscreen.

### Umgesetzt

- Neue Feature-Seite ergänzt: `src/features/orders/OrdersOverviewPage.tsx`.
- `src/App.tsx` zeigt jetzt die Aufträge-Übersicht als aktuelle Hauptansicht.
- Auftragskarten übernehmen die technische Kartenlogik der Auftragstasche:
  - ruhiger weißer Rahmen,
  - kompakte Inhalte,
  - kantige Status-Pills,
  - Icon-Kacheln für Termin, Maschine und Auftragsdaten.
- Sichtbare Produktionsinformationen je Auftrag:
  - Auftragsnummer,
  - Kunde,
  - Produkt,
  - Auflage / Format,
  - Maschine,
  - Priorität,
  - Termin,
  - Produktionsstatus,
  - Freigabestatus,
  - Datenstatus,
  - nächster Schritt,
  - Verantwortlicher.
- Übersichtskopf mit Sprint-/Modulkontext, Aktionen für neuen Auftrag und spätere Auftragstaschen-Verknüpfung.
- Kennzahlenzeile für heute fällige Aufträge, Produktion, offene Freigaben und zu prüfende Daten.
- Linke Filter-/Statusspalte vorbereitet für Daten/Freigabe, Produktion, Weiterverarbeitung und Versandbereit.
- Detail-Drawer-/Auftragstaschen-Verknüpfung vorbereitet: Karten und Aktionsbutton sind als Einstiegspunkte angelegt, aktuell noch ohne Routing/Drawer-Logik.
- `src/design-system/ui-patterns.ts` um Pattern `orders-overview-list` erweitert.
- CSS für die neue Übersicht in `src/index.css` ergänzt, ohne bestehende Auftragstaschen-Klassen umzubauen.

### Nicht verändert

- `src/features/order-pocket/OrderPocketPage.tsx` blieb unverändert.
- Auftragstaschen-Header, QR-Code, Nutzenplan, Maschinenkarte und bestehende Referenzkarten wurden nicht angefasst.

### Nächster sinnvoller Schritt

Als nächstes kann Sprint 40 den Detail-Drawer vorbereiten: Klick auf einen Auftrag öffnet rechts eine kompakte Detailansicht mit den wichtigsten Auftragstaschen-Daten und einem klaren Button „Auftragstasche öffnen“.



## Design Sprint 39.1 – Aufträge-Übersicht verdichtet

Sprint 39.1 schärft die erste Aufträge-Übersicht optisch nach. Ziel war, die starke horizontale Streuung auf großen Monitoren zu reduzieren und die Karten klarer als Produktionskarten statt als breite Tabelle wirken zu lassen.

### Umgesetzt

- Tabellenkopf der Auftragsliste entfernt, weil die Darstellung jetzt eindeutig kartenbasiert ist.
- Auftragskarten kompakter aufgebaut:
  - Auftragsnummer und Statusgruppe oben,
  - Produkt/Kunde/Format links,
  - Termin, Maschine und Auflage als besser lesbare Infokacheln rechts,
  - nächster Schritt, Verantwortlicher und Aktion unten.
- Status-Pills enger zusammengeführt:
  - Produktionsstatus,
  - Freigabe,
  - Datenstatus,
  - Priorität.
- Schriftgrößen für produktionsrelevante Werte leicht angehoben.
- Kennzahlen, Filterspalte und Header in Höhe und Abständen reduziert.
- Die linke Filterspalte bleibt erhalten, wirkt aber kompakter und rückt visuell näher an die Liste.
- `orders-overview-list` in der UI-Pattern-Registry auf die verdichtete Kartenlogik angepasst.

### Nicht verändert

- `src/features/order-pocket/OrderPocketPage.tsx` blieb unverändert.
- Es wurde weiterhin kein echter Drawer oder Routing eingeführt. Die Auftragskarten bleiben nur vorbereitet.

### Nächster sinnvoller Schritt

Sprint 40 kann den Detail-Drawer technisch vorbereiten: Klick auf eine Auftragskarte öffnet rechts eine kompakte Detailansicht mit Auftrag, Kunde, Freigabe, Datenstatus, Termin, Maschine und Button zur Auftragstasche.

## Design Sprint 39.2 – Aufträge-Übersicht Feinschliff und Interaktion vorbereitet

Sprint 39.2 verfeinert die Aufträge-Übersicht nach dem ersten Praxisscreenshot. Ziel war, die Ansicht auf großen Monitoren stärker zu fokussieren und die nächsten Interaktionsschritte vorzubereiten, ohne bereits einen echten Drawer oder Routing einzubauen.

### Umgesetzt

- Gesamtbreite von Header, Kennzahlen und Arbeitsbereich begrenzt, damit die Auftragsliste auf großen Monitoren nicht zu weit auseinanderläuft.
- Status-Pill-Gruppe technisch sauberer vorbereitet:
  - Produktionsstatus,
  - Freigabe,
  - Datenstatus,
  - Priorität.
- Status-Pills können bei langen Kombinationen kontrolliert umbrechen.
- Verantwortlichkeit wurde aus der unteren Fußzeile in die Infokachel-Zeile integriert.
- Infokacheln je Auftrag zeigen jetzt:
  - Termin,
  - Maschine,
  - Auflage,
  - Verantwortlich.
- Fußzeile je Auftrag ist klarer auf den nächsten Produktionsschritt und Aktionen fokussiert.
- Zweite Kartenaktion vorbereitet: `Auftragstasche` neben `Auftrag öffnen`.
- Sprint-Kennung im Header auf `Sprint 39.2 · Aufträge` aktualisiert.
- UI-Pattern `orders-overview-list` um die fokussierte Karten-/Aktionslogik ergänzt.

### Nicht verändert

- `src/features/order-pocket/OrderPocketPage.tsx` blieb unverändert.
- Es wurde weiterhin kein echter Detail-Drawer und kein Routing eingeführt.
- Die Buttons bleiben vorbereitete Einstiegspunkte ohne produktive Navigationslogik.

### Nächster sinnvoller Schritt

Sprint 40 kann jetzt den Detail-Drawer technisch vorbereiten: Klick auf eine Auftragskarte öffnet rechts eine kompakte Detailansicht mit Auftrag, Kunde, Status, Termin, Maschine, Freigabe, Datenstatus und direktem Einstieg in die Auftragstasche.


## Design Sprint 40 – Auftrags-Detail-Drawer vorbereitet

Sprint 40 aktiviert den vorbereiteten Einstieg aus der Aufträge-Übersicht. Aus `Auftrag öffnen` wird nun ein rechter Detail-Drawer im PrintPilot-Stil geöffnet. Die Auftragstasche selbst bleibt unverändert und weiter Design-Referenz.

### Umgesetzt

- `src/features/orders/OrdersOverviewPage.tsx` um lokalen Drawer-State erweitert.
- Klick auf eine Auftragskarte oder auf `Auftrag öffnen` öffnet rechts den Detail-Drawer.
- Ausgewählte Auftragskarte erhält einen sichtbaren aktiven Zustand.
- Rechter Drawer mit:
  - Auftragskopf mit Auftragsnummer, Kunde und Produkt,
  - Produktionsstatus, Freigabe, Datenstatus und Priorität,
  - kompakten Kopfdaten zu Kunde, Ansprechpartner, Format, Auflage und Lieferung,
  - Produktionsdaten zu Termin, Maschine, Bereich und Verantwortlichkeit,
  - Produktionsfortschritt,
  - Druckdaten-/Preflight-, Material- und Weiterverarbeitungsnotizen,
  - nächstem Schritt und interner Produktionsnotiz.
- Drawer-Aktionen vorbereitet:
  - `Auftragstasche öffnen`,
  - `Freigabe markieren`,
  - `Daten prüfen`,
  - `Status ändern`.
- Drawer kann über das X oder über den abgedunkelten Hintergrund geschlossen werden.
- `src/index.css` um die Drawer-, Backdrop-, Aktions- und Selected-Card-Styles ergänzt.
- `src/design-system/ui-patterns.ts` um Pattern `order-detail-drawer` erweitert.

### Nicht verändert

- `src/features/order-pocket/OrderPocketPage.tsx` blieb unverändert.
- Es wurde noch keine echte Datenbank-, Speicher-, Routing- oder Statuswechsel-Logik eingebaut.
- Die Aktion `Auftragstasche öffnen` ist bewusst zunächst nur als UI-Einstieg vorbereitet.

### Nächster sinnvoller Schritt

Sprint 41 kann den Drawer interaktiver machen: Statusfelder editierbar vorbereiten, Freigabe-/Datenstatus als auswählbare Controls darstellen und die Auftragstaschen-Aktion später sauber mit dem bestehenden Auftragstaschen-Screen verbinden.

## Design Sprint 40.1 – Detail-Drawer Feinschliff

Sprint 40.1 verfeinert den in Sprint 40 eingeführten Auftrags-Detail-Drawer. Ziel war, den Drawer näher an die Auftragstasche als Design-Referenz heranzuführen, die vorbereiteten Aktionen klarer zu kennzeichnen und die Ansicht auf kleineren Breiten robuster zu machen.

### Umgesetzt

- Detail-Drawer optisch stärker an die Auftragstasche angelehnt:
  - cyanfarbener linker Akzent,
  - helles technisches Kartenlayout,
  - kompaktere Abstände,
  - klarerer Header mit Icon und Sprint-Kontext.
- `Auftragstasche öffnen` als prominente Primäraktion direkt unter dem Drawer-Kopf platziert.
- Statusbereich neu strukturiert als eigene Prüfgruppe:
  - Produktion,
  - Freigabe,
  - Daten,
  - Priorität.
- Hinweistext ergänzt, dass Statuswechsel aktuell vorbereitete Controls sind und später mit Speicherlogik/Historie verbunden werden.
- Drawer-Aktionen klar als UI-Dummy gekennzeichnet:
  - Freigabe markieren,
  - Daten prüfen,
  - Status ändern,
  - Termin planen.
- Aktionsbereich im Drawer unten als klebende Aktionsleiste vorbereitet.
- Responsive Regeln ergänzt, damit Drawer, Statusgruppe, Faktenraster und Aktionen auf kleineren Breiten einspaltig laufen.
- `src/design-system/ui-patterns.ts` um die verfeinerte Drawer-Struktur erweitert.

### Nicht verändert

- `src/features/order-pocket/OrderPocketPage.tsx` blieb unverändert.
- Es wurde weiterhin keine echte Speicher-, Routing-, Statuswechsel- oder Auftragstaschen-Navigation eingebaut.
- Die Änderungen betreffen nur Aufträge-Übersicht, Drawer-Styles, Pattern-Doku und Projektdokumentation.

### Nächster sinnvoller Schritt

Sprint 41 kann den Drawer interaktiver machen: Status, Freigabe, Datenprüfung und Priorität als auswählbare Controls vorbereiten und die Zustandsänderungen zunächst lokal im UI-State abbilden.


## Design Sprint 40.2 – Detail-Drawer Scroll- und Footer-Fix

Sprint 40.2 korrigiert das im Testvideo sichtbare Problem, dass die untere Drawer-Aktionsleiste Inhalte überdeckt hat. Der Detail-Drawer bleibt optisch im Auftragstaschen-Stil, bekommt aber eine sauberere technische Struktur aus Header, Primäraktion, scrollendem Inhaltsbereich und eigenem Footer.

### Umgesetzt

- Detail-Drawer strukturell verbessert:
  - Header und Primäraktion bleiben außerhalb des Scroll-Inhalts,
  - Status, Auftragskopf, Produktion, Druckdaten und Notiz liegen in einem eigenen Scrollbereich,
  - vorbereitete Aktionen sitzen in einem eigenen Footer-Bereich.
- Die frühere sticky-Aktionsleiste wurde entschärft, damit sie keine Inhalte mehr überdeckt.
- Scrollbereich erhält eigenen unteren Sicherheitsabstand.
- Footer besitzt jetzt eine klare Kennzeichnung `Vorbereitete Aktionen`.
- Drawer-Footer ist optisch als eigener Abschluss mit Trennlinie und leichter Schattenkante umgesetzt.
- Responsive Regeln für schmale Breiten angepasst, damit der Footer auch dort nicht über dem Inhalt liegt.
- `src/design-system/ui-patterns.ts` um die Scrollbody-/Footer-Struktur des Detail-Drawers ergänzt.

### Nicht verändert

- `src/features/order-pocket/OrderPocketPage.tsx` blieb unverändert.
- Es wurde weiterhin keine echte Speicher-, Routing-, Statuswechsel- oder Auftragstaschen-Navigation eingebaut.
- Die Änderungen betreffen nur Aufträge-Übersicht, Drawer-Styles, Pattern-Doku und Projektdokumentation.

### Nächster sinnvoller Schritt

Sprint 41 kann jetzt auf einem stabileren Drawer aufbauen und Status, Freigabe, Datenprüfung und Priorität als auswählbare Controls mit lokalem UI-State vorbereiten.

## Design Sprint 40.3 – Auftragstasche als echte Detailansicht

Sprint 40.3 korrigiert die Navigationslogik der Aufträge-Übersicht: Der Detail-Drawer wird nicht weiter als zentrale Auftragsansicht ausgebaut. Die Aufträge-Übersicht bleibt das Produktionscockpit, während `Auftrag öffnen` direkt zur Auftragstasche führt.

### Umgesetzt

- `src/App.tsx` um einfache View-Umschaltung erweitert:
  - Standardansicht: Aufträge-Übersicht,
  - Detailansicht: Auftragstasche.
- `Auftrag öffnen` in der Auftragskarte öffnet jetzt die Auftragstasche statt den rechten Detail-Drawer.
- Der separate Button `Auftragstasche` in jeder Auftragskarte wurde entfernt, weil `Auftrag öffnen` diese Rolle übernimmt.
- Auftragstaschen-Ansicht erhält eine kleine Rücknavigation `Zur Aufträge-Übersicht` oberhalb der bestehenden Auftragstasche.
- Auftragskarten bekommen eine kompakte Druckdatei-Preview:
  - stilisierter Papierbogen,
  - Schnitt-/Beschnittmarken,
  - Dateiname,
  - Preview-/Preflight-Kurzstatus.
- Filter-Hinweis und Header wurden auf die neue Logik angepasst.
- Pattern `orders-overview-list` wurde auf Druckdatei-Preview und Auftragstaschen-Einstieg aktualisiert.
- Neues Pattern `order-file-preview` dokumentiert die vorbereitete Vorschau-Struktur für spätere echte PDF-/Bild-Previews.

### Nicht verändert

- `src/features/order-pocket/OrderPocketPage.tsx` blieb unverändert.
- Die Auftragstasche zeigt weiterhin den bestehenden Demo-Auftrag `PP-2026-00481`.
- Es wurde noch kein echtes Routing, keine Datenbanklogik und keine dynamische Übergabe der ausgewählten Auftragsdaten an die Auftragstasche eingebaut.
- Der alte Drawer-Code wurde aus der aktiven UI entfernt; vorhandene alte Drawer-Styles können später im Cleanup-Sprint bereinigt oder für Quick-Status-Funktionen neu bewertet werden.

### Nächster sinnvoller Schritt

Sprint 41 sollte entweder die Auftragstasche dynamisch mit dem ausgewählten Auftrag verbinden oder zuerst einen kleinen Cleanup-Sprint durchführen, der nicht mehr benötigte Drawer-Styles und Dummy-Logik entfernt.

## Design Sprint 40.4 – Navigation und Button-Layout bereinigt

Sprint 40.4 korrigiert die ersten Layoutprobleme nach der Umstellung von Drawer auf Auftragstasche als Detailansicht.

### Umgesetzt

- Der Button `Auftrag öffnen` in der Aufträge-Übersicht ist wieder eindeutig sichtbar und als primäre Kartenaktion ausgerichtet.
- Die früheren leeren weißen Aktionsflächen in den Auftragskarten wurden durch eine klare Button-Fläche ersetzt.
- Die Karten bleiben weiterhin klickbar und führen direkt in die Auftragstasche.
- Die unsichtbare Hitarea aus der Drawer-Phase wurde deaktiviert, damit sie keine Button-/Layoutbereiche mehr überlagert.
- Die Rücknavigation der Auftragstasche wurde aus der überlagernden Sticky-Position gelöst und als normaler Navigationsstreifen oberhalb der Auftragstasche platziert.
- Header und Kopfdaten der Auftragstasche werden dadurch nicht mehr vom Rückbutton überlagert.
- Header-Kennzeichnung der Aufträge-Übersicht wurde auf `Sprint 40.4` aktualisiert.

### Nicht verändert

- `src/features/order-pocket/OrderPocketPage.tsx` blieb unverändert.
- Die Auftragstasche zeigt weiterhin den bestehenden Demo-Auftrag `PP-2026-00481`.
- Es wurde noch keine dynamische Übergabe der ausgewählten Auftragsdaten an die Auftragstasche eingebaut.

### Nächster sinnvoller Schritt

Sprint 41 sollte die Auftragstasche dynamisch mit dem ausgewählten Auftrag aus der Übersicht verbinden oder vorher einen technischen Cleanup der alten Drawer-Styles durchführen.


## Design Sprint 40.5 – Globaler Bottom-Navigation-Sicherheitsabstand

Sprint 40.5 behebt ein zentrales Layoutproblem der festen Bottom-Navigation: Inhalte dürfen bei tiefem Scrollstand nicht mehr unter der unteren Navigation verschwinden. Der Fix ist bewusst global umgesetzt, damit spätere Module denselben Sicherheitsabstand automatisch nutzen.

### Umgesetzt

- Zentrale CSS-Variablen für die Bottom-Navigation ergänzt:
  - `--pp-bottom-nav-height`,
  - `--pp-bottom-nav-safe-gap`,
  - `--pp-page-bottom-safe`.
- `.pp-main` und `.pp-main--console` nutzen den globalen unteren Sicherheitsabstand.
- `.pp-orders-overview` nutzt den globalen Abstand statt eines hart codierten Bottom-Paddings.
- `.pp-order-pocket` und `.pp-pocket-route-shell` erhalten denselben Sicherheitsabstand, damit die Auftragstasche bis unten vollständig bedienbar bleibt.
- Die feste Bottom-Navigation berücksichtigt `env(safe-area-inset-bottom, 0px)` für robustere Geräte-/Viewport-Unterstützung.
- Auf schmaleren Breiten wird der zusätzliche Sicherheitsabstand erhöht.
- Neues Pattern `bottom-navigation-safe-area` in `src/design-system/ui-patterns.ts` dokumentiert.

### Nicht verändert

- Keine fachliche Logik geändert.
- Keine Änderungen an `src/features/order-pocket/OrderPocketPage.tsx`.
- Keine Änderung an der aktuellen Navigation von Aufträge-Übersicht zur Auftragstasche.

### Nächster sinnvoller Schritt

Sprint 41 kann jetzt auf einem stabilen Layout aufbauen. Sinnvoll wäre entweder die dynamische Übergabe des ausgewählten Auftrags an die Auftragstasche oder ein technischer Cleanup der alten Drawer-Styles aus Sprint 40 bis 40.2.

## Design Sprint 40.6 – Aufträge-Übersicht vereinfacht und Header angeglichen

Sprint 40.6 vereinfacht die Auftragskarten und gleicht die Aufträge-Übersicht stärker an die visuelle Struktur der Auftragstasche an. Die Übersicht bleibt das Produktionscockpit, die Auftragstasche bleibt die Detail-/Produktionsansicht.

### Umgesetzt

- Der Button `Auftrag öffnen` wurde aus den Auftragskarten entfernt, weil die komplette Karte bereits klickbar ist.
- Der Kartenklick bleibt die zentrale Interaktion und öffnet weiterhin die Auftragstasche.
- Der Kartenfooter wurde beruhigt:
  - links bleibt `Nächster Schritt`,
  - rechts steht nur noch ein dezenter Hinweis `Karte öffnet Auftragstasche`.
- Die Aufträge-Übersicht nutzt jetzt den Master-Header im Stil der Auftragstasche:
  - PrintPilot-Logo links,
  - Titel `AUFTRÄGE-ÜBERSICHT`,
  - Subline `Produktionscockpit`,
  - Kennzahl `Aktive Aufträge`,
  - Status-Hinweise für Freigaben, Datenstatus und Preview.
- Die frühere Hero-Karte der Übersicht wurde durch den konsistenteren Master-Header ersetzt.
- Responsive Verhalten für den neuen Übersicht-Header ergänzt.
- Pattern `orders-overview-master-header` ergänzt.
- Pattern `orders-overview-list` auf Kartenklick-Navigation statt sichtbarer Primäraktion aktualisiert.

### Nicht verändert

- `src/features/order-pocket/OrderPocketPage.tsx` blieb unverändert.
- Die Auftragstasche zeigt weiterhin den bestehenden Demo-Auftrag `PP-2026-00481`.
- Es wurde noch keine dynamische Übergabe der ausgewählten Auftragsdaten an die Auftragstasche eingebaut.
- Es wurde keine Fachlogik geändert.

### Nächster sinnvoller Schritt

Sprint 41 sollte die ausgewählte Auftragskarte mit der Auftragstasche verbinden, damit die Auftragstasche je nach geöffnetem Auftrag andere Kopfdaten, Status, Maschine, Termin und Druckdaten anzeigen kann.


## Design Sprint 41 – Auftragsdaten an Auftragstasche übergeben

Sprint 41 verbindet die Aufträge-Übersicht erstmals fachlich mit der Auftragstasche. Die Übersicht bleibt das Produktionscockpit; die Auftragstasche zeigt jetzt die Daten des angeklickten Auftrags statt eines festen Demo-Auftrags.

### Umgesetzt

- Neue zentrale Demo-Datenstruktur `src/features/orders/order-data.ts` eingeführt.
- Aufträge-Übersicht und Auftragstasche nutzen dieselben Auftragsdaten als gemeinsame Grundlage.
- `src/App.tsx` hält den aktuell ausgewählten Auftrag im lokalen State.
- Klick auf eine Auftragskarte:
  - setzt den ausgewählten Auftrag,
  - wechselt zur Auftragstasche,
  - übergibt die Auftragsdaten an `OrderPocketPage`.
- Rücknavigation bleibt erhalten und zeigt in der Toolbar die aktuelle Auftragsnummer.
- Auftragstasche zeigt dynamisch je geöffnetem Auftrag:
  - Auftragsnummer,
  - Kunde und Adresse,
  - Ansprechpartner,
  - Auftragsdatum und Liefertermin,
  - Statuskette mit Datenstatus, Freigabe und Produktionsstatus,
  - Produkt, Auflage, Endformat, Seiten,
  - Druckdaten-Dateiname und Dateikontext,
  - Termin-/Produktionsstart,
  - Maschine und Maschinentyp,
  - Vorschau-/Datei-Metadaten,
  - Notizen mit Bezug zum geöffneten Auftrag.
- Header der Übersicht wurde auf `Sprint 41 · Aufträge` aktualisiert.
- Neues Pattern `selected-order-state` dokumentiert die vorbereitete State-Übergabe zwischen Übersicht und Auftragstasche.

### Nicht verändert

- Es wurde noch kein echter Router eingebaut.
- Es wurde noch keine Persistenz/Datenbanklogik ergänzt.
- QR-Code-Asset bleibt technisch noch das bestehende Demo-SVG; Alt-Text und sichtbare Auftragsnummer sind dynamisch.
- Die Auftragstasche bleibt visuell im bestehenden Layout, wurde aber an dynamische Daten angebunden.

### Nächster sinnvoller Schritt

Sprint 41.1 sollte prüfen, welche Auftragstaschen-Bereiche noch zu statisch wirken, zum Beispiel Motivgrafik, Nutzenplan-Raster, Checklistenpunkte und QR-Code. Danach kann ein kleiner Cleanup-Sprint folgen, der alte Drawer-Reste aus Sprint 40 bis 40.2 entfernt.

## Design Sprint 41.1 – Aufträge-Übersicht visuell beruhigt

Sprint 41.1 reduziert die visuelle Last der Aufträge-Übersicht. Die fachliche Richtung aus Sprint 41 bleibt erhalten: Die Übersicht ist das Produktionscockpit, der Kartenklick öffnet die Auftragstasche und die Auftragstasche nutzt weiterhin die ausgewählten Auftragsdaten.

### Umgesetzt

- Auftragskarten kompakter und ruhiger gestaltet.
- Große Meta-Kacheln für Termin, Maschine, Auflage und Verantwortlichkeit durch eine kompakte Meta-Zeile ersetzt.
- Wiederholten Hinweis `Karte öffnet Auftragstasche` aus jeder Karte entfernt.
- Status-Badges optisch entschärft:
  - keine starken Farbflächen mehr in der Übersicht,
  - grüne/orange/blaue/graue Zustände erscheinen als helle, ruhige Badges,
  - Priorität `Normal` wird nicht mehr als zusätzliche Pill angezeigt.
- Druckdatei-Preview kleiner und dezenter integriert.
- Header der Übersicht beruhigt: weniger Statuschips, klare Modul-/Cockpit-Bezeichnung.
- Kennzahlen und Filter optisch reduziert, damit die Auftragsliste mehr Gewicht bekommt.
- Karten bleiben vollständig klickbar und öffnen weiterhin die Auftragstasche.
- Neues Pattern `orders-overview-quiet-list` dokumentiert.

### Nicht verändert

- Keine Änderung an der Datenübergabe aus Sprint 41.
- Keine Änderung an der Auftragstaschen-Logik.
- Keine Persistenz, kein Router und keine echte PDF-Preview-Anbindung.

### Nächster sinnvoller Schritt

Nach der visuellen Beruhigung sollte die Auftragstasche auf dynamische Bereiche geprüft werden, die noch zu statisch wirken, etwa Motivgrafik, Nutzenplan, Checkliste und QR-Kontext.


## Design Sprint 41.3 – Echte Preview-Bilddaten in der Aufträge-Übersicht

Sprint 41.3 ersetzt die rein schematischen CSS-Platzhalter der Auftragskarten durch echte eingebundene SVG-Bilddaten. Die Übersicht bleibt ruhig und kompakt, bekommt aber eine deutlich bessere Druckdatei-Anmutung.

### Umgesetzt

- Neue Preview-Assets unter `src/assets/order-previews/` ergänzt:
  - `flyer-dinlang.svg`
  - `visitenkarten-set.svg`
  - `broschuere-a5.svg`
  - `plakat-a2.svg`
  - `aufkleberbogen.svg`
- `OrderPreview` in `src/features/orders/order-data.ts` um `imageSrc` und `imageAlt` erweitert.
- Jede Demo-Auftragszeile referenziert jetzt ein eigenes Preview-Asset.
- Auftragskarten rendern die Preview jetzt über ein echtes `<img>` statt über generische CSS-Balken.
- Preview-Spalte links bleibt größer und bekommt echte Bilddaten mit Dateiname und technischer Meta-Info.
- Die ruhige Meta-Zeile mit Termin, Maschine, Auflage und Verantwortlichkeit bleibt erhalten.
- Kartenklick und Datenübergabe zur Auftragstasche bleiben unverändert.
- Neues Pattern `orders-overview-real-preview-assets` dokumentiert.

### Nicht verändert

- Noch keine echte PDF-Thumbnail-Generierung.
- Keine Persistenz, kein Router und keine Datenbanklogik.
- Auftragstaschen-Layout und Datenübergabe bleiben unverändert.

### Nächster sinnvoller Schritt

Später können die Demo-SVGs durch echte generierte PDF-Thumbnails ersetzt werden. Dafür sollte die Preview-Struktur `imageSrc`/`imageAlt` beibehalten werden, damit echte Vorschau-Bilder ohne Umbau der Kartenkomponente austauschbar sind.

## Design Sprint 41.4 – Fotorealistische Preview-Thumbnails und Meta-Trenner

Sprint 41.4 korrigiert die Preview-Richtung aus Sprint 41.3: Die Auftragsübersicht nutzt jetzt fotorealistischere PNG-Demo-Thumbnails statt schematischer SVG-Grafiken. Gleichzeitig wurde die Meta-Zeile wieder auf die ruhigere typografische Darstellung mit feinen senkrechten Trennern zurückgeführt.

### Umgesetzt

- Neue PNG-Preview-Assets unter `src/assets/order-previews/` ergänzt:
  - `flyer-dinlang.png`
  - `visitenkarten-set.png`
  - `broschuere-a5.png`
  - `plakat-a2.png`
  - `aufkleberbogen.png`
- `order-data.ts` referenziert jetzt die neuen PNG-Bilddaten.
- Preview-Fläche links nochmals leicht vergrößert.
- Previews wirken stärker wie gerenderte Druckdatei-Thumbnails mit Papierfläche, Schatten, Motivflächen, Textblöcken und Druck-/Beschnitt-Andeutung.
- Dateiname in der Preview-Caption kann jetzt zweizeilig laufen und wird weniger hart abgeschnitten.
- Meta-Zeile wieder ohne Icons umgesetzt.
- Termin, Maschine, Auflage und Verantwortlicher werden wieder mit feinen senkrechten Trennern separiert.
- `Nächster Schritt` sitzt näher an den Auftragsdaten und nicht mehr als isolierter rechter Block.
- Kartenklick zur Auftragstasche und Datenübergabe aus Sprint 41 bleiben unverändert.
- Neues Pattern `orders-overview-photoreal-preview-assets` dokumentiert.

### Nicht verändert

- Noch keine echte PDF-Thumbnail-Generierung aus hochgeladenen Dateien.
- Keine Router-, Persistenz- oder Datenbanklogik.
- Auftragstasche und dynamische Datenübergabe bleiben fachlich unverändert.

### Nächster sinnvoller Schritt

Die Demo-PNGs können später durch echte automatisch generierte PDF-/Bild-Thumbnails ersetzt werden. Die bestehende Struktur `imageSrc`/`imageAlt` ist dafür bereits vorbereitet.

## Design Sprint 41.5 – Meta-Zeile typografisch ausrichten

Sprint 41.5 korrigiert die Produktions-Meta-Zeile in der Aufträge-Übersicht. Labels und Werte sitzen jetzt auf einer gemeinsamen Grundlinie, damit Termin, Maschine, Auflage und Verantwortlichkeit ruhiger und technischer wirken.

### Umgesetzt

- Meta-Zeile in den Auftragskarten typografisch vereinheitlicht.
- Labels wie `TERMIN`, `MASCHINE`, `AUFLAGE` und `VERANTW.` verwenden jetzt dieselbe Grundhöhe wie die Werte.
- Werte wie `03.06.2026 · Mi · 10:00` sind nicht mehr sichtbar größer oder vertikal versetzt.
- Feine senkrechte Trenner bleiben erhalten und sind mittig zur Zeile ausgerichtet.
- Keine Änderung an Kartenklick, Auftragstaschen-Navigation, Datenübergabe oder Preview-Bilddaten.

### Nicht verändert

- Keine neue Logik.
- Keine Änderung an der Auftragstasche.
- Keine Änderung an den Demo-Auftragsdaten.

## Design Sprint 42.1 – Auftragstaschen-Preview verbessern

Sprint 42.1 macht die Preview-Darstellung in der Auftragstasche deutlich druckdateinaher. Produktkarte und Vorschaukarte verwenden jetzt dieselben fotorealistischen Preview-Bilddaten wie die Aufträge-Übersicht, statt statischer Demo-Grafiken.

### Umgesetzt

- Produktkarte zeigt das auftragsspezifische Preview-Asset aus `order.preview.imageSrc`.
- Vorschaukarte nutzt ebenfalls das echte Preview-Asset des ausgewählten Auftrags.
- Statische Demo-Elemente im Stil des alten Flyer-Motivs wurden aus Produkt- und Vorschaukarte entfernt.
- Preview-Darstellung ist größer, kontrastreicher und stärker als PDF-/Druckdatei-Thumbnail gerahmt.
- Dateiname in der Vorschau kann mehrzeilig laufen und wird weniger hart abgeschnitten.
- Nutzenplan wurde optisch je Produktart vorbereitet:
  - Visitenkarten mit dichterem Mehrnutzen-Raster
  - Plakat mit großflächiger Rollen-/Bogen-Andeutung
  - Aufkleberbogen mit runder Kontur-Andeutung
  - Broschüre/Flyer weiterhin mit ruhigem Bogenraster
- Navigation, Kartenklick und Datenübergabe bleiben unverändert.
- Neues Pattern `order-pocket-preview-assets` dokumentiert.

### Nicht verändert

- Noch keine echte PDF-Thumbnail-Generierung.
- Keine Persistenz, kein Router und keine Datenbanklogik.
- Keine fachliche Änderung an Status, Freigabe oder Produktionslogik.

### Nächster sinnvoller Schritt

Als nächstes kann die Auftragstasche weiter produktspezifisch geschärft werden: Nutzenplan und Checkliste sollten stärker zwischen Flyer, Visitenkarten, Broschüre, Plakat und Aufkleberbogen unterscheiden.

## Design Sprint 42.2 – Auftragstaschen-Preview sauber skalieren

Sprint 42.2 korrigiert die Preview-Skalierung in der Auftragstasche. Die auftragsspezifischen Preview-Bilddaten bleiben erhalten, werden aber in Produktkarte und Vorschaukarte konsequent als vollständige Druckdatei-Thumbnails dargestellt.

### Umgesetzt

- Produktkarte zeigt das Preview nicht mehr als schmalen, vertikal wirkenden Ausschnitt.
- Produkt-Preview ist jetzt als kompaktes vollständiges Thumbnail gerahmt.
- Vorschaukarte verwendet konsequent `contain`-Skalierung statt sichtbarem Cropping.
- Asset-Frame in der Vorschaukarte ist in der Breite begrenzt, damit er nicht vom Panel abgeschnitten wird.
- Poster-, Visitenkarten- und Aufkleber-Previews bekommen produktspezifisch passende Maximalgrößen.
- Dateiname in der Vorschau bleibt zweizeilig möglich.
- Neues Pattern `order-pocket-preview-contain-scaling` dokumentiert.

### Nicht verändert

- Keine Änderung an Auftragsdaten, Navigation oder Kartenklick.
- Keine Änderung an der Aufträge-Übersicht.
- Keine echte PDF-Thumbnail-Generierung; weiterhin Demo-Preview-Assets.

### Nächster sinnvoller Schritt

Die Auftragstasche kann danach produktspezifisch weiter geschärft werden: Nutzenplan, Checkliste und Weiterverarbeitung sollten fachlich stärker zwischen Flyer, Visitenkarten, Broschüre, Plakat und Aufkleberbogen unterscheiden.


## Design Sprint 42.3 – Auftragstasche Layout-Balance verbessern

Sprint 42.3 balanciert die Auftragstasche optisch weiter aus. Der Fokus liegt auf ruhigeren Kartenhöhen, weniger leeren Panel-Flächen und stärker auftragsbezogenen Detailbereichen. Navigation, Kartenklick und Datenübergabe bleiben unverändert.

### Umgesetzt

- Kartenraster der Auftragstasche feiner ausbalanciert.
- Produkt-, Druckdaten-, Vorschau-, Nutzenplan- und Weiterverarbeitungs-Panels kompakter gesetzt.
- Produkt-Preview bleibt vollständig sichtbar, wirkt aber weniger dominant.
- Vorschaukarte bleibt auf `contain`-Skalierung und wurde in der Höhe leicht harmonisiert.
- Weiterverarbeitung nutzt jetzt die auftragsspezifischen Schritte aus `order-data.ts` inklusive Hinweistext.
- Checkliste nutzt jetzt die auftragsspezifischen Checklisten aus `order-data.ts`; erledigt/offen wird dynamisch berechnet.
- Kommentare/Verlauf nutzen jetzt den auftragsspezifischen Verlauf aus `order-data.ts`.
- Checklisten-Spalte wurde etwas kompakter gegliedert.
- Neues Pattern `order-pocket-layout-balance` dokumentiert.

### Nicht verändert

- Keine Änderung an Aufträge-Übersicht, Kartenklick oder Rücknavigation.
- Keine Persistenz, kein Router und keine Datenbanklogik.
- Keine echte Ausschießlogik; Nutzenplan bleibt weiterhin UI-vorbereitend.

### Nächster sinnvoller Schritt

Als nächstes kann Sprint 43 die Auftragstasche um erste vorbereitete Status-Aktionen erweitern, zum Beispiel Freigabe markieren, Datenprüfung setzen oder Produktionsstatus ändern – zunächst weiterhin ohne echte Persistenz.


## Design Sprint 43 – Auftragstasche Aktionen vorbereiten

Sprint 43 ergänzt erste vorbereitete Bedienaktionen in der Auftragstasche. Die Aktionen verändern bewusst nur lokalen UI-State und sind noch nicht persistent. Damit ist die spätere Anbindung an Speicherung, Router oder Datenbank vorbereitet, ohne die bestehende Navigation oder Datenübergabe zu verändern.

### Umgesetzt

- Neue Aktionsleiste direkt unter den Auftragskopfdaten ergänzt.
- Aktionen sind als lokaler UI-State vorbereitet:
  - Datenprüfung auf „Daten geprüft“ setzen
  - Freigabe auf „Freigabe erteilt“ setzen
  - Produktionsstatus durch vorbereitete Stati schalten
  - lokalen UI-State zurücksetzen
- Statusübersicht, Druckdaten-Preflight und Termine reagieren auf den lokalen UI-State.
- Checklistenpunkte sind anklickbar und wechseln zwischen offen/erledigt.
- Pflichtpunkte können per Klick als erledigt markiert werden.
- Weiterverarbeitungsschritte sind klickbar, sofern sie nicht „Nicht notwendig“ sind.
- Weiterverarbeitungsschritte wechseln lokal zwischen geplant/wartet und erledigt.
- Fokus- und Hover-Zustände für Checkliste, Weiterverarbeitung und Aktionsleiste ergänzt.
- Neues Pattern `order-pocket-local-actions` dokumentiert.

### Nicht verändert

- Keine echte Persistenz.
- Keine Änderung an der Aufträge-Übersicht.
- Keine Änderung an Kartenklick, Rücknavigation oder Datenübergabe.
- Keine Datenbank-, API- oder Router-Anbindung.

### Nächster sinnvoller Schritt

Als nächstes kann Sprint 43.1 die Interaktionslogik fachlich verfeinern: Statuswechsel sollten konsistenter mit Checkliste, Freigabe, Datenprüfung und Weiterverarbeitung gekoppelt werden.

## Design Sprint 43.1 – Aktionsleiste und Checklisten-UI beruhigen

Sprint 43.1 verfeinert die in Sprint 43 eingeführten lokalen Auftragstaschen-Aktionen. Die Interaktion bleibt erhalten, wird aber visuell kompakter und weniger dominant dargestellt.

### Umgesetzt

- Aktionsleiste unter den Auftragskopfdaten kompakter gestaltet.
- Aktionen werden jetzt als kleine Schnellaktions-Buttons statt als große Karten dargestellt.
- „Zurücksetzen“ ist nur noch eine sekundäre, kleine Aktion.
- Hinweis auf lokalen UI-State wurde dezenter formuliert und platziert.
- Checklisten-Zeilen wirken leichter und weniger grau/flächig.
- Erledigte und verpflichtende Checklistenpunkte bleiben erkennbar, ohne die Checklisten-Spalte optisch zu beschweren.
- Hover-/Focus-Zustände bleiben vorhanden, wirken aber ruhiger.
- Neues Pattern `order-pocket-compact-actions` dokumentiert.

### Nicht verändert

- Keine neue Fachlogik.
- Keine Persistenz, Datenbank-, API- oder Router-Anbindung.
- Keine Änderung an Aufträge-Übersicht, Kartenklick oder Rücknavigation.
- Keine Änderung an der dynamischen Datenübergabe aus der Übersicht.

### Nächster sinnvoller Schritt

Als nächstes können die lokalen Aktionen fachlich konsistenter gekoppelt werden, zum Beispiel Datenprüfung/Freigabe/Produktionsstatus/Checkliste in sinnvolle Abhängigkeiten bringen.

## Design Sprint 43.2 – Schnellaktionen als Statuskette und kompaktere Checkliste

Sprint 43.2 richtet die Schnellaktionen optisch an der Statusübersicht aus und reduziert die Checklisten-Typografie weiter. Die Aktionen bleiben lokaler UI-State ohne Persistenz.

### Umgesetzt

- Schnellaktionen sind nicht mehr als Pill-Leiste dargestellt.
- Datenprüfung, Freigabe und Produktionsstatus werden als kompakte Statuskette geführt.
- Rechteckige Statusflächen mit Trennern ersetzen die vorherige Pill-Optik.
- „Zurücksetzen“ bleibt separat als kleine sekundäre Aktion.
- Checklisten-Schrift und Zeilenhöhe wurden reduziert.
- Pflicht-/Offen-/Erledigt-Zustände bleiben erkennbar, wirken aber weniger flächig.
- Neues Pattern `order-pocket-compact-actions` bleibt Grundlage für die ruhigere Interaktionsleiste.

### Nicht verändert

- Keine neue Persistenzlogik.
- Keine Änderung an Übersicht, Kartenklick oder Rücknavigation.
- Keine große Layout-Umstellung.

## Design Sprint 43.3 – Statuslogik sprachlich bereinigen

Sprint 43.3 trennt den aktuellen Auftragsstatus klar von der Prozesskette. Dadurch wird vermieden, dass Begriffe wie „Weiterverarbeitung“ gleichzeitig als aktueller Status und als feste Prozessphase doppelt oder irritierend erscheinen.

### Umgesetzt

- Statusübersicht zeigt jetzt oben einen separaten aktuellen Status, z. B. „Aktuell: In Weiterverarbeitung“.
- Die Prozesskette verwendet feste Phasen: Daten, Freigabe, Druck, Weiterverarbeitung, Versand.
- Produktionsstatus wird sprachlich normalisiert:
  - „Produktion“ wird als „Im Druck“ angezeigt.
  - „Weiterverarbeitung“ wird als „In Weiterverarbeitung“ angezeigt.
  - „Fertig“ wird als „Versandbereit“ angezeigt.
- Die Prozessphasen zeigen Zustände wie „geplant“, „läuft“, „erledigt“, „bereit“ oder „offen“.
- Schnellaktionen nutzen dieselbe Prozessketten-Komponente wie die Statusübersicht.
- „Zurücksetzen“ bleibt als separate sekundäre Aktion.
- Neues Pattern `order-pocket-process-language` dokumentiert.

### Nicht verändert

- Keine echte Persistenz.
- Keine Änderung an Aufträge-Übersicht, Kartenklick oder Rücknavigation.
- Keine Änderung an der Datenübergabe aus der Übersicht.
- Keine Datenbank-, API- oder Router-Anbindung.

### Nächster sinnvoller Schritt

Als nächstes kann Sprint 43.4 die Abhängigkeiten zwischen Datenprüfung, Freigabe, Druckstatus, Checkliste und Weiterverarbeitung fachlich vorbereiten, weiterhin zunächst als lokaler UI-State.

## Design Sprint 43.4 – Schnellaktionen als Arbeitsleiste und Checkliste weiter verdichten

Sprint 43.4 nimmt die Rückmeldung zur Sprint-43.3-Ansicht auf: Die Schnellaktionen sollen nicht wie eine zweite Prozesskette wirken, sondern wie eine kompakte Arbeitsleiste für konkrete lokale Aktionen. Zusätzlich wird die Produktions-Checkliste typografisch weiter verdichtet.

### Umgesetzt

- Schnellaktionen werden jetzt als Arbeitsleiste statt als zweite Status-/Prozesskette geführt.
- Aktionen sind als klare rechteckige Buttons aufgebaut:
  - Daten prüfen
  - Freigabe erteilen
  - Status weiter
  - Zurücksetzen
- Die Buttons zeigen weiterhin den aktuellen lokalen UI-State als kleine Zusatzinformation.
- „Zurücksetzen“ bleibt eine sekundäre, dezente Aktion.
- Checklistenpunkte sind nochmals kompakter:
  - kleinere Schrift
  - kleinere Checkbox
  - geringere Zeilenhöhe
  - dezenterer Status rechts
- Pflichtpunkte bleiben sichtbar, werden aber weniger flächig hervorgehoben.
- Neues Pattern `order-pocket-action-workbar` dokumentiert.

### Nicht verändert

- Keine Persistenzlogik.
- Keine Änderung an Aufträge-Übersicht, Kartenklick oder Rücknavigation.
- Keine Änderung an der dynamischen Datenübergabe.
- Keine fachliche Abhängigkeitslogik zwischen Checkliste, Datenprüfung, Freigabe und Produktion.

### Nächster sinnvoller Schritt

Als nächstes können die lokalen Aktionen fachlich gekoppelt werden, z. B. Freigabe erst sinnvoll nach Datenprüfung, Druckstatus abhängig von Pflichtpunkten und Weiterverarbeitung abhängig vom Produktionsstatus.


## Design Sprint 43.5 – Arbeitsleiste finalisieren

Sprint 43.5 finalisiert die lokale Schnellaktionsleiste aus Sprint 43.4. Die Aktionen bleiben weiterhin nur UI-State ohne Persistenz, wirken aber jetzt stärker wie eine kompakte Arbeitsleiste und weniger wie kleine gestapelte Infokarten.

### Umgesetzt

- Schnellaktions-Buttons wurden breiter und lesbarer gestaltet.
- Buttontexte laufen jetzt einzeilig:
  - Daten prüfen
  - Freigabe erteilen
  - Status weiter
  - Zurücksetzen
- Der lokale Zustand wird nur noch als kleine Zusatzinformation im Button gezeigt.
- Der Schnellaktionen-Bereich nutzt links weniger optisches Gewicht.
- Hinweistext zur nicht persistenten Speicherung wurde weiter reduziert.
- Produktions-Checkliste weiter verdichtet:
  - kleinere Checkboxen
  - geringere Zeilenhöhe
  - etwas kleinere Labels
  - dezenterer Status rechts
  - Pflichtpunkte bleiben erkennbar, wirken aber weniger laut
- Neues Pattern `order-pocket-workbar-final` dokumentiert.

### Nicht verändert

- Keine Persistenzlogik.
- Keine Änderung an Aufträge-Übersicht, Kartenklick oder Rücknavigation.
- Keine Änderung an der dynamischen Datenübergabe.
- Keine fachliche Abhängigkeitslogik zwischen Checkliste, Datenprüfung, Freigabe und Produktion.

### Nächster sinnvoller Schritt

Als nächstes kann die lokale Interaktionslogik fachlich gekoppelt werden: Datenprüfung/Freigabe/Produktionsstatus sollten sinnvolle Abhängigkeiten bekommen, bevor später echte Speicherung oder Datenbank-Anbindung ergänzt wird.

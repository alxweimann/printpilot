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

## Design Sprint 43.6 – Auftragstaschen-Kartenhöhen harmonisieren

Sprint 43.6 nimmt die Rückmeldung auf, dass die Cards nach dem Arbeitsleisten-Umbau wieder unterschiedlich hoch wirkten. Die Auftragstasche ist deshalb wieder konsequent in Zonen gegliedert und die Kartenhöhen werden innerhalb dieser Zonen harmonisiert.

### Umgesetzt

- Auftragstasche erhält eine klare Zonenstruktur:
  - Auftragsdaten: Produkt, Druckdaten, Termine, Produktions-Checkliste
  - Produktion: Nutzenplan, Vorschau, Weiterverarbeitung
  - Auftragsbegleitung: Dateien, Notizen, Maschine, Kommentare / Verlauf
- Neues Raster `pp-pocket-zones` / `pp-pocket-zone-grid` eingeführt.
- Karten innerhalb einer Zone werden gleichmäßiger hochgezogen.
- Inhalte bleiben oben ausgerichtet; freie Fläche entsteht ruhiger innerhalb der Cards statt zwischen unterschiedlich hohen Cards.
- Produktionszone richtet Nutzenplan, Vorschau und Weiterverarbeitung wieder ruhiger aus.
- Auftragsbegleitung richtet Dateien, Notizen, Maschine und Verlauf gleichmäßiger aus.
- Checkliste bleibt kompakt, wird aber wieder sauber in die obere Auftragsdaten-Zone integriert.
- Responsive Verhalten bleibt erhalten; auf kleineren Breiten werden feste Mindesthöhen zurückgenommen.
- Neues Pattern `order-pocket-zone-equal-heights` dokumentiert.

### Nicht verändert

- Keine Änderung an Aufträge-Übersicht, Kartenklick oder Rücknavigation.
- Keine neue Persistenzlogik.
- Keine fachliche Änderung an Schnellaktionen, Checkliste, Weiterverarbeitung oder Statuslogik.
- Keine Änderung an den dynamischen Auftragsdaten.

### Nächster sinnvoller Schritt

Als nächstes kann die lokale Interaktionslogik fachlich gekoppelt werden: Datenprüfung, Freigabe, Pflichtpunkte, Produktionsstatus und Weiterverarbeitung sollten dann in sinnvollen Abhängigkeiten reagieren.


## Design Sprint 43.7 – Statusleiste als interaktive Prozessleiste

Sprint 43.7 nimmt die Rückmeldung auf, dass Statusleiste und Schnellaktionen doppelt wirkten. Die separate Schnellaktions-/Arbeitsleiste wurde deshalb entfernt. Die zentrale Prozessleiste in der Auftragstasche übernimmt jetzt Anzeige und lokale Bedienung.

### Umgesetzt

- Separate Schnellaktionsleiste entfernt.
- Status-/Prozessleiste ist jetzt die zentrale Bedienfläche für lokalen UI-State.
- Prozessschritte sind direkt klickbar:
  - Daten anklicken setzt lokal „Daten geprüft“.
  - Freigabe anklicken setzt lokal „Freigabe erteilt“.
  - Druck / Weiterverarbeitung anklicken schaltet den Produktionsstatus weiter.
- Aktueller Auftragsstatus bleibt separat sichtbar, z. B. „Aktuell: In Weiterverarbeitung“.
- „Zurücksetzen“ bleibt als kleine sekundäre Aktion neben dem aktuellen Status.
- Hinweis „UI-Vorschau ohne persistente Speicherung“ ist in die Statusleiste integriert.
- Auftragstasche wirkt dadurch ruhiger, weil keine zweite Aktions-/Statuszeile mehr vorhanden ist.
- Neues Pattern `order-pocket-interactive-process-bar` dokumentiert.

### Nicht verändert

- Keine Persistenzlogik.
- Keine Änderung an Aufträge-Übersicht, Kartenklick oder Rücknavigation.
- Keine Änderung an dynamischen Auftragsdaten.
- Keine fachliche Abhängigkeitslogik zwischen Checkliste, Datenprüfung, Freigabe und Produktion.

### Nächster sinnvoller Schritt

Als nächstes kann Sprint 44 lokale UI-Änderungen zwischen Auftragstasche und Aufträge-Übersicht zentraler halten, damit Statusänderungen nach der Rückkehr in der Übersicht sichtbar bleiben.


## Design Sprint 44 – Lokalen UI-State in die Übersicht zurückspiegeln

Sprint 44 verbindet die lokalen Auftragstaschen-Aktionen stärker mit der Aufträge-Übersicht. Änderungen bleiben weiterhin reine UI-Vorschau ohne echte Persistenz, werden aber im zentralen App-State gehalten, sodass die Übersicht nach der Rückkehr den geänderten Auftragszustand zeigt.

### Umgesetzt

- `App.tsx` hält die Demo-Aufträge jetzt als zentralen UI-State.
- Die Aufträge-Übersicht erhält die aktuellen Auftragsdaten aus dem App-State statt direkt aus den statischen Demo-Daten.
- Die Auftragstasche meldet lokale Änderungen an den zentralen App-State zurück.
- Nach Rückkehr in die Übersicht werden aktualisierte Werte sichtbar:
  - Datenstatus
  - Freigabestatus
  - Produktionsstatus
  - Checklistenstand
  - Weiterverarbeitungsschritte
- Der Button `Zurücksetzen` stellt den gewählten Auftrag wieder aus den ursprünglichen Demo-Daten her.
- Die Kennzahlen in der Aufträge-Übersicht werden aus dem aktuellen UI-State abgeleitet.
- Neues Pattern `central-order-ui-state` dokumentiert.

### Nicht verändert

- Keine echte Persistenz.
- Keine Datenbank- oder LocalStorage-Anbindung.
- Keine Änderung an Navigation, Kartenklick oder Rücknavigation.
- Keine Änderung am visuellen Grundlayout der Übersicht oder Auftragstasche.

### Nächster sinnvoller Schritt

Als nächstes kann Sprint 44.1 die fachlichen Abhängigkeiten ergänzen: Produktion sollte z. B. erst sinnvoll weiterlaufen, wenn Pflichtpunkte, Datenprüfung und Freigabe erfüllt sind. Danach kann echte Speicherung vorbereitet werden.


## Design Sprint 44.1 – UI-State-Rückspiegelung korrigieren

Sprint 44.1 korrigiert die Rückmeldung aus der Auftragstasche in die Aufträge-Übersicht. Der zentrale Demo-State bleibt weiterhin reine UI-Vorschau ohne Persistenz, wird aber jetzt konsequenter als Single Source of Truth verwendet.

### Umgesetzt

- `App.tsx` schreibt aktualisierte Aufträge robuster in das zentrale `orders`-Array zurück.
- Der aktualisierte Auftrag setzt auch die aktive Auftrags-ID, damit Übersicht und Auftragstasche denselben Datensatz verfolgen.
- `Zurücksetzen` nutzt die aktuelle Auftrags-ID und schreibt den ursprünglichen Demo-Auftrag direkt in den zentralen State zurück.
- `OrderPocketPage` unterscheidet jetzt zwischen zentralem State aus `App.tsx` und lokalem Fallback-State.
- Wenn `onOrderChange` vorhanden ist, liest die Auftragstasche den aktuellen Aktionszustand direkt aus dem übergebenen Auftrag.
- Prozessleiste, Checkliste und Weiterverarbeitung schreiben Änderungen sofort in den zentralen Auftragszustand.
- Nach Rückkehr in die Übersicht sollen geänderte Werte sichtbar bleiben:
  - Datenstatus
  - Freigabestatus
  - Produktionsstatus
  - Checklistenpunkte
  - Weiterverarbeitungsschritte
- Neues Pattern `central-order-ui-state-feedback-fix` dokumentiert.

### Nicht verändert

- Keine echte Persistenz.
- Keine LocalStorage-, Datenbank- oder Backend-Anbindung.
- Keine Layout-Änderung an Übersicht oder Auftragstasche.
- Keine Änderung an Kartenklick, Rücknavigation oder Preview-Darstellung.

### Nächster sinnvoller Schritt

Als nächstes kann geprüft werden, ob aus den geänderten Zuständen zusätzliche abgeleitete Werte entstehen sollen, z. B. aktualisierter nächster Schritt, Fortschritt, Verlaufseinträge oder Kennzahlen in der Übersicht.


## Design Sprint 44.2 – Statusbegriffe vereinheitlichen und echte PDF-Previews einbauen

Sprint 44.2 verbindet zwei kleinere, aber wichtige Korrekturen: Die Statusbegriffe zwischen Auftragstasche und Aufträge-Übersicht werden vereinheitlicht, und zwei angelieferte PDF-Druckdateien werden als echte Preview-Quelle in die Demo-Daten aufgenommen.

### Umgesetzt

- Der bisherige Endzustand `Fertig` wurde in der Prozesslogik auf `Versandbereit` vereinheitlicht.
- Auftragstasche und Aufträge-Übersicht zeigen dadurch denselben Begriff für den letzten Produktions-/Versandzustand.
- Die Prozesskette bleibt fachlich getrennt in Daten, Freigabe, Druck, Weiterverarbeitung und Versand.
- `OrderPreview` wurde um eine optionale `sourcePdf`-Referenz erweitert.
- Die angelieferten PDFs wurden als Originaldateien abgelegt:
  - `src/assets/order-files/wohlstandsmeister-vika.pdf`
  - `src/assets/order-files/aw-briefbogen.pdf`
- Aus den PDFs wurden PNG-Preview-Bilder erzeugt und eingebunden:
  - `src/assets/order-previews/wohlstandsmeister-vika.png`
  - `src/assets/order-previews/aw-briefbogen.png`
- Der Auftrag `PP-2026-00482 · Visitenkarten Set` nutzt jetzt die echte Wohlstandsmeister-Visitenkarten-PDF-Vorschau.
- Ein zusätzlicher Demo-Auftrag `PP-2026-00486 · Briefbogen A4` nutzt die echte Briefbogen-PDF-Vorschau.
- Preview-CSS wurde um den Typ `letterhead` ergänzt, damit Briefbogen als hochformatiges PDF-Thumbnail sauber dargestellt wird.
- Neues Pattern `real-pdf-preview-assets` dokumentiert.
- Neues Pattern `unified-process-status-labels` dokumentiert.

### Nicht verändert

- Keine echte PDF-Rendering-Logik im Browser. Die App nutzt weiterhin vorberechnete PNG-Thumbnails.
- Keine Persistenz, kein LocalStorage und keine Datenbank.
- Keine Änderung an Kartenklick, Rücknavigation oder zentralem UI-State.
- Keine Änderung am grundsätzlichen Layout der Auftragstasche.

### Nächster sinnvoller Schritt

Als nächstes kann die Dateistruktur für echte Kundendruckdaten weiter vorbereitet werden: Originaldatei, Preview, Preflight-Ergebnis, Seitenanzahl und Versionierung sollten später pro Auftrag sauber gespeichert werden.


## Design Sprint 44.3 – Echte Druckdatei-Previews im Nutzenplan

Sprint 44.3 verbessert die visuelle Produktionsnähe der Auftragstasche. Der Nutzenplan zeigt jetzt nicht mehr nur nummerierte Platzhalter, sondern nutzt die tatsächlichen Preview-Bilder der Druckdateien als kleine Motiv-Wiederholungen auf dem Druckbogen.

### Umgesetzt

- Nutzenplan-Kacheln rendern jetzt das echte `order.preview.imageSrc` des jeweiligen Auftrags.
- Die Nutzennummer bleibt als dezente Überlagerung erhalten.
- Visitenkarten zeigen im Nutzenplan mehrere kleine Kartenmotive statt leerer Nummernfelder.
- Briefbogen wird im Nutzenplan als 2-fach A4-Hochformat auf SRA3 vorbereitet.
- Briefbogen-Preview wurde in Produkt- und Vorschaukarte größer und lesbarer behandelt.
- Produktarten behalten eigene Nutzenplan-Raster:
  - Visitenkarten: dichter Mehrnutzenbogen
  - Briefbogen: 2 Nutzen Hochformat
  - Flyer/Broschüre: Mehrnutzenraster
  - Plakat: großflächiger Bogen
  - Aufkleberbogen: motivbasierte Kacheln
- Neues Pattern `real-file-imposition-preview` dokumentiert.

### Nicht verändert

- Keine echte Ausschieß-Engine.
- Keine echte PDF-Rendering-Logik im Browser.
- Keine Persistenz, kein LocalStorage und keine Datenbank.
- Keine Änderung an Übersicht, Kartenklick, Rücknavigation oder zentralem UI-State.

### Nächster sinnvoller Schritt

Als nächstes kann der Nutzenplan weiter fachlich verfeinert werden: Bogenformat, Drehung, Greiferrand, Beschnitt, Zwischenschnitt und Nutzenanordnung sollten später aus echten Produktionsparametern berechnet werden.


## Design Sprint 44.4 – Nutzenplan-Preview finalisieren

Sprint 44.4 verfeinert die in Sprint 44.3 eingeführten echten Datei-Previews im Nutzenplan. Der Druckbogen soll dadurch stärker wie ein Produktionsbogen wirken und weniger wie ein Raster aus Bildkacheln.

### Umgesetzt

- Nutzenplan-Bogen optisch präziser gefasst:
  - klarere Bogengrenze
  - dezenter Beschnitt-/Sicherheitsrahmen
  - ruhigere Innenfläche mit technischem Raster
- Nutzennummern sind jetzt kleiner und weniger dominant.
- Visitenkarten-Nutzenplan wurde weiter an einen echten Mehrnutzenbogen angenähert.
- Briefbogen-Nutzenplan behandelt A4-Hochformat separat und zeigt zwei ruhig platzierte Nutzen auf SRA3.
- Flyer/Broschüre/Plakat/Sticker behalten eigene Produktart-Regeln, ohne die Motive unnötig zu verzerren.
- Die echten Preview-Bilder aus den PDF-Assets bleiben die Grundlage für die Darstellung.
- Neues Pattern `finalized-imposition-preview` dokumentiert.

### Nicht verändert

- Keine echte Ausschieß-Engine.
- Keine Berechnung von Greiferrand, Bundsteg, Zwischenschnitt oder Laufrichtung.
- Keine Browser-PDF-Rendering-Logik.
- Keine Änderung an Übersicht, Kartenklick, Rücknavigation, zentralem UI-State oder Persistenz.

### Nächster sinnvoller Schritt

Als nächstes kann der Nutzenplan fachlich weiter vorbereitet werden: Produktart, Bogenformat, Drehung, Zwischenschnitt, Greiferrand und tatsächliche Nutzenpositionen sollten später aus Produktionsparametern berechnet werden.

## Design Sprint 44.5 – Nutzennummern und Motivruhe im Nutzenplan optimieren

Sprint 44.5 verfeinert die echten Datei-Previews im Nutzenplan. Die Druckmotive bleiben im Vordergrund; Nutzennummern dienen nur noch als dezente Orientierung und konkurrieren nicht mehr mit den Motiven.

Umgesetzt:

- Nutzennummern im Nutzenplan deutlich verkleinert und transparenter gestaltet.
- Nummern sitzen ruhiger am Nutzenrand statt dominant auf dem Motiv.
- Hover-Zustand hebt die Nummern bei Bedarf stärker hervor.
- Visitenkarten-Nutzenplan optisch beruhigt, damit die 24 Motive weniger kleinteilig wirken.
- Motivfilter reduziert, um die echten PDF-Previews weniger künstlich wirken zu lassen.
- Briefbogen- und Plakat-Nutzen behalten die größere, ruhige Aussenpositionierung der Nutzennummern.
- Keine Änderung an Ausschießlogik, zentralem UI-State, Rücknavigation oder PDF-Asset-Struktur.

Neues Pattern:

- `quiet-imposition-numbering`

## Design Sprint 44.6 – Visitenkarten-Nutzenplan entzerren

Sprint 44.6 korrigiert die Darstellung der echten Visitenkarten-Previews im Nutzenplan. Die Nutzen sollen nicht wie übereinanderliegende Miniaturkarten wirken, sondern als sauber getrennte Einzelnutzen auf dem Druckbogen lesbar bleiben.

Umgesetzt:

- Visitenkarten-Nutzenplan bekommt mehr Abstand zwischen den einzelnen Nutzen.
- Kachelschatten und starke Motivschatten wurden für Visitenkarten im Nutzenplan reduziert.
- Visitenkarten-Preview wird innerhalb jeder Nutzenzelle mit `contain` statt mit einer stapelartig wirkenden Füllung dargestellt.
- Einzelzellen wirken klarer voneinander getrennt.
- Nutzennummern bleiben dezent und treten weiter in den Hintergrund.
- Briefbogen, Plakat, Flyer, Broschüre und Sticker bleiben unverändert.
- Keine Änderung an Ausschießlogik, Datenmodell, PDF-Assets oder UI-State.

Neues Pattern:

- `business-card-imposition-deoverlap`

## Sprint 44.7 – Druckbogen-Nutzenplan realistischer darstellen

- Visitenkarten-Nutzenplan von künstlichen UI-Kacheln weiter Richtung flacher Druckbogen-Vorschau verschoben.
- Einzelne Nutzen besitzen keine Card-Shadows/Stapelanmutung mehr.
- Echte Druckdatei-Motive liegen flacher auf dem Bogen; Schnitt- und Beschnittlinien bleiben dezent sichtbar.
- Bogengrenze, Sicherheitsrahmen und technisches Raster sind ruhiger und produktionsnäher gestaltet.
- Briefbogen, Flyer, Broschüre und Plakat nutzen dieselbe flachere Druckbogen-Anmutung, ohne neue Ausschießlogik einzuführen.
- Keine Änderung an PDF-Rendering, Datenlogik, UI-State, Übersicht oder Navigation.

## Sprint 44.8 – Druckbogen größer und produktionsnäher darstellen

Sprint 44.8 verfeinert den in Sprint 44.7 eingeführten flachen Druckbogen-Look. Der Nutzenplan soll stärker wie ein echter Produktionsbogen wirken und weniger wie eine verkleinerte UI-Vorschau innerhalb der Karte.

Umgesetzt:

- Druckbogen im Nutzenplan größer skaliert.
- Randabstände im Bogen reduziert, damit Visitenkarten- und Briefbogen-Motive besser erkennbar sind.
- Technischer Hilfstext aus der Bogenfläche entfernt, damit die Druckmotive ruhiger wirken.
- Visitenkarten-Nutzenplan bleibt flach und produktionsnah, ohne Rückkehr zur Kachel-/Stapeloptik.
- Nutzennummern bleiben sehr dezent und treten nur als Orientierung auf.
- Briefbogen-Nutzenplan wird ebenfalls größer dargestellt, aber nur zurückhaltend verändert.
- Keine Änderung an Ausschießlogik, PDF-Rendering, Datenmodell, zentralem UI-State, Übersicht oder Navigation.

Neues Pattern:

- `larger-production-imposition-sheet`


## Sprint 44.9 – Druckbogen vollständig sichtbar einpassen

- Nutzenplan-Druckbogen bleibt vollständig sichtbar; keine Motive werden am Rand abgeschnitten.
- Visitenkarten-Nutzenplan wurde von der zu engen 4x6-Darstellung auf eine ruhigere 5x5-Bogenlogik umgestellt, damit 24 Nutzen auf dem SRA3-Bogen klarer und produktionsnäher wirken.
- PDF-/Preview-Motive werden im Nutzenplan mit `contain` eingepasst statt mit `cover` beschnitten.
- Briefbogen-Nutzenplan behält den A4-Hochformat-Charakter und wird ebenfalls ohne Cropping dargestellt.
- Keine Änderung an Ausschießlogik, Datenmodell, Übersicht, Rücknavigation oder UI-State.

## Sprint 44.10 – Visitenkarten-Nutzenplan als sauberer 24er-Druckbogen

Sprint 44.10 korrigiert die Nutzenplan-Darstellung für Visitenkarten nach Sprint 44.9. Das vorherige 5×5-Raster zeigte alle Nutzen vollständig, wirkte aber durch die unvollständig gefüllte letzte Reihe nicht wie ein sauber geplanter Druckbogen.

Umgesetzt:

- Visitenkarten-Nutzenplan nutzt wieder eine vollständige 24er-Anordnung.
- Desktop-Darstellung verwendet ein ruhiges 6×4-Druckbogenraster.
- Die 24 Nutzen füllen den Bogen vollständig ohne leere Rasterplätze.
- Motive bleiben flach auf dem Bogen und kehren nicht zur Kachel-/Stapeloptik zurück.
- Bogengrenze und Sicherheitsrahmen bleiben sichtbar.
- Nutzennummern bleiben sehr dezent.
- Mobile Darstellung darf weiter auf 4×6 umbrechen, damit die Vorschau lesbar bleibt.

Nicht geändert:

- keine echte Ausschieß-Engine
- keine PDF-Rendering-Logik
- keine Datenlogik
- keine Änderung an Übersicht, Rücknavigation, UI-State oder Auftragstaschen-Navigation

## Sprint 44.11 – Visitenkarten-Druckbogen lesbarer skalieren

Sprint 44.11 verfeinert den Visitenkarten-Nutzenplan nach Sprint 44.10. Das 6×4-Raster bleibt erhalten, der Bogen nutzt aber mehr der verfügbaren Kartenbreite und die Motive werden lesbarer dargestellt.

Umgesetzt:

- Vollständiges 24er-Raster im 6×4-Prinzip bleibt erhalten.
- Nutzenplan-Card gibt dem Druckbogen mehr Breite.
- Innenränder und Abstände im Bogen wurden reduziert.
- Visitenkarten-Motive werden etwas größer und kontrastreicher dargestellt.
- Bogengrenze und Sicherheitsrahmen bleiben sichtbar.
- Nutzennummern bleiben sehr dezent.
- Keine Rückkehr zur Kachel-/Stapeloptik.
- Briefbogen und andere Produktarten werden nicht fachlich verändert.

Nicht geändert:

- keine echte Ausschieß-Engine
- keine PDF-Rendering-Logik
- keine Datenlogik
- keine Änderung an Übersicht, Rücknavigation oder UI-State


## Sprint 44.12 – Visitenkarten-Nutzenplan praxisnäher setzen

Sprint 44.12 korrigiert die horizontale Wirkung des Visitenkarten-Nutzenplans nach Sprint 44.11. Das 6×4-Raster bleibt bestehen, die Nutzen stehen aber deutlich enger und produktionstypischer auf dem Bogen.

Umgesetzt:

- Horizontale und vertikale Abstände zwischen den Visitenkarten-Nutzen deutlich reduziert.
- Innenränder des SRA3-Bogens zurückgenommen, ohne die Bogengrenze zu verlieren.
- Visitenkarten-Motive etwas stärker skaliert und kontrastreicher dargestellt.
- Nutzen bleiben flach auf dem Druckbogen; keine Rückkehr zu Kachel-/Stapeloptik.
- Nutzennummern bleiben extrem dezent.
- Briefbogen und andere Produktarten bleiben unverändert.

Nicht geändert:

- keine echte Ausschieß-Engine
- keine PDF-Rendering-Logik
- keine Datenlogik
- keine Änderung an Übersicht, Rücknavigation oder UI-State

## Sprint 44.13 – Nutzenplan mit praxisnahen 3–5-mm-Abständen

Sprint 44.13 präzisiert den Visitenkarten-Nutzenplan nach Sprint 44.12. Der Bogen bleibt als vollständiger 24er-Druckbogen im 6×4-Raster aufgebaut, die Zwischenräume werden aber technisch plausibler als ca. 3–5 mm simuliert.

Umgesetzt:

- 6×4-Raster für Visitenkarten bleibt erhalten.
- Zwischenräume werden über ein eigenes CSS-Token `--pp-bc-practical-gap` auf ca. 3–5 mm simuliert.
- Die Grid-Zeilen werden nicht mehr künstlich über die komplette Bogenhöhe gestreckt; die Nutzen stehen als geschlossener Produktionsblock auf dem Bogen.
- Innenränder und Sicherheitsrahmen bleiben sichtbar, wirken aber nicht mehr wie UI-Abstände.
- Visitenkarten-Motive bleiben flach, ohne Kachel- oder Stapeloptik.
- Technische Legende ergänzt: `Zwischenraum ca. 3–5 mm · schematische Produktionsvorschau`.
- Briefbogen und andere Produktarten bleiben unverändert.

Nicht geändert:

- keine echte Ausschieß-Engine
- keine Berechnung von Greiferrand, Zwischenschnitt oder Laufrichtung
- keine PDF-Rendering-Logik
- keine Datenlogik
- keine Änderung an Übersicht, Rücknavigation oder UI-State

## Sprint 44.14 – Nutzenplan fachliche Kennzeichnung finalisieren

Sprint 44.14 ergänzt die Nutzenplan-Vorschau um eine ruhigere technische Kennzeichnung. Die eigentliche Visitenkarten-Bogenlogik aus Sprint 44.13 bleibt unverändert; es wird nur die Legende fachlich sauberer und weniger dominant geführt.

Umgesetzt:

- Explizite technische Legende unter dem Nutzenplan ergänzt.
- Kennzeichnung für Bogenformat, Nutzenformat, Beschnitt und Abstand eingeführt.
- Hinweis `schematische Produktionsvorschau` aus der dominanten Inline-Beschriftung gelöst und dezenter platziert.
- Visitenkarten zeigen weiterhin den praxisnahen Zwischenraum von ca. 3–5 mm.
- Briefbogen erhält eine passendere Kennzeichnung für A4-Stand auf SRA3.
- Legende ist responsive und bricht auf kleineren Breiten ruhiger um.

Nicht geändert:

- keine neue Ausschießlogik
- keine Berechnung von Greiferrand, Zwischenschnitt oder Laufrichtung
- keine PDF-Rendering-Logik
- keine Datenlogik
- keine Änderung an Übersicht, Rücknavigation oder UI-State


## Sprint 45 – PDF-/Preview-Datenstruktur professionalisieren

Sprint 45 professionalisiert die Druckdaten- und Preview-Struktur, ohne bereits eine echte Ausschieß-Engine oder Persistenz einzuführen. Ziel ist ein sauberer fachlicher Übergang von der aktuellen Demo-UI zu späteren echten Auftragsdaten.

Umgesetzt:

- Neue abgeleitete Struktur `OrderProductionData` in `order-data.ts` eingeführt.
- Fachliche Trennung vorbereitet zwischen:
  - Original-PDF
  - generiertem Preview-Bild
  - Produktart
  - Produkt-/Nutzenformat
  - Bogenformat
  - Nutzenplan-Typ
  - Raster/Anordnung
  - Beschnitt
  - Abstand/Zwischenschnitt
  - Preflight-/Datenstatus
- Visitenkarten verwenden im Datenmodell explizit den Typ `business-card-24up` mit 6×4, 24 Nutzen und ca. 3–5 mm Abstand.
- Briefbogen verwendet den Typ `letterhead-2up` mit A4-Stand auf SRA3.
- Auftragstasche liest Produktdetails, Dateiliste, Preview-Spezifikation, Nutzenplan-Stats und Legende bevorzugt aus der neuen Struktur.
- Bestehende Felder bleiben aus Kompatibilitätsgründen erhalten, damit Übersicht, zentraler UI-State und aktuelle Demo-Interaktion unverändert funktionieren.
- Neues Pattern `professional-print-file-data-model` ergänzt.

Nicht geändert:

- keine echte Ausschieß-Engine
- keine PDF-Rendering-Logik im Browser
- keine Persistenz, kein LocalStorage, keine Datenbank
- keine Änderung an Übersicht, Kartenklick, Rücknavigation oder UI-State


## Sprint 45.1 – Schnittstelle Kalkulation → Produktionsdaten planen

Sprint 45.1 definiert den Datenvertrag zwischen Kalkulation/Nutzenrechner und Auftragstasche, ohne bereits eine echte Integration einzubauen. Ziel ist, dass der spätere Nutzenrechner fachlich entscheidet und die Auftragstasche das Ergebnis nur produktionsnah visualisiert.

Umgesetzt:

- Neuer TypeScript-Vertrag `CalculationToProductionPayload` in `order-data.ts` ergänzt.
- Neue Struktur `CalculationImpositionResult` vorbereitet für Ergebnisse des Nutzenrechners.
- Neues Feldschema `calculationProductionContract` dokumentiert die wichtigsten Übergabefelder.
- Trennung vorbereitet zwischen:
  - Kalkulationswerten, z. B. Auflage, Bogenanzahl, Zuschuss, Restmenge
  - Produktionswerten, z. B. Bogenformat, Raster, Beschnitt, Zwischenschnitt, Maschine
  - Datei-/Preview-Werten, z. B. Original-PDF und gerendertes Thumbnail
- Der Nutzenrechner soll später liefern:
  - Produktart und Endformat
  - Bogenformat
  - Nutzenformat
  - Raster/Anordnung
  - Nutzenanzahl
  - Beschnitt
  - Abstand/Zwischenschnitt
  - Bogenanzahl
  - Zuschuss/Überdruck
  - Restmenge
  - optionale Maschinenempfehlung
- Auftragstasche und Übersicht bleiben Consumer dieser Daten und berechnen den Nutzenplan nicht eigenständig neu.
- Neues Pattern `calculation-production-contract` ergänzt.

Nicht geändert:

- keine echte Verbindung zur Kalkulation
- keine Ausschieß-Engine
- keine Persistenz/DB/LocalStorage
- keine Änderung an UI-State, Übersicht, Rücknavigation oder Preview-Rendering


## Sprint 45.2 – Demo-Adapter Kalkulation → Auftrag vorbereiten

Sprint 45.2 ergänzt den in Sprint 45.1 definierten Datenvertrag um einen ersten Demo-Adapter. Ziel ist noch nicht die echte Anbindung der Kalkulationsseite, sondern ein sauberer Mapping-Pfad von einem späteren Nutzenrechner-Ergebnis in Auftrag und Produktionsdaten.

Umgesetzt:

- Neuer TypeScript-Typ `CalculationToOrderDraftOptions` für optionale Auftragskopfdaten.
- Neue Funktion `createProductionDataFromCalculation(payload, fallbackOrder)`.
- Neue Funktion `createOrderDraftFromCalculation(payload, baseOrder, options)`.
- Demo-Payload `demoCalculationPayload` ergänzt.
- Demo-Auftrag `demoOrderFromCalculation` ergänzt.
- Der Adapter mappt unter anderem:
  - Produktart und Produktbezeichnung
  - Endformat / Nutzenformat
  - Auflage
  - Bogenformat
  - Raster / Nutzenanzahl
  - Beschnitt
  - Abstand / Zwischenschnitt
  - Bogenanzahl / Zuschuss / Restmenge
  - Maschinenempfehlung
  - Original-PDF / Preview-Bild
  - erste Checklisten- und Verlaufseinträge
- Neues Pattern `calculation-to-order-adapter` ergänzt.

Wichtig:

- Der Adapter ist noch nicht in die UI eingebunden.
- Die bestehende Aufträge-Übersicht und Auftragstasche bleiben unverändert.
- Die Kalkulationsseite wird noch nicht angebunden.
- Keine Persistenz, kein LocalStorage, keine Datenbank.
- Der Nutzenplan wird weiterhin nur visualisiert; die fachlichen Werte kommen später aus dem Nutzenrechner.

## Sprint 46 – Kalkulationsmodul als UI-Fläche vorbereiten

Sprint 46 führt die erste sichtbare Kalkulationsseite im PrintPilot-Next-Stil ein. Ziel ist noch keine echte Kalkulationslogik, sondern eine belastbare UI-Struktur, die den Datenvertrag aus Sprint 45.1 und den Demo-Adapter aus Sprint 45.2 sichtbar macht.

Umgesetzt:

- Neue Seite `src/features/calculation/CalculationPage.tsx` ergänzt.
- Bottom-Navigation um **Kalkulation** erweitert.
- `App.tsx` kann jetzt zwischen Aufträge-Übersicht, Auftragstasche und Kalkulation wechseln.
- Kalkulationsseite zeigt:
  - Produktparameter,
  - Bogenparameter,
  - Auflage,
  - Raster/Nutzenanzahl,
  - Bogenanzahl/Zuschuss/Restmenge,
  - Maschinenempfehlung,
  - vorbereiteten Nutzenrechner-Ergebnisbereich.
- Demo-Aktion **Aus Kalkulation Auftrag erzeugen** nutzt `createOrderDraftFromCalculation(...)` und übernimmt den Entwurf in den zentralen UI-State.
- Der erzeugte Demo-Auftrag öffnet direkt die Auftragstasche und kann dort wie ein normaler Auftrag geprüft werden.
- Datenvertrag-Felder aus `calculationProductionContract` werden als rechte Infospalte sichtbar gemacht.
- Neues Pattern `calculation-module-scaffold` ergänzt.

Nicht geändert:

- keine echte Kalkulationsberechnung
- keine echte Ausschieß-Engine
- keine Persistenz/DB/LocalStorage
- keine Änderung an Auftragstaschen-Preview, Nutzenplan-Rendering oder PDF-Preview-Assets

## Sprint 46.1 – Navigation fachlich sortiert

Sprint 46.1 korrigiert die fachliche Reihenfolge der Bottom-Navigation. Das Kalkulationsmodul steht jetzt direkt nach dem Dashboard, weil es im PrintPilot-Workflow vor Angebot, Auftrag und Produktion liegt.

Umgesetzt:

- Bottom-Navigation von `Dashboard → Aufträge → Kalkulation` auf `Dashboard → Kalkulation → Aufträge` umgestellt.
- Aktive Zustände für `Kalkulation` und `Aufträge` bleiben unverändert erhalten.
- Navigation bleibt bewusst klein gehalten: Dashboard und weitere Module sind weiterhin vorbereitet, aber noch nicht produktiv angebunden.
- Neues Pattern `navigation-domain-order` ergänzt.

Nicht geändert:

- keine Änderung an Kalkulationslogik
- keine Änderung an Aufträge-Übersicht
- keine Änderung an Auftragstasche, Kartenklick, Rücknavigation oder zentralem UI-State
- keine Änderung an Datenmodell, Persistenz oder Nutzenrechner-Vertrag

## Sprint 46.2 – Kalkulation als klare Eingabemaske mit Produktionsart

Sprint 46.2 stellt die Kalkulationsseite vom Demo-/Dashboard-Aufbau auf eine echte Arbeitsmaske um. Die Eingabe steht im Vordergrund, das Ergebnis wird separat rechts als vorbereiteter Nutzenrechner-/Produktionsdatenbereich angezeigt.

Umgesetzt:

- Kalkulationsseite als klare Eingabemaske neu strukturiert.
- Eingabegruppen in fachlicher Reihenfolge:
  - Produkt
  - Format
  - Auflage
  - Material / Papier
  - Produktionsart
  - Weiterverarbeitung
  - Ergebnis / Nutzenrechner
- Produktionsart als zentrale Auswahl ergänzt:
  - Eigenproduktion
  - Fremdproduktion
  - Kombination
- Eigenproduktion zeigt vorbereitete Felder für Maschine, Druckart, Wendung und Nutzenrechner.
- Fremdproduktion zeigt vorbereitete Felder für Lieferant, Einkaufspreis, Lieferzeit, Marge/Aufschlag, Angebotsnummer, Fracht und Handling.
- Kombination bereitet die spätere Aufteilung von internen und externen Produktionsschritten vor.
- Ergebnisbereich bleibt getrennt von der Eingabe und zeigt Produktionsweg, Nutzen, Bogenanzahl und Zwischenschnitt.
- Button „Auftrag aus Kalkulation erzeugen“ liegt jetzt im Ergebnisbereich.
- Keine echte Berechnungslogik ergänzt.
- Datenvertrag aus Sprint 45.1/45.2 bleibt Grundlage.

Nicht umgesetzt:

- keine echte Kostenkalkulation
- keine Lieferantenverwaltung
- keine Persistenz/DB/LocalStorage
- keine echte Nutzenrechner-Integration

## Sprint 46.3 – Kalkulation als große Eingabemaske

Sprint 46.3 beruhigt die Kalkulationsseite weiter. Die fachlichen Gruppen aus Sprint 46.2 bleiben erhalten, werden aber nicht mehr als viele einzelne Cards geführt. Stattdessen steht eine große, zusammenhängende Eingabemaske im Vordergrund.

Umgesetzt:

- Kalkulations-Eingabe als eine große Formularfläche gestaltet.
- Produkt, Format, Auflage, Material, Produktionsart und Weiterverarbeitung bleiben in fachlicher Reihenfolge erhalten.
- Abschnitte werden nur noch über Zwischenüberschriften, Nummern und feine Trennlinien geführt.
- Viele kleine Card-Rahmen wurden aus der Eingabe entfernt.
- Feldraster und Eingabehöhen wurden kompakter gesetzt.
- Produktionsart bleibt zentral in der Maske und unterscheidet weiterhin Eigenproduktion, Fremdproduktion und Kombination.
- Fremdproduktionsfelder bleiben vorbereitet: Lieferant, Einkaufspreis, Lieferzeit, Marge, Angebotsnummer, Fracht und Handling.
- Ergebnis-/Nutzenrechner-Bereich bleibt rechts als separate Zusammenfassung erhalten.
- Neues Pattern `calculation-large-input-mask` ergänzt.

Nicht geändert:

- keine echte Kalkulationsberechnung
- keine neue Ausschießlogik
- keine Lieferantenverwaltung
- keine Persistenz/DB/LocalStorage
- keine Änderung an Aufträge-Übersicht, Auftragstasche oder zentralem UI-State

## Sprint 46.4 – Kalkulationsmaske nach MIS-Vergleich erweitert

Sprint 46.4 erweitert die große Kalkulationsmaske fachlich in Richtung einer realistischeren Print-MIS-Eingabe. Die Maske bleibt bewusst eine zusammenhängende Formularfläche; es werden keine vielen kleinen Cards zurückgeführt.

Umgesetzt:

- Abschnitt **Kopfdaten** ergänzt mit Kunde, Ansprechpartner, Projekt/Jobname, Kalkulationsnummer, Liefertermin, Bearbeiter, Kundenreferenz und interner Notiz.
- Abschnitt **Produktdetails** erweitert um Produktart, Bezeichnung, Umfang, Farbigkeit, Motive/Sorten und spätere Personalisierung.
- Abschnitt **Format** erweitert um Endformat, offenes Format, Ausrichtung, Beschnitt, Sicherheitsabstand, Nutzenformat, Sonderform/Stanze und Datenprüfung.
- Abschnitt **Auflage / Staffeln** ergänzt mit Hauptauflage, Zuschuss, Netto-Menge, Restmenge, Staffel-Vorbereitung und Varianten.
- Abschnitt **Material / Papier** erweitert um Materialgruppe, Artikel, Grammatur, Bogenformat, Laufrichtung, Lagerstatus, Lieferant und Preisstand.
- Abschnitt **Produktion** bleibt mit Eigenproduktion, Fremdproduktion und Kombination erhalten, wurde aber um MIS-typische Felder wie Rüstzeit, Laufzeit, Klickkosten, Makulatur, interne Prüfung und Handling-Aufwand erweitert.
- Abschnitt **Weiterverarbeitung** wurde als kompakte Matrix aufgebaut statt als einfache Checkbox-Liste.
- Weiterverarbeitungs-Matrix enthält vorbereitete Detailfelder für:
  - Schneiden mit Schnittart und Schnitten,
  - Falzen mit Falzart und Anzahl Brüche,
  - Rillen/Nuten mit Anzahl Rillungen und Positionen,
  - Heften mit Rückstich/Ringösen/Klammern,
  - Klebebindung mit PUR/Hotmelt, Rücken und Umschlag,
  - Fadenheftung mit Lagen und Seiten je Lage,
  - Bohren/Lochen/Ösen mit Anzahl, Durchmesser und Ösen,
  - Laminieren/Kaschieren mit Oberfläche und Seite,
  - Stanzen/Plotten mit Kontur/Stanze/Fremdleistung,
  - Verpacken/Versand mit Bündeln, Kartonieren und Lieferart.
- Abschnitt **Kosten / Ergebnisvorgaben** ergänzt mit Materialkosten, Druckkosten, Weiterverarbeitung, Fremdleistung, Handling, Versand, Marge und Verkaufspreis netto.
- Felder sind visuell als **Pflicht**, **optional** oder **später** gekennzeichnet.
- Neues Pattern `calculation-mis-input-mask` ergänzt.

Nicht geändert:

- keine echte Kalkulationsberechnung
- keine neue Ausschießlogik
- keine Lieferantenverwaltung
- keine Persistenz/DB/LocalStorage
- keine Änderung an Aufträge-Übersicht, Auftragstasche oder zentralem UI-State


## Sprint 46.5 – Kalkulationsmaske verdichtet

Sprint 46.5 reduziert die aufgeblasene Formularoptik der Kalkulation. Die Auftragstaschen-Ästhetik bleibt für Produktionsansichten sinnvoll, die Kalkulation wird aber stärker als produktive MIS-/ERP-Eingabemaske geführt.

Umgesetzt:

- Eingabemaske deutlich kompakter gesetzt.
- Formularhöhe, Abschnittsabstände, Feldhöhen und Rahmenwirkung reduziert.
- Pflicht-/Optional-/Später-Kennzeichnungen kleiner und weniger dominant dargestellt.
- Produktionsart-Auswahl kompakter gemacht, ohne die Unterscheidung Eigenproduktion/Fremdproduktion/Kombination zu entfernen.
- Ergebnisbereich rechts schmaler und nüchterner geführt.
- Weiterverarbeitung von großen Matrixblöcken in eine kompakte Tabelle überführt:
  - Aktiv,
  - Leistung,
  - Art / Parameter,
  - Menge / Anzahl,
  - Produktion.
- Detailinformationen wie Falzart, Rillungen, Klebebindung, Fadenheftung, Bohren/Ösen und Versand bleiben erhalten, beanspruchen aber deutlich weniger Höhe.
- Neues Pattern `calculation-compact-mis-input-mask` ergänzt.

Nicht geändert:

- keine echte Kalkulationsberechnung
- keine neue Ausschießlogik
- keine Lieferantenverwaltung
- keine Persistenz/DB/LocalStorage
- keine Änderung an Aufträge-Übersicht, Auftragstasche oder zentralem UI-State


## Sprint 46.6 – Kalkulation volle Eingabebreite

Die Kalkulationsmaske wurde weiter in Richtung produktive MIS-/ERP-Eingabe verdichtet. Die rechte Ergebnis-/Info-Spalte wurde entfernt, weil sie der eigentlichen Eingabemaske zu viel Breite genommen hat.

Umgesetzt:

- Kalkulationsformular läuft über die volle Inhaltsbreite.
- Ergebnis, Nutzenrechner und Datenvertrag stehen jetzt unter der Eingabemaske.
- Weiterverarbeitungstabelle erhält mehr horizontale Arbeitsfläche.
- Ergebniszone unten ist kompakt als Auswertungsbereich aufgebaut.
- Keine neue Berechnungslogik.

## Sprint 46.7 – Kalkulationsmaske lesbarer und Build-Fix

- Die volle Breite der Kalkulationsmaske aus Sprint 46.6 bleibt erhalten.
- Feldtexte, Formularwerte, Abschnittsüberschriften und Tabellenwerte wurden wieder größer gesetzt.
- Die Maske bleibt kompakt und produktiv, wandert aber nicht zurück in die große Auftragstaschen-/Card-Optik.
- Die Weiterverarbeitungstabelle erhält mehr Mindestbreite und größere Zeilenwerte.
- Der Ergebnisbereich unten bleibt erhalten, wird aber besser lesbar.
- TypeScript-Buildfehler in `src/design-system/ui-patterns.ts` wurden behoben: ältere Pattern-Einträge nutzen wieder die gültigen Felder `category`, `name`, `purpose`, `reference`, `classNames` und `reuseFor` statt nicht typkonformer Zusatzfelder.

## Sprint 46.8 – Kalkulation im Oldschool-MIS-Look

Die Kalkulationsmaske wurde optisch stärker von Auftragstasche und Auftragsübersicht getrennt. Ziel ist eine sachliche, produktive MIS-/ERP-Eingabemaske statt eines modernen Card-/Dashboard-Looks.

Umgesetzt:

- Kalkulationsformular erhält flache, rechteckige Rahmen statt weicher Cards.
- Abschnittsüberschriften werden als graue MIS-Leisten geführt.
- Feldgruppen wirken tabellarischer: Labelspalte links, Wertfeld rechts.
- Rundungen, Schatten und moderne Akzentflächen wurden in der Kalkulation deutlich reduziert.
- Produktionsart-Auswahl wurde nüchterner und leistenartiger gesetzt.
- Weiterverarbeitungstabelle bleibt erhalten, wirkt aber mehr wie eine klassische ERP-Tabelle.
- Ergebnis-/Nutzenbereich unten wurde ebenfalls sachlicher und tabellarischer gestaltet.
- Auftragstasche, Auftragsübersicht und zentrale Navigation bleiben unverändert.

Nicht geändert:

- keine neue Berechnungslogik
- keine neue Persistenz
- keine Änderung am Datenvertrag zwischen Kalkulation und Auftragstasche
- keine Änderung am Produktionsdatenmodell

## Sprint 46.9 – Oldschool-MIS-Look lesbarer machen

Die Kalkulationsmaske bleibt im eigenständigen Oldschool-MIS-/ERP-Look, wird aber für produktive Eingabe besser lesbar abgestimmt.

Umgesetzt:

- Schriftgrößen in der Kalkulation leicht erhöht.
- Feldwerte kräftiger und besser lesbar gesetzt.
- Labels bleiben sachlich, treten aber weniger gegen die Werte an.
- Pflicht-/Optional-/Später-Markierungen dezenter gehalten.
- Formularzeilen und Eingabefelder leicht höher gesetzt.
- Weiterverarbeitungstabelle mit höheren Zeilen und größeren Tabellenwerten versehen.
- Auswertungsbereich unter der Maske lesbarer gegliedert.
- Mehr Abstand zur unteren Navigation geschaffen.
- Keine neue Berechnungslogik ergänzt.

## Sprint 46.10 – Kalkulationsarbeitsfläche beruhigen

- Die Kalkulationsseite behält den Oldschool-MIS-Look aus Sprint 46.8/46.9 bei.
- Die Eingabemaske erhält mehr Abstand zum Header und mehr Sicherheitsabstand zur unteren Navigation.
- Die Bottom-Navigation wird im Kalkulationskontext kompakter und visuell zurückgenommen, damit sie die Formulararbeit weniger stört.
- Die Auswertung unter der Maske wird ruhiger verteilt: Der Nutzenplan bekommt mehr Breite, Produktionsdaten bleiben klar lesbar, der Datenvertrag wird kleiner und technischer geführt.
- Keine neue Berechnungslogik, keine Änderung am Datenvertrag.

## Sprint 46.11 – Bottom-Navigation konsistent wie Aufträge

Die Sonderbehandlung der Bottom-Navigation im Kalkulationskontext wurde zurückgenommen. Die Navigation bleibt nun optisch und funktional konsistent zur Auftragsübersicht; die Kalkulationsseite bleibt scrollbar und erhält unten zusätzlichen Sicherheitsabstand, damit Auswertung und Aktionsbereich nicht an der festen Navigation kleben.

- Kalkulationsspezifische Kompakt-Navigation entfernt
- Bottom-Navigation wieder identisch zur Auftragsansicht
- Scrollfläche der Kalkulation unten abgesichert
- Eingabemaske und MIS-Look unverändert beibehalten
- Keine neue Berechnungslogik

## Sprint 46.12 – Kalkulationsmaske editierbar machen

- Die Kalkulationsseite bleibt optisch im Oldschool-MIS-Look und behält die volle Eingabebreite.
- Demo-/Readonly-Felder wurden in echte lokale Formularfelder überführt.
- Produkt, Format, Auflage, Material/Papier, Produktion, Weiterverarbeitung und Kosten-/Ergebnisvorgaben werden jetzt in lokalem State geführt.
- Die Produktionsart bleibt umschaltbar zwischen Eigenproduktion, Fremdproduktion und Kombination; die sichtbaren Felder reagieren weiter auf die Auswahl.
- Die Weiterverarbeitungstabelle ist editierbar: Leistungen können aktiviert/deaktiviert und Parameter/Mengen/Produktionshinweise angepasst werden.
- Der Ergebnisbereich unten nutzt die aktuellen Maskenwerte für Produkt, Menge, Bogenanzahl, Produktionsweg und aktive Weiterverarbeitungshinweise.
- Der Button „Auftrag aus Kalkulation erzeugen“ erstellt den Entwurf aus den aktuellen Maskenwerten.
- Noch keine vollständige Preislogik, keine Persistenz und keine echte Ausschieß-Berechnung; der Datenfluss ist vorbereitet.

## Sprint 46.13 – Kalkulation als produktive Reitermaske

Die Kalkulationsmaske wurde von einer langen Scroll-Eingabeseite in eine produktive MIS-Reitermaske überführt. Ziel ist maximale Eingabegeschwindigkeit und Benutzerfreundlichkeit statt Show-UI.

Umgesetzt:

- Reiterstruktur für die fachlichen Kalkulationsbereiche eingeführt:
  - Kunde
  - Auftrag
  - Produkt
  - Format
  - Papier
  - Druck
  - Weiterverarbeitung
  - Fremdproduktion
  - Preise
- Kompakter Kalkulationskopf mit Kunde, Produkt, Auflage, Format und Produktionsweg ergänzt.
- Pro Reiter werden nur die relevanten Felder angezeigt; dadurch weniger Scrollen und weniger visuelle Überforderung.
- Der lokale State aus Sprint 46.12 bleibt erhalten; die Felder bleiben editierbar.
- Weiterverarbeitung bleibt als produktive Tabelle erhalten.
- Ergebnisbereich wurde zur kompakten Kurzübersicht unterhalb der Reitermaske reduziert.
- Nüchterne Status-/Aktionsleiste mit aktivem Bereich, Nutzen/Bogen und Button „Auftrag aus Kalkulation erzeugen“ ergänzt.
- Bottom-Navigation bleibt unverändert konsistent wie bei Aufträge.
- Keine neue Preislogik, keine Persistenz und keine echte Ausschieß-Berechnung.

## Sprint 46.14 – Reiter gleich breit und Eingabefelder klarer

- Die Reiter der Kalkulationsmaske werden als gleich breite Raster-Reiter geführt, damit die Navigation ruhiger und produktiver wirkt.
- Aktive und editierbare Eingabefelder sind stärker als Felder erkennbar: klarere Rahmen, hellere Eingabefläche, dezenter Innenkontrast und deutlicherer Fokuszustand.
- Labels bleiben im Oldschool-MIS-Stil, erhalten aber eine ruhigere, abgegrenzte Label-Fläche.
- Die Reiterlogik, der lokale State, die Weiterverarbeitungstabelle und die Ergebnisübergabe bleiben unverändert.
- Keine neue Preislogik, keine Persistenz und keine echte Ausschieß-Berechnung.

## Sprint 46.15 – Reiter zusammenfassen und Typografie schärfen

- Die Kalkulations-Reitermaske wurde von neun Einzelreitern auf sechs produktive Hauptreiter reduziert:
  - Kunde & Auftrag
  - Produkt & Format
  - Papier & Druck
  - Weiterverarbeitung
  - Fremdproduktion
  - Preise & Ergebnis
- Zusammengehörige Eingabeschritte liegen nun in einem Arbeitsbereich, damit weniger geklickt und weniger zwischen Kleinstreitern gewechselt werden muss.
- Die gleich breiten Reiter bleiben erhalten, wirken aber durch die reduzierte Anzahl ruhiger und besser bedienbar.
- Die Typografie der Kalkulationsmaske wurde entschärft: weniger fette Kleinschrift, weniger dunkle Textballung, ruhigere Labels und klarere Eingabewerte.
- Tabellenwerte und Weiterverarbeitungsfelder wurden typografisch zurückgenommen, damit die Maske weniger verschwommen/verwaschen wirkt.
- Lokaler State, editierbare Felder, Weiterverarbeitungstabelle und Übergabe an den Auftragsentwurf bleiben erhalten.
- Keine neue Preislogik, keine Persistenz und keine echte Ausschieß-Berechnung.

## Sprint 46.16 – Bedienfluss und Badge-/Pill-System schärfen

- Die Kalkulations-Reitermaske erhält eine erste Bedienfluss-Führung: Pflichtfelder werden pro Hauptreiter gezählt und direkt im Reiter angezeigt.
- Die Statusleiste zeigt nun, wie viele Mindestdaten noch offen sind und wie viele davon im aktiven Bereich liegen.
- Der Button „Auftrag aus Kalkulation erzeugen“ wird nur freigegeben, wenn die Mindestdaten vollständig sind.
- Der Reiter „Fremdproduktion“ wird bei reiner Eigenproduktion visuell zurückgenommen, bleibt aber weiterhin erreichbar.
- Pflicht-/optional-/später-Badges wurden geprüft und optisch entschärft: Pflichtfelder sind klar erkennbar, optionale Felder neutral und spätere Felder bewusst zurückhaltend.
- Aktive Weiterverarbeitungszeilen werden in der Tabelle besser markiert.
- Keine neue Preislogik, keine Persistenz und keine echte Ausschieß-Berechnung.

## Sprint 46.17 – Kalkulations-Feldcheck und Feldbestand komplettieren

Die Kalkulationsmaske wurde fachlich gegen typische Druckerei-/MIS-Anforderungen geprüft. Ziel war keine neue Preislogik und kein weiterer Designumbau, sondern die Frage: Sind die Felder vorhanden, die für eine reale Druckkalkulation und spätere Übergabe an Auftragstasche/Produktion benötigt werden?

Ergänzt bzw. vorbereitet:

- **Kunde & Auftrag**
  - Telefon und E-Mail des Ansprechpartners
  - Rechnungsadresse und Lieferadresse als eigene Felder
  - Bestellnummer/Kundenauftrag
  - Korrekturtermin
  - Auftragsart
  - detaillierter Datenstatus
  - Kundenhinweis
  - Überlieferungsregel
  - Teillieferungen
  - Muster/Belegexemplare

- **Produkt & Format**
  - Farben Vorderseite
  - Farben Rückseite
  - Sonderfarben
  - Datenquelle
  - Sonderform/Stanze bleibt vorbereitet

- **Papier & Druck**
  - Rohbogenformat
  - Druckbogenformat
  - Papier-Nutzen
  - Nettobogen
  - Zuschussbogen
  - Bruttobogen
  - Papierquelle: am Lager / bestellt / gestellt
  - Papierbestellstatus
  - Zähler-/Klickmodus
  - Produktionshinweis

- **Weiterverarbeitung**
  - Ecken abrunden
  - Perforieren
  - Nummerieren
  - bestehende Matrix für Schneiden, Falzen, Rillen/Nuten, Heften, Klebebindung, Fadenheftung, Bohren/Ösen, Laminieren/Kaschieren, Stanzen/Plotten und Verpacken bleibt erhalten

- **Preise & Ergebnis**
  - Verpackungskosten
  - Gemeinkosten
  - Mindestpreis
  - Rabatt
  - Deckungsbeitrag
  - Abrechnungsmodus
  - Mengenabrechnung
  - Provision
  - Rechnungskontrolle

- **Fachlicher Feldcheck**
  - Im Reiter „Preise & Ergebnis“ wurde eine kompakte Feldcheck-Übersicht ergänzt: bereits abgedeckte Bereiche, produktionsrelevant ergänzte Felder und später logisch anzubindende Themen.

Nicht geändert:

- keine neue Preislogik
- keine Persistenz
- keine echte Ausschieß-Berechnung
- keine grundsätzliche Änderung am Reiterlayout
- keine Änderung an Auftragstasche/Auftragsübersicht

## Sprint 46.18 – Feldbestand prüfen und Maske fachlich aufräumen

Die Kalkulationsmaske wurde nicht weiter mit neuen Feldern aufgefüllt, sondern fachlich sortiert und entschärft. Ziel ist weiterhin eine produktive MIS-/ERP-artige Arbeitsmaske mit schnellem Bedienfluss, nicht eine Dashboard-Optik und keine Printy-Kopie.

Geändert:

- **Pflichtfelder reduziert**
  - Mindestdaten blockieren den Auftrag nur noch dort, wo sie für einen sinnvollen Auftragsentwurf wirklich notwendig sind.
  - `Kalkulationsnummer`, `Korrektur bis`, `Auftragsart`, `Datenstatus`, `Zuschuss`, Lager-/Papierstatus, Wendung, Preis-/Abrechnungsfelder und Weiterverarbeitung blockieren den Auftrag nicht mehr.
  - Die Weiterverarbeitung darf leer bleiben, weil es real auch reine Druck-/Schneid- oder Vorstufenaufträge geben kann.

- **Kunde & Auftrag fachlich aufgeräumt**
  - Kontakt- und Adressfelder stehen zusammen im Block `Kunde / Kontakt`.
  - Jobname, Status, Termine, Bestellnummer und Hinweise stehen im Block `Auftrag / Status`.
  - Auflage, Zuschuss, Netto-/Restmenge, Überlieferung, Teillieferungen, Muster, Varianten und Staffeln stehen im Block `Menge / Lieferung`.

- **Produkt & Format sauberer getrennt**
  - Produktart, Bezeichnung, Umfang und Farbigkeit liegen im Produktblock.
  - Endformat, offenes Format, Beschnitt, Datenquelle und Datenprüfung liegen im Format-/Druckdatenblock.
  - Vorder-/Rückseitenfarben bleiben sichtbar, sind aber nicht mehr doppelt pflichtig, weil die Grundfarbigkeit bereits ein Pflichtfeld ist.

- **Papier & Druck entschärft**
  - Artikel, Grammatur, Bogenformat, Maschine, Druckart und Nutzenrechner bleiben echte Mindestdaten.
  - Papierquelle, Lagerstatus, Papierbestellung, Preisstand, Netto-/Zuschuss-/Bruttobogen, Maschinenzeiten, Klickkosten und Zählermodus bleiben vorbereitet, aber blockieren nicht.

- **Fremdproduktion und Preise bleiben erreichbar, aber nicht übergriffig**
  - Bei Eigenproduktion bleibt der Reiter Fremdproduktion zurückgenommen.
  - Bei Fremdproduktion sind nur Lieferant, Einkaufspreis und Lieferzeit echte Mindestdaten.
  - Preis-/Ergebnisfelder bleiben als fachliche Vorgaben vorbereitet, aber ohne Pflichtzwang und ohne neue Preislogik.

- **Fachlicher Feldcheck aktualisiert**
  - Die Übersicht im Reiter `Preise & Ergebnis` zeigt jetzt klarer:
    - welche Pflichtfelder bewusst bleiben,
    - welche Felder korrekt einsortiert wurden,
    - welche Themen später bewusst nicht blockierend angebunden werden.

Nicht geändert:

- keine neue Preislogik
- keine Persistenz
- keine echte Ausschieß-Berechnung
- keine große Designänderung
- keine Änderung an Auftragstasche oder Auftragsübersicht

## Sprint 46.19 – Bedienfluss und Pflichtfeld-Logik schärfen

Die Kalkulationsmaske wurde fachlich weiter entschärft. Der Schwerpunkt liegt jetzt auf einem klaren Bedienfluss zwischen `kalkulierbar`, `angebotsfähig` und `auftragsfähig`, ohne neue Preislogik und ohne große Designänderung.

Geändert:

- **Drei Reifegrade eingeführt**
  - `Kalkulierbar`: Mindestdaten für eine interne Kalkulation sind vorhanden.
  - `Angebotsfähig`: zusätzlich sind kunden- und angebotsrelevante Angaben vorhanden.
  - `Auftragsfähig`: zusätzlich sind auftragsrelevante Angaben wie Projekt, Bearbeiter und Liefertermin vorhanden.
  - Die Statuszeile zeigt diese drei Zustände direkt sichtbar an.

- **Pflichtfeld-Logik reduziert und fachlich getrennt**
  - Für die reine Kalkulation zählen vor allem Auflage, Produkt, Format, Material, Maschine und Druckart.
  - Für Angebot und Auftrag werden zusätzliche Felder geprüft, aber nicht alle vorbereiteten Felder blockieren pauschal.
  - Bei Eigenproduktion blockiert der Reiter `Fremdproduktion` weiterhin nicht.
  - Bei Fremdproduktion oder Kombination bleiben Lieferant, Einkaufspreis und Lieferzeit relevant.

- **Auftrag-erzeugen-Button präzisiert**
  - Der Button bleibt gesperrt, solange echte Auftragsdaten fehlen.
  - Die Beschriftung unterscheidet jetzt deutlicher zwischen fehlenden Auftragsdaten und einer generell unvollständigen Maske.

- **Badges weiter bereinigt**
  - `Beschnitt`, `Grammatur`, `Bogenformat` und `Nutzenrechner` blockieren nicht mehr pauschal.
  - `Nutzenrechner` ist als späterer Automatik-/Engine-Bereich markiert.
  - Pflicht-Pills stehen stärker nur noch an Feldern, die für den nächsten Workflow-Schritt wirklich kritisch sind.

- **Fachlicher Feldcheck aktualisiert**
  - Die Übersicht in `Preise & Ergebnis` dokumentiert jetzt die drei Reifegrade und den bereinigten Bedienfluss.
  - Spätere Themen wie Preisimport, Zuschussautomatik, Deckungsbeitrag, Mindestpreis, Provision, Persistenz und Druck-PDF bleiben bewusst nicht blockierend.

Nicht geändert:

- keine Preislogik
- keine Persistenz
- keine echte Ausschieß-Berechnung
- keine große Designänderung
- keine Änderung an Auftragstasche oder Auftragsübersicht


## Sprint 46.20 – Kalkulationsmaske: Reiter produktiv verdichten

Status: umgesetzt.

Ziel war keine neue Preislogik und keine große Designänderung, sondern eine produktivere und stabilere Reitermaske nach Sichtprüfung der aktuellen Screens.

Umgesetzt:

- Feldlabel und Pflicht-/Optional-/Später-Badges technisch getrennt, damit Badges nicht mehr in Eingabewerte hineinlaufen.
- Labelspalte in MIS-Feldern leicht verbreitert und robuster gegen lange Bezeichnungen gemacht.
- Produkt-/Farbigkeitsblock nutzt wieder die produktive Vier-Spalten-Logik.
- Statusbar und Ergebnisbereich bekommen mehr Sicherheitsabstand zur fixen Bottom-Navigation.
- Weiterverarbeitungs-Matrix bleibt tabellarisch, erhält aber mehr horizontale Arbeitsbreite und überdeckt die Bottom-Navigation nicht mehr.
- Keine neuen Fachfelder, keine neue Preislogik, keine grundlegende Layoutänderung.

Fachliche Bewertung nach Sprint 46.20:

- Die sechs Hauptreiter bleiben stabil.
- Pflichtfelder bleiben bewusst reduziert.
- „Später“-Felder sind weiterhin sichtbar, aber nicht blockierend.
- Nächster sinnvoller Schritt: Reiter Papier & Druck fachlich weiter entlasten, zum Beispiel Material/Bogen/Bestand klarer trennen, ohne Felder hinzuzufügen.

## Sprint 46.21 – Kalkulationsmaske: Lesbarkeit und Weiterverarbeitung prüfen

Status: umgesetzt.

Auslöser waren die Sichtprüfung nach Sprint 46.20 und der Hinweis, dass einzelne Feldbezeichnungen wie `Bestellnummer` nicht vollständig lesbar waren und die Aktiv-Spalte im Reiter `Weiterverarbeitung` zu viel Tabellenbreite blockiert hat.

Umgesetzt:

- **Feldlesbarkeit verbessert**
  - Die Labelspalte der MIS-Felder wurde verbreitert.
  - Lange Labels werden nicht mehr per Ellipse abgeschnitten, sondern dürfen sauber umbrechen.
  - Pflicht-/Optional-/Später-Badges bleiben rechts im Labelbereich und laufen nicht in Werte hinein.
  - Eingabewerte behalten weiterhin die kompakte Ein-Zeilen-Logik.

- **Weiterverarbeitung produktiver gemacht**
  - Die Aktiv-/Haken-Spalte wurde auf eine schmale Kontrollspalte reduziert.
  - Die dadurch frei werdende Breite geht in Leistungsnamen, Parameter und Produktionsangaben.
  - Die Tabelle nutzt feste Spaltenbreiten, damit die Haken-Spalte nicht mehr unkontrolliert wächst.

- **Fachlicher Feldbestand Weiterverarbeitung ergänzt**
  - Ergänzt wurden typische Leistungen, die für Druckerei-/Digitaldruck-Workflows fehlen würden:
    - `Zusammentragen / Sortieren`
    - `Ableimen / Blockleimung`
    - `Spiral- / Drahtkammbindung`
    - `Einlegen / Beilegen`
    - `Handarbeiten / Konfektionieren`
    - `Kuvertieren / Mailing`
  - Bestehende Leistungen wie Schneiden, Falzen, Rillen/Nuten, Heften, Klebebindung, Fadenheftung, Bohren/Lochen/Ösen, Laminieren/Kaschieren, Stanzen/Plotten, Ecken abrunden, Perforieren, Nummerieren und Verpacken/Versand bleiben erhalten.

Nicht geändert:

- keine neue Preislogik
- keine automatische Zeitberechnung
- keine Maschinen-/Tariflogik
- keine Persistenz
- keine große Designänderung

## Sprint 46.22 – Kalkulationsmaske: Zeilenhöhe minimal entspannen

Status: umgesetzt.

Auslöser war die Sichtprüfung nach Sprint 46.21: Die Maske war fachlich vollständiger und lesbarer, aber die Feldzeilen waren für die Pflicht-/Optional-/Später-Badges noch einen Tick zu knapp.

Umgesetzt:

- Die Feldzeilen der MIS-Eingabemaske wurden minimal erhöht.
- Eingabefelder und Selects haben jetzt etwas mehr Höhe, ohne die Reitermaske wieder großflächig zu machen.
- Labelbereiche haben mehr vertikale Luft, damit lange Begriffe und Badges sauberer sitzen.
- Badges werden vertikal mittiger ausgerichtet.
- Die Weiterverarbeitungstabelle erhält ebenfalls minimal mehr Zeilenhöhe, damit Checkboxen und Parameter ruhiger wirken.
- Die Aktiv-/Haken-Spalte bleibt weiterhin schmal; die zusätzliche Höhe ersetzt keine Breite.

Nicht geändert:

- keine neuen Fachfelder
- keine Änderung an der Pflichtfeldlogik
- keine Preislogik
- keine Persistenz
- keine große Designänderung

## Sprint 46.23 – Kalkulationsmaske: Lesbarkeit final prüfen

Status: umgesetzt.

Ziel war ein finaler visueller Check der sechs Kalkulationsreiter nach Sprint 46.22. Der Fokus lag auf Lesbarkeit, stabiler Badge-Position und einer fachlich runden Weiterverarbeitungs-Matrix. Es wurde keine Preislogik ergänzt und kein größerer Designwechsel vorgenommen.

Umgesetzt:

- **MIS-Felder lesbarer gemacht**
  - Die Labelspalte wurde final auf eine produktivere Breite gebracht.
  - Lange Bezeichnungen wie `Bestellnummer`, `Kalkulationsnummer`, `Sicherheitsabstand`, `Papierbestellung` und `Weiterverarbeitung` haben mehr Platz.
  - Badges bleiben kompakt rechts im Labelbereich und nehmen dem eigentlichen Label weniger Raum weg.
  - Eingabewerte behalten die kompakte Ein-Zeilen-Logik.

- **Weiterverarbeitung final geglättet**
  - Die Aktiv-/Haken-Spalte wurde nochmals schmaler und explizit fixiert.
  - Die freie Breite wird stärker für Leistungsbezeichnung, Parameter und Produktionsangaben genutzt.
  - Die Reihenfolge der Leistungen wurde stärker am Produktionsablauf ausgerichtet: Schneiden/Falzen/Rillen/Perforieren/Lochen/Formgebung/Veredelung, danach Zusammentragen/Binden/Leimen/Sonderarbeiten/Mailing/Versand.
  - Ergänzt wurde `Banderolieren / Bündeln`, weil dies in der Praxis zwischen Weiterverarbeitung und Verpackung häufig separat kalkulationsrelevant ist.
  - `Ableimen / Blockleimung` und `Handarbeiten / Konfektionieren` bleiben ausdrücklich als eigene Leistungen enthalten.

Nicht geändert:

- keine neue Preislogik
- keine automatische Zeitberechnung
- keine Maschinen-/Tariflogik
- keine Persistenz
- keine neue Pflichtfeldlogik
- keine große Designänderung

## Sprint 46.24 – Kalkulationsmaske: fachliche Plausibilitätsgruppen vorbereiten

Status: umgesetzt.

Ziel war, die bestehende Kalkulationsmaske intern fachlich besser für spätere Kalkulationslogik vorzubereiten, ohne jetzt Preislogik, Tariflogik oder einen sichtbaren Layout-Umbau einzubauen.

Umgesetzt:

- **Fachliche Plausibilitätsgruppen eingeführt**
  - Die vorhandenen Felder werden jetzt in interne Gruppen eingeordnet:
    - `Produktdaten`
    - `Druckdaten`
    - `Materialverbrauch`
    - `Maschinenzeit`
    - `Weiterverarbeitung`
    - `Fremdkosten`
    - `Preisabschluss`
  - Diese Gruppen bilden später die Grundlage für Prüfungen wie „Produktdaten vollständig“, „Materialverbrauch plausibel“, „Maschinenzeit berechenbar“ oder „Preisabschluss prüfbar“.

- **Kompakte Übersicht im Reiter Preise & Ergebnis ergänzt**
  - Der Abschlussreiter zeigt jetzt eine kompakte Übersicht der Plausibilitätsgruppen.
  - Pro Gruppe wird angezeigt, wie viele zugeordnete Felder bereits fachlich vorbereitet sind.
  - Die Gruppe `Weiterverarbeitung` zeigt zusätzlich die Anzahl aktiver Weiterverarbeitungsleistungen.
  - `Fremdkosten` wird bei reiner Eigenproduktion optisch zurückgenommen.

- **Keine Berechnungslogik eingebaut**
  - Die Gruppierung ist bewusst nur eine fachliche Strukturierung.
  - Es werden keine Preise berechnet.
  - Es werden keine Maschinenzeiten kalkuliert.
  - Es werden keine Materialverbräuche automatisch verändert.
  - Es gibt keine neue Pflichtfeldlogik.

Nutzen für die nächsten Schritte:

- Die Maske ist jetzt besser vorbereitet, um später echte Logik gezielt je Fachgruppe einzubauen.
- Produktdaten, Druckdaten, Materialverbrauch, Maschinenzeit, Weiterverarbeitung, Fremdkosten und Preisabschluss können künftig getrennt geprüft und berechnet werden.
- Die spätere Kalkulationsengine kann dadurch Schritt für Schritt entstehen, ohne die sechs Reiter erneut umzubauen.

Nicht geändert:

- keine neuen Fachfelder
- keine neue Preislogik
- keine automatische Zeitberechnung
- keine Maschinen-/Tariflogik
- keine Persistenz
- keine große Designänderung

## Strategische Leitlinie – Sprint 40: Auftragstasche als Herzstück etablieren

Status: dokumentiert und als Produktgrundsatz für die nächsten Sprints verankert.

### Zentrale Produktentscheidung

PrintPilot wird nicht als klassische ERP-Software mit angehängtem Produktionsmodul verstanden, sondern als Produktionsplattform für Druckereien.

Das Herzstück von PrintPilot ist die Auftragstasche.

### Core Principle

Alles, was für die Produktion relevant ist, muss in der Auftragstasche sichtbar sein.

Leitfrage für jede neue Funktion:

> Wo erscheint diese Information in der Auftragstasche?

### Fachlicher Workflow

```text
Kalkulation
→ Auftrag
→ Auftragstasche
→ Produktion
→ Versand
→ Rechnung
```

### Wichtigste Bereiche

1. **Auftragsübersicht**
   - Einstiegspunkt in laufende Aufträge.

2. **Auftragstasche**
   - Zentraler Arbeitsplatz für Produktion, Arbeitsvorbereitung, Weiterverarbeitung und Versand.

3. **Kalkulation**
   - Erzeugt die produktionsrelevanten Grundlagen.

### Die Auftragstasche bündelt

- Kunde
- Produkt
- Auflage
- Format
- Material
- Maschinen
- Druckdatenstatus
- Freigabe
- Weiterverarbeitung
- Ausschießdaten / Nutzenplan
- Versand
- Notizen
- Historie
- Fotos
- Dateien
- Produktionsstatus
- QR-Code

### Geplante Auftragstaschen-Ansichten

1. Desktop-Ansicht
2. Mobile-/PWA-Ansicht
3. Druckbare PDF-Auftragstasche

### Prioritäten für nächste Sprints

1. Vision in `docs/PRINTPILOT_NEXT_UI.md` dokumentieren.
2. Auftragstasche weiter perfektionieren.
3. PDF-Auftragstasche planen und vorbereiten.
4. Vollständige Produktionsinformationen prüfen.
5. Weiterverarbeitung vollständig integrieren, inklusive:
   - Schneiden
   - Falzen
   - Rillen
   - Heften
   - Ringösen
   - Ableimen
   - Bohren
   - Perforieren
   - Nummerieren
   - Kuvertieren
   - Handarbeiten
   - Verpacken
6. QR-Code-Workflow vorbereiten.
7. Ausschießmodul vor Lettershop priorisieren.

### Strategische Reihenfolge

1. Kalkulation
2. Auftragsübersicht
3. Auftragstasche
4. Material / Maschinen / Weiterverarbeitung
5. PDF-Auftragstasche
6. QR-Code-Workflow
7. Ausschießen / Druckbogen-Erzeugung
8. Mobile PWA
9. Produktionsplanung
10. Versand
11. Lettershop
12. Auswertungen / Controlling

### Modul-Grundsatz

Neue Module existieren nicht isoliert. Sie liefern Informationen in die Auftragstasche.

Beispiele:

- Materialverwaltung → Materialbereich der Auftragstasche
- Ausschießen → Nutzenplan / Druckbogenbereich der Auftragstasche
- Weiterverarbeitung → Produktionsschritte der Auftragstasche
- Versand → Versandbereich der Auftragstasche
- Lettershop → Mailingbereich der Auftragstasche

### Langfristige Vision

Ein Mitarbeiter soll im Alltag hauptsächlich mit zwei Bereichen arbeiten:

```text
Auftragsübersicht → Auftragstasche
```

Die Auftragstasche wird der digitale Laufzettel, Produktionsauftrag und zentrale Informationspunkt von PrintPilot.

---

## Sprint 46.26 – Auftragstasche als Produktionskern sichtbar machen

### Ziel

Nach der strategischen Rückverankerung aus Sprint 40 wurde die Auftragstasche in der Oberfläche weiter als Herzstück von PrintPilot sichtbar gemacht.

PrintPilot bleibt damit klar positioniert als Produktionsplattform für Druckereien. Die Auftragstasche ist nicht nur Detailansicht eines Auftrags, sondern der zentrale Produktionskern, in dem die Informationen aus Kalkulation, Auftrag, Druckdaten, Produktion, Weiterverarbeitung und Versand zusammenlaufen.

### Umsetzung

In der Desktop-Auftragstasche wurde eine kompakte Produktionskern-Zeile ergänzt.

Diese zeigt auf einen Blick:

- Kalkulation / Produktionsgrundlage
- Auftrag / Kunde / Liefertermin
- Druckdaten / Preflight / Beschnittstatus
- Produktion / Maschine / aktueller Produktionsstatus
- Weiterverarbeitung / aktive Produktionsschritte
- Versand / Übergabe aus Produktion an Versand

### Fachlicher Nutzen

Die neue Zeile macht die zentrale Leitfrage sichtbar:

```text
Wo erscheint diese Information in der Auftragstasche?
```

Sie verbindet die bisher getrennten Bereiche stärker:

```text
Kalkulation → Auftrag → Auftragstasche → Produktion → Versand
```

Damit wird die Auftragstasche im Alltag schneller erfassbar. Ein Mitarbeiter sieht sofort, welche produktionsrelevanten Informationen bereits vorhanden sind und wo der Auftrag im Produktionsfluss steht.

### Grenzen dieses Sprints

Nicht umgesetzt wurden:

- keine neue Kalkulationslogik
- keine neue Preislogik
- keine echte Maschinenzeitberechnung
- keine Persistenzänderung
- keine PDF-Auftragstasche
- keine QR-Code-Aktion

### Betroffene Dateien

- `src/features/order-pocket/OrderPocketPage.tsx`
- `src/index.css`
- `docs/PRINTPILOT_NEXT_UI.md`

---

## Sprint 46.27 – Auftragstasche Produktionsinformationen vollständig prüfen

### Ziel

Die Auftragstasche wurde fachlich darauf geprüft, ob alle produktionsrelevanten Informationen aus Kalkulation, Auftrag, Druckdaten, Produktion, Weiterverarbeitung und Versand sichtbar oder zumindest als vorbereiteter Bereich erkennbar sind.

Wichtig war dabei: Die Auftragstasche bleibt das Herzstück von PrintPilot. Neue Informationen sollen nicht isoliert in Modulen verschwinden, sondern später gezielt in der Auftragstasche erscheinen.

### Umsetzung

In der Auftragstasche wurde ein kompakter Vollständigkeitscheck ergänzt.

Die neue Prüfzone zeigt folgende Informationsgruppen:

- Kunde & Auftrag
- Produktdaten
- Material
- Druck
- Nutzenplan
- Weiterverarbeitung
- Versand

Pro Gruppe werden die wichtigsten Produktionsinformationen direkt angezeigt. Fehlende oder später aus anderen Modulen kommende Informationen werden bewusst als `prüfen` oder `später` sichtbar gemacht, statt still zu fehlen.

### Fachlicher Nutzen

Die Auftragstasche beantwortet jetzt besser die zentrale Frage:

```text
Sind alle für die Produktion relevanten Informationen sichtbar?
```

Besonders wichtig:

- Kundendaten und Ansprechpartner sind sichtbar.
- Produkt, Format, Seiten, Auflage und Farbigkeiten sind sichtbar.
- Papier, Rohformat, Bogenformat und Zuschuss sind sichtbar.
- Maschine, Verfahren, Datenstatus, Freigabe und Beschnittstatus sind sichtbar.
- Nutzenplan, Anordnung, Beschnitt und spätere Druckbogen-PDF sind vorbereitet.
- Aktive Weiterverarbeitungsschritte werden sichtbar zusammengefasst.
- Versandtermin, Lieferinfo, Adresse und Verpackungshinweis sind sichtbar.

### Weiterverarbeitung

Die Auftragstasche zeigt weiterhin nur die konkret aktiven oder relevanten Schritte des aktuellen Auftrags. Zusätzlich wurde ein kompakter Leistungskatalog ergänzt, damit erkennbar ist, welche Weiterverarbeitungsarten grundsätzlich vorbereitet sind.

Vorbereiteter Katalog:

- Schneiden
- Falzen
- Rillen
- Heften
- Ringösen
- Ableimen
- Bohren
- Perforieren
- Nummerieren
- Kuvertieren
- Handarbeiten
- Verpacken

Aktive Leistungen werden im Katalog dezent hervorgehoben. Dadurch bleibt der aktuelle Auftrag schlank, aber die fachliche Vollständigkeit der Weiterverarbeitung ist sichtbar.

### Bewusste Grenzen dieses Sprints

Nicht umgesetzt wurden:

- keine neue Preislogik
- keine neue Kalkulationslogik
- keine echte Materialbestellung
- keine echte Versandlogik
- keine Persistenzänderung
- keine PDF-Auftragstasche
- keine QR-Code-Aktion

### Betroffene Dateien

- `src/features/order-pocket/OrderPocketPage.tsx`
- `src/index.css`
- `docs/PRINTPILOT_NEXT_UI.md`

## Sprint 46.28 – PDF-Auftragstasche vorbereiten

Ziel dieses Sprints war die Vorbereitung einer druckbaren Auftragstaschen-Ansicht, ohne bereits eine neue PDF-Engine, Persistenz oder Preis-/Kalkulationslogik einzubauen.

Umgesetzt wurde eine separate A4-/Print-Struktur innerhalb der Auftragstasche. Die Bildschirmansicht bleibt unverändert nutzbar, zusätzlich gibt es nun eine druckbare Laufzettel-Ansicht für den Browser-Druckdialog bzw. „Als PDF speichern“.

### Inhalt der druckbaren Auftragstasche

Die druckbare Auftragstasche ist in produktionsgerechter Reihenfolge aufgebaut:

1. Kopfbereich mit PrintPilot, Auftragsnummer, Produkt, Kunde und QR-Code
2. Kompakte Zusammenfassung: Kunde, Termin, Produktionsstatus und Checklistenstand
3. Produktionsdaten: Produkt, Auflage, Format, Seiten, Farbigkeit, Material, Rohbogen und Maschine
4. Druckdaten / Freigabe: Datenstatus, Freigabe, Datei, Preflight, Beschnitt und Profil
5. Nutzenplan / Druckbogen: Bogenformat, Nutzen, Anordnung, Beschnitt, Zuschuss und späteres Druckbogen-PDF
6. Weiterverarbeitung: aktive Schritte, Leistungen und kompletter vorbereiteter Leistungskatalog
7. Versand / Verpackung: Termin, Lieferart, Adresse, Verpackung und spätere Teillieferung
8. Notizen / Kontrolle: Produktionshinweis, Operator, Status und QR-Code-Bezug
9. Signatur-/Kontrollzeilen für Druck, Weiterverarbeitung und Versand

### Technische Umsetzung

- Neue Print-Komponente in `OrderPocketPage.tsx`: `PrintOrderPocketSheet`
- Neue Datenaufbereitung: `getPrintableSheetSections`
- Print-Button in der Auftragstasche: „Druckbare Auftragstasche / PDF vorbereiten“
- Print-CSS über `@media print`
- Die normale Bildschirmansicht wird beim Drucken ausgeblendet
- Die druckbare Auftragstasche wird nur im Druck/PDF sichtbar

### Strategische Einordnung

Dieser Sprint bereitet die PDF-Auftragstasche fachlich und strukturell vor. Eine spätere echte PDF-Erzeugung kann darauf aufbauen, zum Beispiel über eine dedizierte PDF-Route, HTML-to-PDF, serverseitige PDF-Generierung oder eine spätere native Exportfunktion.

Wichtig: Die PDF-Auftragstasche bleibt Teil des zentralen PrintPilot-Prinzips: Alle produktionsrelevanten Informationen müssen aus der Auftragstasche heraus sichtbar und ausgabefähig sein.

## Sprint 46.29 – PDF-Auftragstasche auf DIN A4 Hochformat korrigieren

Ziel dieses Sprints war die Korrektur der ersten Browser-PDF-Ausgabe der Auftragstasche. In der erzeugten PDF war die erste Seite leer und die eigentliche Auftragstasche begann erst auf Seite 2. Außerdem musste die Druckansicht eindeutig auf DIN A4 im Hochformat ausgelegt werden.

### Korrigiert

- Druckausgabe startet direkt auf Seite 1.
- `@page` ist explizit auf `210mm × 297mm` gesetzt.
- Die druckbare Auftragstasche wird im Print-Modus absolut am oberen linken Seitenanfang positioniert.
- Sichtbare Bildschirmbereiche bleiben im Druck ausgeblendet, verursachen aber keine leere Vorschaltseite mehr.
- Druckbreite ist auf die nutzbare A4-Breite abgestimmt.
- QR-Code bleibt sichtbar im Kopfbereich.
- Lange Weiterverarbeitungstexte werden nicht mehr abgeschnitten.
- Aktive Weiterverarbeitungsschritte werden in der Druckansicht zeilenweise gesetzt.
- Katalog, Lieferadresse und andere lange Werte dürfen sauber umbrechen.
- Signaturbereich bleibt am Ende der A4-Auftragstasche erhalten.

### Bewusste Grenzen

- keine echte PDF-Engine
- keine neue Preislogik
- keine neue Kalkulationslogik
- keine Persistenzänderung
- keine neue Auftragstaschen-Informationslogik

### Betroffene Dateien

- `src/features/order-pocket/OrderPocketPage.tsx`
- `src/index.css`
- `docs/PRINTPILOT_NEXT_UI.md`

## Sprint 46.30 – PDF-Auftragstasche strikt einseitig machen

Ziel dieses Sprints war die verbindliche Korrektur der druckbaren Auftragstasche: Die Ausgabe darf nicht auf zwei Seiten laufen. Die Auftragstasche muss als DIN-A4-Hochformat-Laufzettel immer auf genau einer Seite ausgegeben werden – unabhängig davon, wie viel Inhalt in der vorbereiteten Druckansicht steht.

### Korrigiert

- Print-Layout ist strikt auf eine DIN-A4-Hochformat-Seite begrenzt.
- `@page` nutzt `A4 portrait` mit 6 mm Rand.
- HTML, Body und Root werden im Print-Modus auf eine feste A4-Seite begrenzt.
- Die eigentliche Auftragstasche wird als fixer 198 × 285 mm Druckbereich positioniert.
- Überlauf wird im Print-Modus bewusst abgeschnitten, damit keine zweite Seite entsteht.
- Druckinhalt wurde deutlich verdichtet:
  - kompakterer Kopfbereich
  - kleinerer QR-Code, aber weiterhin sichtbar
  - kompaktere Zusammenfassung
  - dreispaltige Informationsblöcke
  - kleinere Tabellenzeilen
  - fest am Seitenende positionierte Prüf-/Signaturzeilen
- Lange Werte dürfen umbrechen, erzeugen aber keinen Seitenumbruch mehr.

### Fachlicher Grundsatz

Die PDF-Auftragstasche ist ein Produktionslaufzettel. Sie muss druckbar, scanbar und eindeutig sein. Für die Produktion ist eine konsistente Ein-Seiten-Ausgabe wichtiger als ein vollständiger mehrseitiger Bericht. Falls Inhalte später zu umfangreich werden, müssen sie priorisiert, zusammengefasst oder in zusätzliche Detailansichten ausgelagert werden – die Produktions-Auftragstasche selbst bleibt eine Seite.

### Bewusste Grenzen

- keine echte PDF-Engine
- keine neue Preislogik
- keine neue Kalkulationslogik
- keine Persistenzänderung
- keine neue Datenlogik

### Betroffene Dateien

- `src/index.css`
- `docs/PRINTPILOT_NEXT_UI.md`

## Sprint 46.31 – Auftragsdetails und Auftragstasche begrifflich trennen

Ziel dieses Sprints war die fachliche Begriffsklärung: Die bisherige Bildschirmseite wurde zwar als Auftragstasche bezeichnet, verhält sich aber eigentlich wie eine digitale Produktions- und Auftragsdetailansicht. Die eigentliche Auftragstasche ist im Druckerei-Alltag der bearbeitbare Laufzettel, der vor dem Drucken noch kontrolliert, ergänzt und angepasst werden kann.

### Produktentscheidung

- **Auftragsdetails** sind die digitale Bildschirm-/Produktionsansicht.
- **Auftragstasche** ist der editierbare und druckbare Laufzettel.
- Der PDF-/Druckbutton gehört fachlich zur Auftragstasche, nicht zur allgemeinen Bildschirmansicht.
- Auftragsdaten und Drucktaschen-Zusatzdaten werden bewusst getrennt.

### Umgesetzt

- Sichtbarer Haupttitel der bisherigen Seite auf **Auftragsdetails** geändert.
- Neuer Ansichtswechsel innerhalb der geöffneten Auftragsseite:
  - **Auftragsdetails**
  - **Auftragstasche**
- Die bisherige digitale Ansicht bleibt unter **Auftragsdetails** erhalten.
- Neuer Bereich **Auftragstasche bearbeiten** ergänzt.
- Der Druck-/PDF-Button wurde in den Auftragstaschen-Bereich verschoben.
- Die Auftragstasche bekommt editierbare Felder für den Drucklaufzettel:
  - Korrektur bis
  - Bestellnummer / Kundenauftrag
  - Versandart
  - Teillieferungen
  - besondere Hinweise
  - Weiterverarbeitung / Handarbeit
  - Lieferadresse / Lieferhinweis
  - Fremdarbeiten / Lieferant
  - Muster / Belege
  - Rechnungskontrolle
  - Dokumente / Ablage
  - Kontrollhinweis
- Die bearbeiteten Felder fließen direkt in die druckbare DIN-A4-Auftragstasche ein.
- Die Daten sind aktuell lokaler UI-State und noch nicht persistent.

### Bewusste Grenzen

- keine Persistenzänderung
- keine Datenbank-/Store-Änderung
- keine Preislogik
- keine Kalkulationslogik
- keine neue PDF-Engine
- keine Änderung an der einseitigen A4-Druckbegrenzung

### Fachlicher Nutzen

Die Trennung entspricht besser dem Druckerei-Alltag:

- Auftragsdetails = digitale Arbeitsansicht für Produktion und Auftragssteuerung
- Auftragstasche = editierbarer Laufzettel für Druck, Weiterverarbeitung, Versand und Kontrolle

Damit kann PrintPilot später sauber unterscheiden, welche Informationen aus Kalkulation und Auftrag stammen und welche Zusatzangaben nur für den Ausdruck der Auftragstasche gelten.

### Betroffene Dateien

- `src/features/order-pocket/OrderPocketPage.tsx`
- `src/index.css`
- `docs/PRINTPILOT_NEXT_UI.md`

## Sprint 46.32 – Auftragstasche als echte A4-Laufzettel-Vorlage

Sprint 46.32 trennt die Auftragstasche visuell stärker von einer normalen Eingabemaske. Die Auftragstasche wird als druckbarer Laufzettel-Editor verstanden: links eine A4-nahe Vorschau, rechts kompakte Bearbeitungsgruppen für die Angaben, die vor dem Ausdruck ergänzt werden.

Umgesetzt:

- Auftragstaschen-Reiter als Laufzettel-Editor neu strukturiert.
- A4-Vorschau ergänzt, damit die Drucktasche nicht mehr wie eine normale Formularmaske wirkt.
- Bearbeitungsgruppen neu geordnet:
  - Kopf & Termine
  - Hinweise & Weiterverarbeitung
  - Versand & Fremdarbeit
  - Kontrolle & Ablage
- Druckansicht strukturell näher an klassischen Druckerei-Auftragstaschen ausgerichtet:
  - fester Tabellen-/Rastercharakter
  - Auftrag, Kunde, Rechnung, Kontrolle und QR-Code im Kopf-/Adressbereich
  - separate Zonen für besondere Hinweise und Auftragsbeschreibung
  - tabellarische Produkt-, Material-, Druckbogen- und Versanddaten
  - Checkboxen für Papier, Versandarten, Auftragstyp, Daten, Dokumente und Kontrollpunkte
  - Weiterverarbeitung als echte Arbeits-/Checkliste statt Fließtext-Katalog
  - Signaturzeilen am Seitenende
- DIN-A4-Hochformat bleibt strikt einseitig.
- Bei zu viel Inhalt wird weiterhin priorisiert und verdichtet; die Auftragstasche erzeugt keine zweite Seite.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.

Fachliche Entscheidung:

Die Auftragstasche ist nicht mehr nur ein PDF-Auszug aus der digitalen Produktionsansicht. Sie ist ein eigener Laufzettel-Typ mit editierbaren Drucktaschen-Daten. Auftragsdetails bleiben die digitale Arbeitsansicht, Auftragstasche bleibt der druckbare Produktionsauftrag.

## Sprint 46.33 – Auftragstasche vollständig editierbar vorbereiten

Status: umgesetzt.

Ziel dieses Sprints war die fachliche Korrektur, dass die Auftragstasche nicht nur ein automatisch erzeugter Report ist. Die Auftragstasche ist ein bearbeitbarer Produktionszettel. Deshalb müssen die sichtbaren Drucktaschenwerte vor dem Ausdruck grundsätzlich überschreibbar sein, ohne die ursprünglichen Auftragsdaten aus Kalkulation, Auftrag, Material, Maschine oder Weiterverarbeitung zu verändern.

Umgesetzt:

- Eigenes editierbares Drucktaschenmodell `PrintPocketDraft` deutlich erweitert.
- Alle sichtbaren Bereiche der DIN-A4-Auftragstasche werden aus den editierbaren Drucktaschenwerten gespeist.
- Auftragstaschen-Reiter zeigt jetzt nicht nur Zusatzfelder, sondern einen vollständigen Laufzettel-Editor.
- Bearbeitbar vorbereitet wurden:
  - Auftrag-Nr., Auftragsbezeichnung, Kurzzeile, Liefertermin und Termin-Zusatz
  - Kunde, Ansprechpartner, Telefon, Kundenadresse, Rechnungsempfänger und Rechnungsadresse
  - Korrektur bis, Checkliste, Status und besondere Hinweise
  - Auftragsbeschreibung
  - Auflage, Endformat, offenes Format, Umfang, Bogenaufteilung, Vorder-/Rückseitenfarben und Druckart
  - Papier, Rohbogenformat, Druckformat, Nettobogen, Zuschuss und Bruttobogen
  - Papierstatus-Checkboxen
  - Lieferadresse, Teillieferungen, Gesamtmenge, Versandart, Verpackung und Teillieferungshinweis
  - Versand-Checkboxen
  - Weiterverarbeitungs-Checkboxen für Schneiden, Falzen, Rillen, Heften, Ringösen, Ableimen, Bohren, Perforieren, Nummerieren, Kuvertieren, Handarbeiten und Verpacken
  - Arbeitsanweisung und Zusatzhinweis für Weiterverarbeitung
  - Neuauftrag/Nachdruck/Daten-Checkboxen
  - Datenstatus, Freigabe, Datei, Fremdarbeit, Muster, Dokumente und Rechnungskontrolle
  - Ablage-/Dokument-Checkboxen
  - Datum, Operator und Signaturbezeichnungen
- A4-Vorschau verwendet dieselben editierbaren Werte wie die Druckausgabe.
- Die Trennung bleibt erhalten: Auftragsdaten sind Quellwerte, Drucktaschenwerte sind die gedruckten Werte.
- Keine Persistenzänderung.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine neue PDF-Engine.

Build-Prüfung:

```bash
npm run build
```

Ergebnis: erfolgreich.

## Sprint 46.34 – Auftragstasche A4-Fläche korrekt ausnutzen

Status: umgesetzt.

Ziel dieses Sprints war es, die druckbare Auftragstasche nicht mehr als kleinen Block oben links auf dem DIN-A4-Blatt auszugeben, sondern die nutzbare A4-Hochformatfläche sauber auszunutzen.

Umgesetzt:

- Print-Layout bleibt strikt auf eine DIN-A4-Hochformat-Seite begrenzt.
- Globale Bildschirmbreiten wie `body { min-width: 1280px; }` werden im Print-Modus neutralisiert.
- Print-relevante Wrapper (`html`, `body`, `#root`, AppShell, Route-Shell und Auftragstaschen-Container) werden im Druckmodus auf A4 begrenzt.
- Toolbar, Bottom-Navigation und Bildschirmbereiche werden im Print-Modus konsequent ausgeblendet.
- Die Auftragstasche nutzt wieder die volle A4-Nutzfläche von 200 × 287 mm bei 5 mm Seitenrand.
- Schriftgrößen im Drucklayout wurden leicht angehoben, damit die Produktionsinformationen besser lesbar sind.
- QR-Code bleibt oben rechts im Kopfbereich sichtbar.
- Tabellenraster und Einseitigkeit bleiben erhalten.

Nicht geändert:

- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.
- Keine neue PDF-Engine.


## Sprint 46.35 – Auftragstasche Kopf und Überläufe korrigieren

Ziel: Die einseitige DIN-A4-Auftragstasche bleibt strikt einseitig, nutzt die A4-Fläche weiter aus, vermeidet aber abgeschnittene Pflichtinformationen und unruhige Überläufe.

Umgesetzt:

- Auftrag-Nr. im Kopfbereich wird wieder vollständig lesbar gehalten.
- Kopfspalten wurden ruhiger verteilt: mehr Breite für Auftrag-Nr., etwas kleinerer QR-Code.
- QR-Code bleibt oben rechts sichtbar, drückt aber den Kopfbereich weniger zusammen.
- Fremdarbeit-/Kontrollbereich wurde vertikal entlastet.
- Footer-/Kontrollzeilen wurden kompakter gesetzt, damit Muster, Dokumente und Rechnungskontrolle nicht in die nächste Zone laufen.
- Untere Dokumenten-/Kontrollzeile wurde als festes Raster stabilisiert.
- Signaturbereich bleibt am Seitenende erhalten.
- Keine neuen Fachfelder.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.

Hinweis: Lange Texte werden im Print weiterhin bewusst einzeilig begrenzt oder mit Auslassung gekürzt, damit die Auftragstasche immer auf einer DIN-A4-Seite bleibt.

## Sprint 46.36 – Auftragstasche Printlayout sauberziehen

Status: umgesetzt.

Ziel dieses Sprints war kein konzeptioneller Umbau der Auftragstasche, sondern ein sauberer Printlayout-Feinschliff der einseitigen DIN-A4-Auftragstasche.

Umgesetzt:

- Rahmen und Zellen im Drucklayout wurden optisch beruhigt.
- Sehr fette Linien wurden reduziert.
- Tabellen-/Box-Rahmen wurden auf feinere Print-Linienstärken umgestellt.
- Footerbereich mit Auftrag/Daten und Fremdarbeit/Kontrolle wurde höher und stabiler gesetzt.
- Fremdarbeit-/Kontrollwerte werden nicht mehr in die Dokumentenzeile hineingedrückt.
- Dokumenten-/Kontrollzeile wurde als eigenes Raster stabilisiert.
- Signaturbereich wurde deutlich vergrößert.
- Die Linien für Druck, Weiterverarbeitung und Versand sitzen jetzt tiefer mit echter Schreibfläche darüber.
- DIN A4 Hochformat bleibt strikt einseitig.
- Keine neue Preislogik.
- Keine neue Kalkulationslogik.
- Keine Persistenzänderung.

## Sprint 46.37 – Auftragstasche modernisieren, aber produktiv halten

Status: umgesetzt.

Ziel dieses Sprints war ein behutsamer visueller Feinschliff der einseitigen DIN-A4-Auftragstasche. Die Tasche soll weiterhin wie ein produktiver Druckerei-Laufzettel funktionieren, aber weniger hart und weniger altbacken wirken.

Umgesetzt:

- Rahmen und Tabellenlinien wurden weiter reduziert und vereinheitlicht.
- Sehr dunkle Formularlinien wurden durch ruhigere, feinere Printlinien ersetzt.
- Abschnittsüberschriften erhalten eine dezente hellgraue Fläche.
- Kopfbereich wirkt etwas moderner und ruhiger, bleibt aber klar produktionsorientiert.
- QR-Code bleibt oben rechts sichtbar, sitzt aber in einer ruhigeren Scanbox.
- Zellen, Kontrollbereiche und Signaturzone bleiben in der einseitigen A4-Struktur erhalten.
- Signaturzeilen bleiben mit echter Schreibfläche am Seitenende.
- Die Auftragstasche bleibt vollständig editierbar und nutzt weiterhin die editierbaren Drucktaschenwerte.
- DIN A4 Hochformat bleibt strikt einseitig.
- Keine neue Preislogik.
- Keine neue Kalkulationslogik.
- Keine Persistenzänderung.

Design-Grundsatz:

Die Auftragstasche soll nicht wie eine moderne Marketing-PDF wirken, sondern wie ein sauberer, aktueller Produktionslaufzettel: klare Felder, schnelle Lesbarkeit, druckbar auf normalen Büro-/Laserdruckern, aber weniger harte schwarze Formularoptik.

## Sprint 46.38 – Auftragstasche Hybrid-Stil stabilisieren

Status: umgesetzt.

Ziel dieses Sprints war die visuelle Korrektur nach Sprint 46.37. Die Auftragstasche sollte nicht weiter in Richtung weiche Card-/Dashboard-PDF gehen, sondern als produktiver Druckerei-Laufzettel stabilisiert werden: moderner als Printy, aber kantiger und verbindlicher als die zu weiche Variante.

Umgesetzt:

- Rundungen der Drucktaschen-Boxen deutlich reduziert.
- Rahmen wieder etwas definierter gesetzt, aber nicht zurück zu sehr harten schwarzen Linien.
- Abschnittsüberschriften bleiben dezent grau hinterlegt, wirken aber technischer und weniger weich.
- Kopfbereich wurde kantiger und produktionsnäher stabilisiert.
- QR-Code bleibt oben rechts sichtbar und sitzt weiter in einer ruhigen Scanbox.
- Tabellen- und Formularlinien wurden als Hybrid aus klarer Produktion und moderner Lesbarkeit vereinheitlicht.
- Footerbereich mit Auftrag/Daten und Fremdarbeit/Kontrolle bleibt stabil.
- Checkbox-Zeile in Auftrag/Daten wurde zweispaltig stabilisiert, damit Einträge wie „Nachdruck mit Änderung“ und „Daten gestellt“ nicht zusammenkleben.
- Signaturzone bleibt mit echter Schreibfläche am Seitenende erhalten.
- DIN A4 Hochformat bleibt strikt einseitig.
- Alle Drucktaschenwerte bleiben vollständig editierbar.
- Keine neuen Fachfelder.
- Keine neue Preislogik.
- Keine neue Kalkulationslogik.
- Keine Persistenzänderung.

Design-Grundsatz:

Die Auftragstasche soll als moderne Produktions-Auftragstasche wirken: kantige Raster, klare Bereiche, feinere Linien als klassische Altsoftware, aber bewusst kein weicher Card-Look.

## Sprint 46.39 – Auftragstasche als moderne, lesbare Produktionsseite neu strukturieren

Status: umgesetzt.

Ziel dieses Sprints war kein weiterer kleiner CSS-Feinschliff, sondern eine sichtbar andere Drucktaschen-Richtung: modern, sachlich, fachlich korrekt und im Ausdruck besser lesbar. Der vorherige Stand war zwar einseitig und vollständiger, blieb aber durch viele kleinteilige Tabellenzellen und kleine Schrift zu schwer lesbar.

Umgesetzt:

- Gedruckte Auftragstasche wurde als moderne Produktionsseite neu strukturiert.
- Schriftgrößen im Ausdruck wurden deutlich angehoben.
- Kleinteilige Tabellenoptik wurde reduziert.
- Kopfbereich wurde neu priorisiert:
  - Auftrag-Nr.
  - Produktionsauftrag / Auftragsbezeichnung
  - Liefertermin
  - QR-Code
- Neue Topline mit Kunde, Status und Druckdaten.
- Besondere Hinweise und Auftragsbeschreibung wurden als klarer Hinweisblock zusammengeführt.
- Produktionsdaten stehen jetzt als zentrale, gut lesbare Kernbox im Mittelpunkt.
- Material/Druckbogen und Weiterverarbeitung wurden in zwei sachliche Produktionsblöcke getrennt.
- Weiterverarbeitung zeigt aktive Arbeitsschritte prominenter statt nur einen kleinen Checkbox-Teppich.
- Lieferung/Versand und Auftrag/Kontrolle wurden zu lesbaren Kontrollblöcken zusammengefasst.
- Dokumenten- und Kontrollzeile bleibt erhalten.
- Signaturbereich bleibt großzügig am Seitenende.
- Die Auftragstasche bleibt vollständig editierbar: Die Druckseite nutzt weiterhin die editierbaren Drucktaschenwerte.
- DIN A4 Hochformat bleibt strikt einseitig.
- Keine neuen Fachfelder.
- Keine neue Preislogik.
- Keine neue Kalkulationslogik.
- Keine Persistenzänderung.

Design-Grundsatz:

Die Drucktasche ist keine verkleinerte Datenmaske und kein Printy-Nachbau. Sie ist eine produktionsoptimierte Kurzfassung der editierbaren Auftragstaschenwerte: große Schrift, klare Prioritäten, sachliche Blöcke, QR-Code, Arbeitsanweisungen, Kontrollfelder und Signaturflächen auf genau einer DIN-A4-Seite.

## Sprint 46.40 – Auftragstasche Design-North-Star nach Mockup

Status: umgesetzt.

Ziel dieses Sprints war die klare Übernahme der neuen Designrichtung aus dem modernen Auftragstaschen-Mockup. Die Auftragstasche soll nicht mehr wie ein verkleinertes Formular wirken, sondern wie eine hochwertige, sachliche und trotzdem produktionsgerechte DIN-A4-Produktionsseite.

Umgesetzt:

- Das Mockup wurde als neuer Design-North-Star für Auftragstasche und spätere Kalkulation festgelegt.
- Gedruckte Auftragstasche wurde näher an die moderne Mockup-Struktur gebracht.
- Kopfbereich wurde neu aufgebaut:
  - PrintPilot-Auftragstasche als klare Marke
  - Auftrag-Nr.
  - Produkt
  - Liefertermin
  - Status
  - QR-/Scan-Bereich
- Produktionsdaten wurden als prominente Kernbox mit groß lesbaren Fakten umgesetzt.
- Sachliche Panel-Struktur ergänzt:
  - Kunde
  - Druckdaten
  - Material / Druckbogen
  - Weiterverarbeitung
  - Lieferung / Versand
  - Kontrolle
- Weiterverarbeitung wird als aktive Arbeitsliste mit Tags und Arbeitsanweisung dargestellt.
- Kontrollbereich enthält klare Prüfpunkte und weiterhin editierbare Kontrollwerte.
- Signaturbereich wurde an die moderne Mockup-Richtung angepasst:
  - Druck geprüft
  - Weiterverarbeitung geprüft
  - Versand geprüft
  - jeweils mit Datum-/Uhrzeit- und Name-/Unterschrift-Linie
- Schriftbild im Ausdruck bleibt deutlich größer und lesbarer als in der alten Formularvariante.
- Linien und Rahmen sind weiter reduziert, aber fachlich klar genug für Produktion.
- DIN A4 Hochformat bleibt strikt einseitig.
- Alle Werte kommen weiterhin aus dem editierbaren Drucktaschenmodell.
- Keine neue Preislogik.
- Keine neue Kalkulationslogik.
- Keine Persistenzänderung.

Design-Grundsatz:

PrintPilot soll als moderne, sachliche Produktionssoftware für Druckereien wirken. Die Auftragstasche ist der erste harte Referenzpunkt: keine Printy-Kopie, keine MIS-Formularwüste und kein verspieltes Dashboard, sondern ein gut lesbarer Produktions-Laufzettel mit klarer Hierarchie. Diese Richtung soll anschließend auf die Kalkulationsmaske übertragen werden.

## Sprint 46.41 – Auftragstasche konsequent am Mockup ausrichten

Status: umgesetzt

Ziel: Die druckbare Auftragstasche soll nicht nur ungefähr in Richtung des generierten Mockups gehen, sondern dessen sichtbare Designentscheidung übernehmen: gleiche klare Icon-Logik, Inter-/Segoe-ähnliche Typografie, ruhige blaue Akzente, Scanbox oben rechts, prominente Produktionsdaten und sehr gute Lesbarkeit.

Umgesetzt:

- PrintPilot-Auftragstasche weiter am modernen Mockup ausgerichtet.
- Eigenes Print-Iconset für die Auftragstasche ergänzt:
  - Stapel / Auflage
  - Format
  - CMYK-Farbigkeit
  - Papier / Material
  - Druckmaschine
  - Druckart / Rasterpunkte
  - Nutzenraster
  - Kunde
  - Druckdaten
  - Material / Druckbogen
  - Schere / Weiterverarbeitung
  - Lieferung / Versand
  - Kontrolle
- PrintPilot-Logo im Druckkopf durch eine klare blaue geometrische Marke ersetzt.
- Typografie im Printlayout auf Inter-/Segoe-UI-ähnliche Schriftführung gesetzt.
- Status im Kopfbereich wieder als blauer Status-Pill dargestellt.
- QR-/Scanbereich stärker an das Mockup angepasst.
- Produktionsdaten-Panel stärker an die Mockup-Struktur angeglichen.
- Panel-Überschriften und Icons einheitlicher und hochwertiger gesetzt.
- Linien, Abstände und Farbakzente weiter auf den modernen sachlichen Mockup-Stil abgestimmt.
- A4 Hochformat bleibt strikt einseitig.
- Alle Werte kommen weiterhin aus dem editierbaren Drucktaschenmodell.

Nicht umgesetzt:

- Keine echte PDF-Engine.
- Keine Persistenzänderung.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Kein externer Font-Download; die Schrift wird über einen robusten Inter-/System-Font-Stack gesetzt.

Buildprüfung:

```bash
npm run build
```

Ergebnis: erfolgreich.

## Sprint 46.42 – Auftragstasche Typografie und Schriftfarben präzisieren

Status: umgesetzt.

Auslöser: Die Auftragstasche war nach Sprint 46.41 strukturell deutlich näher am Mockup, Schriftbild und Schriftfarben wirkten aber noch zu schwer, zu schwarz und nicht hochwertig genug. Außerdem waren Kopfwerte wie Produkt/Liefertermin/Status noch zu eng.

Umsetzung:

- Print-Typografie stärker in Richtung Mockup geschärft.
- Font-Stack auf Inter-/Aptos-/Segoe-UI-ähnliche moderne Sans-Schriften gesetzt.
- Harte Schwarzwerte durch dunkles Navy ersetzt.
- Label- und Hilfstexte auf gedämpftes Blau-Grau umgestellt.
- Überschriften farblich ruhiger und hochwertiger gesetzt.
- Font-Weights deutlich reduziert:
  - weniger 900/ultrafett,
  - mehr 500–720 für ruhigeres professionelles Schriftbild.
- Kopfzeile neu austariert:
  - Auftrag-Nr. bleibt stark, aber nicht zu schwer,
  - Produkt und Liefertermin bekommen mehr saubere Breite,
  - Status-Pill bricht nicht mehr unsauber um.
- Produktionsdaten-Panel farblich näher an den Design-North-Star gebracht.
- Paneltexte und Werte weniger gedrückt und weniger schwarz gesetzt.
- Icons bleiben blau, aber Liniengewicht wurde etwas reduziert.
- Signatur- und Footertexte farblich zurückgenommen.

Bewusst nicht geändert:

- Keine neuen Fachfelder.
- Keine neue Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.
- A4 Hochformat bleibt strikt einseitig.
- Alle Auftragstaschenwerte bleiben aus dem editierbaren Drucktaschenmodell.

Nächster sinnvoller Schritt:

- Ausdruck/PDF erneut prüfen.
- Danach Auftragstaschen-Mockup-Stil auf die Kalkulationsmaske übertragen.

## Sprint 46.43 – Auftragstasche: Typografie, Farben, Schattierung und Rahmen feinjustieren

Ziel: Die moderne Auftragstasche näher an den Mockup-Charakter bringen, ohne die einseitige A4-Struktur oder die vollständige Editierbarkeit zu verändern.

Umgesetzt:

- Print-Typografie weiter in Richtung Mockup geschärft.
- Font-Reihenfolge für den Ausdruck geändert: `Aptos` vor `Inter`, danach Segoe/UI-Systemfonts.
- Schriftgewichte weiter reduziert, damit der Ausdruck weniger fett und weniger gedrückt wirkt.
- Harte Schwarz-/Navy-Werte weiter beruhigt.
- Haupttext, Labels und Hilfstexte farblich stärker getrennt.
- Produktionsdaten-Schattierung subtiler und hochwertiger gesetzt.
- Produktionsdaten-Rahmen und Innenraster feiner abgestimmt.
- Allgemeine Panel-Rahmen, Tabellenlinien und Trennlinien weiter harmonisiert.
- QR-/Scanbereich typografisch stabilisiert.
- Status-Pill farblich sauberer auf PrintPilot-Blau gesetzt.
- Keine neuen Fachfelder.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.

## Sprint 46.44 – Auftragstasche: Mockup-Finish für Schrift, Farbe, Schattierung und Rahmen

Status: umgesetzt.

Ziel: Die moderne Auftragstasche nach Sprint 46.43 noch näher an den Mockup-Charakter bringen. Fokus liegt ausschließlich auf den feinen visuellen Details im Ausdruck: Schriftart, Schriftgröße, Schriftfarbe, Produktionsdaten-Schattierung und Rahmen.

Umgesetzt:

- Print-Font-Stack auf `Aptos Display` / `Aptos` / `Inter` / `Segoe UI` geschärft.
- Überschriften, Kopfwerte und Signaturtitel nutzen einen Display-/Heading-orientierten Font-Stack.
- Schriftgewichte weiter feinjustiert:
  - große Kopfwerte bleiben kräftig,
  - Fließ- und Tabellenwerte wirken weniger schwer,
  - Labels bleiben klar, aber zurückhaltender.
- Schriftfarben weiter abgestimmt:
  - Werte in ruhigem Dunkel-Navy,
  - Labels in gedämpftem Blau-Grau,
  - Überschriften in hochwertigem Slate-/Navy-Blau,
  - Status und aktive Elemente in PrintPilot-Blau.
- Produktionsdaten-Panel verfeinert:
  - subtilere Schattierung,
  - leichterer Innenrahmen,
  - feinere Rasterlinien,
  - etwas ruhigere Fact-Kacheln.
- Rahmen harmonisiert:
  - Panels, Dokumentenzeile und Signaturbereich mit gleichmäßigeren Linien,
  - weniger harte Kanten,
  - weiterhin klar druckbar und sachlich.
- QR-/Scanbereich etwas feiner gesetzt.
- Icon-Linienstärken und Panel-Icons minimal beruhigt.
- Signaturbereich typografisch weiter an das Mockup angepasst.

Bewusst nicht geändert:

- Keine neuen Fachfelder.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.
- A4 Hochformat bleibt strikt einseitig.
- Alle Auftragstaschenwerte bleiben editierbar und kommen aus dem Drucktaschenmodell.

Nächster sinnvoller Schritt:

- Ausdruck visuell prüfen.
- Wenn die Auftragstasche passt: Design-North-Star auf die Kalkulationsmaske übertragen.

## Sprint 46.45 – Auftragstasche: Signaturbalken und Print-Finish-Tokens

Status: umgesetzt.

Auslöser: Im modernen Mockup wirkt der Signaturbereich durch den kleinen blauen Akzentbalken oberhalb der drei Prüfbereiche hochwertiger und klarer. Dieses Detail soll in die echte Auftragstasche übernommen werden, ohne die A4-Einseitigkeit oder das editierbare Drucktaschenmodell zu verändern.

Umgesetzt:

- Signaturbereich erhält pro Prüffeld einen feinen PrintPilot-Blau-Balken:
  - Druck geprüft,
  - Weiterverarbeitung geprüft,
  - Versand geprüft.
- Signaturbox wirkt dadurch näher am Mockup und stärker als abgeschlossene Kontrollzone.
- Schreibfläche innerhalb der Signaturfelder bleibt erhalten.
- Signaturtitel wurden typografisch leicht geschärft.
- Print-Tokens für die Auftragstasche weiter konsolidiert:
  - PrintPilot-Blau,
  - Dunkel-Navy für Werte,
  - Blau-Grau für Labels,
  - harmonisierte Border-Farben,
  - subtilere Panel-Schattierung.
- Produktionsdaten-Panel nochmals etwas hochwertiger und ruhiger abgestimmt.
- Rahmen und Panel-Linien minimal harmonisiert.

Bewusst nicht geändert:

- Keine neuen Fachfelder.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.
- A4 Hochformat bleibt strikt einseitig.
- Alle Auftragstaschenwerte bleiben editierbar und kommen aus dem Drucktaschenmodell.

Nächster sinnvoller Schritt:

- Ausdruck prüfen.
- Danach die Mockup-Designsprache auf die Kalkulationsmaske übertragen.


## Sprint 46.46 – Offizielles PrintPilot-Logo global einsetzen

Status: umgesetzt.

Ziel:
- Das neue offizielle PrintPilot-Logo wird als Masterlogo für alle PrintPilot-Masken verwendet.
- Platzhalter-/Pseudo-Logos werden aus den produktiven Hauptmasken entfernt.
- Die Logo-Nutzung wird über eine zentrale Komponente vereinheitlicht.

Umgesetzt:
- Neues Logo als `src/assets/logo/printpilot-logo.png` abgelegt.
- Neue zentrale Komponente `src/components/brand/PrintPilotLogo.tsx` ergänzt.
- App-Header in Kalkulation, Auftragsübersicht und Auftragsdetails nutzen jetzt dieselbe Logo-Komponente.
- Die druckbare Auftragstasche nutzt im Kopfbereich ebenfalls das neue Logo statt der bisherigen generischen SVG-Marke.
- Die Header-Brandfläche wurde auf helle Darstellung umgestellt, damit das navy/blaue Logo korrekt und hochwertig wirkt.
- Drucklogo für die A4-Auftragstasche wurde bewusst kompakt gesetzt: Logo links, Dokumenttyp `Auftragstasche` daneben.

Nicht geändert:
- Keine neue Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.
- Keine Veränderung am editierbaren Drucktaschenmodell.

Design-Entscheidung:
- `PrintPilot.png` ist ab Sprint 46.46 das verbindliche Masterlogo.
- Neue Screens sollen keine manuell nachgebauten PrintPilot-Logos mehr verwenden.
- Für zukünftige Masken soll bevorzugt `PrintPilotLogo` genutzt werden, damit Logo-Größen, Varianten und spätere Optimierungen zentral steuerbar bleiben.

## Sprint 46.47 – Logo-Ausrichtung, Liefertermin-Akzent und weichere Linien

Status: umgesetzt.

Auslöser:
- Das neue PrintPilot-Logo soll in allen Masken mittiger und ruhiger sitzen.
- Der Liefertermin soll wie im modernen Mockup stärker mit PrintPilot-Cyan hervorgehoben werden.
- Die Rahmen der Auftragstasche sind noch etwas zu deutlich und sollen weicher, hochwertiger und weniger hart wirken.

Umgesetzt:
- Globale Logo-Ausrichtung in den Hauptmasken angepasst:
  - Brand-Fläche zentriert das Logo besser,
  - Logo-Objektposition auf mittige Ausrichtung gesetzt,
  - App-Logo minimal vertikal ausgerichtet.
- Druckbare Auftragstasche im Kopfbereich feinjustiert:
  - offizielles Logo sitzt ruhiger in der Kopfzeile,
  - Logo und Dokumenttyp `Auftragstasche` sind vertikal besser ausgerichtet.
- Liefertermin im Druckkopf erhält den Mockup-Akzent:
  - Datum in Cyan / PrintPilot-Blau,
  - Meta-Zeitangabe weiter in dunklem Navy.
- Linien und Rahmen der A4-Auftragstasche weicher gesetzt:
  - Panel-Rahmen heller,
  - Produktionsdaten-Rahmen subtiler,
  - Innenraster weniger hart,
  - Tabellen-/Zeilentrenner heller,
  - Signaturbereich weiterhin klar, aber weniger schwer.
- Produktionsdaten-Schattierung weiter zurückgenommen, damit der Bereich hochwertiger und weniger technisch wirkt.
- QR-/Scantext minimal ruhiger abgestimmt.
- Signatur-Akzentbalken dezenter gemacht und je Prüffeld mittiger als kleiner Balken gesetzt.

Bewusst nicht geändert:
- Keine neuen Fachfelder.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.
- A4 Hochformat bleibt strikt einseitig.
- Alle Auftragstaschenwerte bleiben editierbar und kommen aus dem Drucktaschenmodell.

Nächster sinnvoller Schritt:
- Ausdruck prüfen.
- Wenn die Auftragstasche optisch passt, die Designrichtung auf die Kalkulationsmaske übertragen.

## Sprint 46.48 – Auftragstasche exakt am Mockup ausrichten

Sprint 46.48 schärft die druckbare Auftragstasche nochmals explizit gegen das moderne Mockup als Zielbild.

Umgesetzt:

- Printkopf stärker an das Mockup angeglichen.
- Offizielles PrintPilot-Markenzeichen im Druckkopf als separate Marke eingesetzt, daneben typografisch gesetztes `PrintPilot` und `Auftragstasche`.
- Liefertermin im Kopf wieder einzeilig gesetzt.
- Lieferdatum im Mockup-Stil cyan/blau hervorgehoben, Uhrzeit bleibt dunkel.
- QR-/Scanbereich um eine kleine Phone-/Scan-Markierung ergänzt.
- Rahmen und Innenlinien weiter entschärft.
- Produktionsdaten-Box dezenter schattiert und hochwertiger gesetzt.
- Panels, Linien, Labels und Werte typografisch ruhiger abgestimmt.
- Signaturbereich bleibt mit blauem Akzent und echter Schreibfläche erhalten.
- DIN A4 Hochformat bleibt strikt einseitig.
- Alle Werte bleiben aus dem editierbaren Drucktaschenmodell.

Keine Preislogik, keine Kalkulationslogik und keine Persistenzänderung.

## Sprint 46.49 – Auftragstasche Mockup-Feinschliff kompakt

Sprint 46.49 verfeinert die Auftragstasche nach dem Vergleich mit dem Mockup und dem aktuellen Ausdruck.

Auslöser:
- Die Richtung aus Sprint 46.48 ist deutlich besser, die Schrift wirkt im Ausdruck aber minimal zu groß.
- Der Liefertermin im Kopf wurde bei ungünstiger Browser-PDF-Skalierung am Ende abgeschnitten.
- Rahmen, Innenlinien und Signaturakzent sollen noch einen kleinen Tick weicher werden.

Umgesetzt:
- Print-Schriftgrößen minimal reduziert, ohne die Lesbarkeit wieder zu verlieren.
- Kopfbereich neu ausbalanciert:
  - Auftrag-Nr. bleibt prominent,
  - Produkt bleibt ruhig,
  - Liefertermin bekommt mehr Breite,
  - Status bleibt kompakt.
- Liefertermin bleibt einzeilig und vollständig sichtbar.
- Cyan-Akzent auf dem Datum bleibt erhalten, Uhrzeit/Meta bleiben dunkel.
- QR-/Scanbereich minimal kompakter und ruhiger gesetzt.
- Produktionsdaten-Box etwas kompakter, mit noch weicheren Innenlinien.
- Panel-Rahmen, Tabellenlinien und Checklisten-Trenner weiter entspannt.
- Aktive Weiterverarbeitungs-Tags minimal kleiner gesetzt.
- Signaturbereich leicht kompakter, blauer Balken dezenter.

Bewusst nicht geändert:
- Keine neuen Fachfelder.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.
- A4 Hochformat bleibt strikt einseitig.
- Alle Auftragstaschenwerte bleiben editierbar und kommen aus dem Drucktaschenmodell.

Nächster Schritt:
- Ausdruck prüfen.
- Wenn die Auftragstasche so passt, Designrichtung auf die Kalkulationsmaske übertragen.


## Sprint 46.50 – Auftragstasche finaler Mockup-Abgleich

Sprint 46.50 friert die Auftragstasche als visuelle Designreferenz weiter in Richtung des modernen Mockups ein.

Auslöser:
- Die Auftragstasche ist nach Sprint 46.49 sehr nah am Mockup, aber Kopf/Logo, Liefertermin und Liniengewicht brauchen noch einen letzten Abgleich.
- Der Liefertermin soll wie im Mockup gleichwertig lesbar bleiben: Datum cyan/blau, Uhrzeit dunkel, alles einzeilig.
- Die Linien sollen weniger technisch wirken und nur noch als ruhige Orientierung dienen.

Umgesetzt:
- Branding/Kopfbereich ruhiger und hochwertiger ausgerichtet.
- Logo-Mark und `PrintPilot Auftragstasche` optisch stärker an das Mockup angelehnt.
- QR-/Scanbereich kompakter und weniger hart gesetzt.
- Liefertermin typografisch korrigiert:
  - Datum explizit in Cyan/PrintPilot-Blau,
  - Uhrzeit/Meta in dunklem Navy,
  - beide Teile einzeilig und gleichwertiger lesbar.
- Rahmen und Linien nochmals weicher gemacht:
  - Panel-Rahmen heller,
  - Innenraster der Produktionsdaten dezenter,
  - Zeilentrenner in den Panels zurückgenommen.
- Produktionsdaten-Box als hochwertige zentrale Kernbox stabilisiert.
- Signaturbereich mit dezenteren blauen Akzentbalken je Prüffeld verfeinert.

Bewusst nicht geändert:
- Keine neuen Fachfelder.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.
- A4 Hochformat bleibt strikt einseitig.
- Alle Auftragstaschenwerte bleiben editierbar und kommen aus dem Drucktaschenmodell.

Ergebnis:
- Die Auftragstasche gilt ab jetzt als Designreferenz für die Übertragung auf die Kalkulationsmaske.

## Sprint 46.51 – Auftragstasche Signaturraum und Prüfstatus finalisieren

Sprint 46.51 korrigiert kleine Ausdruckdetails nach dem Mockup-Vergleich.

Auslöser:
- Im Signaturbereich war unter der Linie `Name, Unterschrift` zu wenig Weißraum.
- In `Lieferung / Versand` wirkten `Lieferadresse` und der Adresswert noch nicht sauber genug in der Größenhierarchie.
- Im Mockup sind `Daten geprüft` und `Freigabe erteilt` als grüner Kreis mit weißem Haken und blauem Text dargestellt; diese Anmutung soll übernommen werden.

Umgesetzt:
- Signaturfelder unten mit mehr Weißraum unter `Name, Unterschrift` versehen.
- Signaturzeilen innerhalb der Prüfbox neu austariert, ohne die A4-Einseitigkeit aufzugeben.
- `Lieferadresse`-Zeile im Bereich `Lieferung / Versand` minimal besser lesbar gesetzt.
- Druckdaten-Status auf Mockup-Anmutung umgestellt:
  - grüner runder Statuspunkt mit weißem Haken,
  - Status-/Freigabetext in ruhigem Blau/Navy statt grünem Volltext.
- Prüfstatus-Zeile mit etwas mehr Luft und besserer Icon-/Text-Ausrichtung versehen.

Bewusst nicht geändert:
- Keine neuen Fachfelder.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.
- A4 Hochformat bleibt strikt einseitig.
- Alle Auftragstaschenwerte bleiben editierbar und kommen aus dem Drucktaschenmodell.

### Sprint 46.52 – Auftragstasche Detailkorrekturen

- Logo-Mark in der druckbaren Auftragstasche bereinigt: der störende dunkle Reststrich aus dem Wortlogo-Crop wurde entfernt.
- Zeilenlayout in den Informationspanels nachjustiert, damit Label und Wert sauberer auf einer optischen Höhe sitzen.
- Schriftgrößen in den Line-Items minimal harmonisiert, insbesondere für Werte wie `Rohbogen` / `SRA3` und `Lieferadresse` / Adresse.
- Signatur-Akzentbalken wieder als durchgehende blaue Linie über die gesamte Prüfzone gesetzt.
- A4-Hochformat bleibt strikt einseitig; alle Drucktaschenwerte bleiben editierbar.
- Keine Preislogik, keine Kalkulationslogik, keine Persistenzänderung.


### Sprint 46.53 – Auftragstasche CI-Logo und Detailkorrekturen

Korrektur nach Review:
- Das PrintPilot-Logo darf nicht rekonstruiert, beschnitten oder als separat erzeugte Marke verändert werden. Das Logo ist CI und muss unverändert verwendet werden.
- Der Druckkopf nutzt deshalb wieder die originale Logo-Datei `src/assets/logo/printpilot-logo.png`.
- Das Wort `Auftragstasche` wird neben dem originalen PrintPilot-Logo auf die optische Höhe des PrintPilot-Schriftzugs gesetzt.
- Die zuvor erzeugte separate Datei `src/assets/logo/printpilot-logo-mark.png` wird nicht mehr verwendet und aus dem Paket entfernt.
- Das Icon für `Endformat` wurde näher an das Mockup angepasst.
- `Farbigkeit` wird in der Produktionsdaten-Kernbox nicht mehr doppelt als Vorder-/Rückseitenwert ausgegeben. Stattdessen wird ein kompakter Druckerei-Wert erzeugt, z. B. `4/4 farbig CMYK` oder `1/1 farbig Schwarz`.
- Zeilen in Informationspanels wurden erneut auf einheitliche Baselines gebracht, insbesondere für `Rohbogen` / `SRA3` und ähnliche Label-/Wert-Paare.
- Der blaue Signaturbalken ist wieder wirklich durchgehend über die gesamte Prüfzone. Die vertikalen Trennlinien beginnen erst unterhalb des Balkens.

Bewusst nicht geändert:
- Keine neuen Fachfelder.
- Keine Preislogik.
- Keine Kalkulationslogik.
- Keine Persistenzänderung.
- A4 Hochformat bleibt strikt einseitig.
- Alle Auftragstaschenwerte bleiben editierbar.

### Sprint 46.54 – Auftragstasche Iconset nach Mockup präzisieren

- Icons der druckbaren Auftragstasche wurden näher an das moderne Mockup angepasst.
- Produktionsdaten-Kernbox erhält überarbeitete Icons für:
  - Auflage / Papierstapel,
  - Endformat mit vertikaler Maß-/Pfeilmarkierung,
  - Farbigkeit mit CMYK-Tropfen,
  - Material / Papierbogen,
  - Maschine,
  - Druckart,
  - Nutzenraster.
- Bereichsicons für Kunde, Druckdaten, Material/Druckbogen, Weiterverarbeitung, Lieferung/Versand und Kontrolle wurden in Linienführung, Rundungen und Proportionen harmonisiert.
- Druckart-Icon nutzt jetzt wie im Mockup einen gefüllten Hauptpunkt mit weiteren Outline-Punkten.
- Die offizielle PrintPilot-Logo-Datei bleibt unverändert; es wird keine rekonstruierte oder beschnittene Logo-Variante verwendet.
- Farbigkeit bleibt weiterhin kompakt als druckereitypischer Wert, z. B. `4/4 farbig CMYK` oder `1/1 farbig Schwarz`.
- A4 Hochformat bleibt strikt einseitig; alle Auftragstaschenwerte bleiben editierbar.
- Keine Preislogik, keine Kalkulationslogik, keine Persistenzänderung.

### Sprint 46.55 – Auftragstasche Produktionsdaten und Logo-Verlauf korrigieren

- Produktionsdaten-Kernbox nach Review nachgezogen: Werte wie `Bilderdruck matt 135 g`, `Xerox® Iridesse 1`, `Digitaldruck Farbe` und `8 Nutzen` sollen einzeilig bleiben.
- Produktionsdaten-Icons, Textbreiten, Abstände und Schriftgröße wurden leicht kompakter gesetzt, damit die Kernwerte in einer Zeile Platz haben.
- Line-Items in den Panels wurden erneut harmonisiert, damit Label und Wert ruhiger auf einer optischen Höhe sitzen.
- Besonders geprüft wurden Zeilen wie `Rohbogen` / `SRA3` und `Lieferadresse` / Adresswert.
- Der Verlauf im PrintPilot-Logo-/Headerbereich der App-Masken wurde entfernt. Das Logo steht auf ruhigem weißen Hintergrund, ohne Fade/Gradient.
- Das offizielle PrintPilot-Logo bleibt unverändert; keine Rekonstruktion, kein Beschnitt, keine CI-Änderung.
- A4 Hochformat bleibt strikt einseitig; alle Auftragstaschenwerte bleiben editierbar.
- Keine Preislogik, keine Kalkulationslogik, keine Persistenzänderung.

## Sprint 46.56 – Auftragstasche: nur relevante Weiterverarbeitung drucken

- Die druckbare Auftragstasche zeigt im Bereich **Weiterverarbeitung** nur noch wirklich ausgewählte/aktive Schritte.
- Der bisherige Hinweis **Weitere Schritte** wurde entfernt, damit keine nicht gewählten Optionen wie Falzen, Rillen, Heften oder Ableimen unnötig auf dem Laufzettel erscheinen.
- Arbeitsanweisung und Zusatzhinweis bleiben erhalten, sofern sie echte auftragsrelevante Informationen enthalten.
- Grundsatz für die Auftragstasche bestätigt: Gedruckt wird nur, was für diesen Auftrag relevant ist; frei werdender Platz soll für Besonderheiten und wichtige Produktionshinweise genutzt werden.
- Keine Preislogik, keine Kalkulationslogik, keine Persistenzänderung.

## Sprint 46.57 – Auftragstasche Kontrollbereich bereinigen

- Der Bereich **Kontrolle** in der druckbaren Auftragstasche enthält nur noch echte Prüfpunkte.
- Entfernt aus dem Kontrollpanel wurden:
  - Fremdarbeit,
  - Muster-/Belegangaben,
  - Dokumente,
  - Rechnungshinweise.
- Die Dokumenten-/Ablagezeile unten bleibt die einzige Stelle für `Muster in Tasche`, `Lieferschein`, `Papierrechnung` und `Lieferantenrechnung`.
- Dadurch gibt es keine doppelte Ausgabe von Lieferschein/Papierrechnung/Lieferantenrechnung mehr.
- Kontrollpunkte bleiben auf Produktionsprüfung fokussiert:
  - Farbigkeit / Maßhaltigkeit geprüft,
  - Weiterverarbeitung geprüft,
  - Menge / Stückzahl geprüft,
  - Druckdaten / Freigabe geprüft.
- Das Wort `Auftragstasche` im Druckkopf wurde optisch stärker auf Höhe des unveränderten offiziellen PrintPilot-Schriftzugs ausgerichtet.
- Der blaue Signaturbalken wurde erneut als durchgehende Linie über die gesamte Signaturzone abgesichert.
- Das offizielle PrintPilot-Logo bleibt unverändert; keine Rekonstruktion, kein Beschnitt, keine CI-Änderung.
- A4 Hochformat bleibt strikt einseitig; alle Auftragstaschenwerte bleiben editierbar.
- Keine Preislogik, keine Kalkulationslogik, keine Persistenzänderung.

## Sprint 46.58 – Auftragstasche Relevanz, QR und Kontrolllayout finalisieren

- Der Status `Im Druck` wird im Ausdruck der Auftragstasche entfernt, weil er für den physischen Laufzettel nicht relevant genug ist.
- Der frei werdende Platz im Kopf wird für den QR-/Scanbereich genutzt.
- QR-Code und Smartphone-/Scan-Hinweis werden größer und klarer platziert.
- Der Bereich **Kontrolle** enthält keine Status-Zusammenfassung wie `3/13 · 1 offen` mehr.
- Kontrollpunkte stehen im Ausdruck untereinander, damit der Bereich ruhiger und besser abhakbar wirkt.
- Der Bereich **Lieferung / Versand** zeigt nur noch die tatsächlich ausgewählte Versand-/Übergabeart, z. B. `Spedition`, `Abholung` oder `Fahrer`; nicht gewählte Versandoptionen werden nicht mehr als Checkbox-Katalog ausgegeben.
- Label-/Wert-Zeilen in allen Panels wurden auf gleiche optische Baseline und konsistente Schriftgrößen harmonisiert, insbesondere `Material / Bilderdruck`, `Rohbogen / SRA3`, `Lieferadresse / Adresse`.
- Das Wort `Auftragstasche` im Kopf bleibt am unveränderten offiziellen PrintPilot-Logo ausgerichtet; das Logo selbst wird nicht verändert.
- A4 Hochformat bleibt strikt einseitig; alle Auftragstaschenwerte bleiben editierbar.
- Keine Preislogik, keine Kalkulationslogik, keine Persistenzänderung.

## Sprint 46.59 – Auftragstasche: Relevanz, QR-Position und Detailausrichtung

- Auftragstaschen-Druckkopf weiter am Mockup ausgerichtet: `Auftragstasche` sitzt näher an der optischen Höhe des unveränderten offiziellen PrintPilot-Schriftzugs.
- QR-Code bleibt groß; Scan-Text und Smartphone-Icon wurden stärker links neben dem QR-Code positioniert.
- `Status / Im Druck` bleibt aus dem Ausdruck entfernt, weil er für die gedruckte Auftragstasche nicht produktionsrelevant ist.
- Weiterverarbeitung zeigt in der Arbeitsanweisung nur noch echte Tätigkeitshinweise. Verpackungsmengen wie `3 Pakete à 1.000 Stück` stehen nur noch im Zusatz-/Verpackungsbereich.
- Kontrollpunkte stehen chronologisch: Druckdaten/Freigabe, Farbigkeit/Maßhaltigkeit, Weiterverarbeitung, Menge/Stückzahl.
- Materialstatus-Reihenfolge im Ausdruck: `am Lager`, `gestellt`, `bestellt`, `Lieferant`.
- Papierlieferant wird im Materialbereich als eigener Wert vorbereitet.
- Versandbereich zeigt nur die gewählte Versand-/Übergabeart statt eines Optionskatalogs.
- `Seite 1 von 1` wurde aus der druckbaren Auftragstasche entfernt.
- Label- und Wert-Typografie in den Line-Items wurde nochmals vereinheitlicht, damit linke Labels und rechte Werte in allen Feldern optisch gleich groß und sauber ausgerichtet wirken.

Build-Prüfung: `npm run build`.

## Sprint 46.60 – Auftragstasche Kundendaten E-Mail ergänzen

- Kundendaten in der druckbaren Auftragstasche wurden fachlich ergänzt.
- Die E-Mail-Adresse des Ansprechpartners wird jetzt im Bereich **Kunde** angezeigt.
- Das editierbare Drucktaschenmodell enthält dafür ein eigenes Feld `customerEmail`.
- Der Auftragstaschen-Editor bietet die E-Mail-Adresse als bearbeitbares Feld im Bereich Kopf / Kunde / Rechnung an.
- Die E-Mail wird aus den bestehenden Auftragsdaten (`contactEmail`) übernommen und kann für den Ausdruck überschrieben werden.
- Ziel bleibt: Die Auftragstasche enthält nur relevante Produktions- und Kontaktdaten, aber die wichtigsten Rückfragekanäle wie Telefon und E-Mail müssen sichtbar sein.
- A4 Hochformat bleibt strikt einseitig; alle Auftragstaschenwerte bleiben editierbar.
- Keine Preislogik, keine Kalkulationslogik, keine Persistenzänderung.

Build-Prüfung: `npm run build`.

## Sprint 46.61 – Auftragstasche als Designreferenz einfrieren

- Das Wort **Auftragstasche** wurde aus dem Druckkopf entfernt.
- Das offizielle PrintPilot-Logo steht im Ausdruck jetzt allein als Brand-Anker; der Dokumenttyp ist durch Layout, Inhalt und Druckbutton eindeutig.
- Die aktuelle druckbare Auftragstasche wird als verbindliche Designreferenz für die nächsten PrintPilot-Masken festgelegt.
- Design-Grundsatz ab jetzt: modern, sachlich, fachlich korrekt, sehr gut lesbar, mit klar priorisierten Produktionsinformationen.
- Diese Richtung soll auf die Kalkulationsmaske übertragen werden: größere Lesbarkeit, klare Kernboxen, ruhige Panels, dezente Linien, PrintPilot-Blau/Cyan-Akzente und keine gequetschte Formularoptik.
- Das offizielle PrintPilot-Logo bleibt unverändert; keine Zuschnitte, keine grafischen Veränderungen, keine CI-Abwandlungen.
- A4 Hochformat bleibt strikt einseitig; alle Auftragstaschenwerte bleiben editierbar.
- Keine Preislogik, keine Kalkulationslogik, keine Persistenzänderung.

Build-Prüfung: `npm run build`.

## Sprint 47 – Kalkulationsmaske nach Auftragstaschen-Designreferenz

- Die finale Auftragstasche aus Sprint 46.61 wurde als North Star auf die Kalkulationsmaske übertragen.
- Der Kopf der Kalkulation spricht jetzt fachlich klarer: Produktionsdaten, Preisfindung und Auftragstasche statt klassischer MIS-Maske.
- Die Kalkulationsseite erhält einen sichtbaren PrintPilot-Fluss: **Kalkulation → Auftrag → Auftragstasche → Produktion**.
- Der obere Kalkulationskern zeigt die wichtigsten Produktionsdaten als ruhige, gut lesbare Kernboxen: Kunde, Produkt, Auflage, Material, Maschine und Termin.
- Die sechs Arbeitsbereiche bleiben erhalten, sind aber optisch ruhiger, gleich breit und stärker als produktive Eingabereiter gezeichnet.
- Eingabefelder, Pflicht-/Optional-/Später-Badges und Fokuszustände wurden in Richtung Auftragstasche harmonisiert: klare Ränder, weniger fette Typografie, weißer Arbeitsraum, dezente Linien.
- Rechts steht jetzt ein sticky Ergebnis- und Auftragstaschenbereich mit Nutzenplan, Produktionsdaten, Preisabschluss und Vorschau der Übergabe an die Auftragstasche.
- Der Haupt-CTA wurde fachlich umbenannt zu **Auftragstasche vorbereiten**, weil die Kalkulation in PrintPilot auf Auftrag und Auftragstasche hinführt.
- `Angebot speichern` bleibt sichtbar als vorbereiteter, noch deaktivierter Folgeprozess ohne neue Persistenzlogik.
- Keine neue Preislogik, keine neue Kalkulationslogik, keine Persistenzänderung.

Build-Prüfung: `npm run build`.

### Sprint 47.1 – Kalkulationsmaske: Ergebnisbereich entquetscht

Nach dem ersten Sprint-47-Test auf normaler Desktopbreite mit linker App-Navigation wurde der rechte Produktionskern zu eng dargestellt. Der Ergebnisbereich wird deshalb bei kleineren Arbeitsflächen nicht mehr als schmale rechte Sticky-Spalte erzwungen, sondern unterhalb der Eingabemaske als breiter, moderner Ergebnisblock geführt.

Korrekturen:

- Breakpoint für die Kalkulationsmaske auf reale Arbeitsbreite mit linker Navigation angepasst.
- Horizontalen Überlauf im Produktionskern entfernt.
- Nutzenplan, Produktionsdaten, Preisabschluss und Übergabe an Auftragstasche umbrechen jetzt kontrolliert.
- Auftragstaschen-Übergabe nutzt in engen Bereichen eine vertikale Label/Wert-Darstellung statt gequetschter Tabellenoptik.
- Der Ergebnisbereich bleibt im normalen Seitenfluss; die Bottom-Navigation bleibt unverändert, weil die Seite scrollbar ist.

Ziel bleibt: Die Kalkulationsmaske soll produktiv bedienbar sein und sich optisch an der finalen Auftragstasche orientieren, ohne auf normalen Monitoren rechts zu zerbrechen.

### Sprint 47.2 – Kalkulationsmaske konsequent an Auftragstasche angleichen

- Sprint 47/47.1 wurde optisch korrigiert: Die Kalkulationsmaske darf nicht wie eine klassische MIS-/ERP-Eingabetabelle wirken.
- Eingabemasken orientieren sich ab Sprint 47.2 an der eingefrorenen Auftragstasche aus Sprint 46.61:
  - weiße Panels,
  - feine blaue/hellgraue Linien,
  - klare Label-Wert-Zeilen,
  - keine harten grauen Tabellenköpfe,
  - keine gequetschte rechte Ergebnis-Spalte,
  - ruhige sachliche Typografie,
  - Produktionsdaten stehen im Vordergrund.
- Die bisherige rechte Ergebnis-Spalte wurde in einen vollbreiten Produktionskern unterhalb der Eingabemaske überführt.
- Die Statusleiste ist nicht mehr sticky über den Eingabefeldern, damit die Bottom-Navigation keine Inhalte verdeckt.
- Ergebnis, Nutzenplan, Preisabschluss und Auftragstaschen-Übergabe nutzen dieselbe Panel-Logik wie die gedruckte Auftragstasche.

### Sprint 47.3 – Kalkulationsmaske: Kopf reduzieren und Eingabefelder schärfen

- Die zwei oberen Infozeilen unter dem Kalkulationskopf wurden entfernt, weil sie in der Arbeitsmaske redundant waren.
- Stattdessen steht rechts im Kopf eine kompakte Infobox mit den wichtigsten Kalkulationsdaten: Kunde, Produkt, Auflage/Bogen, Termin, Material und Maschine.
- Die Reiter rücken dadurch direkt unter den Kopf und die eigentliche Eingabe beginnt schneller.
- Eingabefelder wurden deutlicher als bearbeitbare Felder gezeichnet: leicht grauer Feldhintergrund, dezente Innenkontur, Hover- und Fokuszustand mit PrintPilot-Blau.
- Labelzellen bleiben ruhig und sachlich, damit die Maske weiter an die Auftragstaschen-Logik angelehnt ist und nicht zurück in eine schwere ERP-Tabellenoptik fällt.
- Die Änderung betrifft nur Layout/Design. Keine neue Kalkulationslogik, keine Preislogik und keine Persistenzänderung.

Build-Prüfung: `npm run build`.

### Sprint 47.4 – Kalkulationsnavigation stärker hervorheben

- Die obere Reiternavigation der Kalkulationsmaske wurde höher gezeichnet, damit die Arbeitsbereiche deutlicher als primäre Bedienstruktur erkennbar sind.
- Der aktive Reiter wird jetzt vollflächig im PrintPilot-Cyan dargestellt.
- Text, Status und Nummer des aktiven Reiters laufen negativ in Weiß.
- Inaktive Reiter bleiben ruhig weiß mit feinen Trennlinien, damit die Maske weiterhin sachlich und auftragstaschenähnlich bleibt.
- Hover- und Fokuszustände wurden passend zur neuen aktiven Fläche angepasst.
- Die Änderung betrifft nur die visuelle Reiterführung. Keine neue Kalkulationslogik, keine Preislogik und keine Persistenzänderung.

Build-Prüfung: `npm run build`.

### Sprint 47.5 – Reiterabschluss und Feldflächen verfeinern

- Der helle Abschlussbalken im aktiven vollflächigen Cyan-Reiter wurde auf klares Weiß umgestellt, damit der aktive Arbeitsbereich sauberer und bewusster wirkt.
- Die Eingabefelder behalten jetzt eine weiße Feldfläche und bekommen eine sehr feine Cyan-Kontur.
- Hover- und Fokuszustände bleiben cyanbetont, aber ohne graue oder gelbliche Feldflächen.
- Auch Felder in der Weiterverarbeitungstabelle folgen dieser feineren weißen Feldlogik.
- Die Änderung betrifft nur die visuelle Führung der Tabs und Eingabefelder. Keine neue Kalkulationslogik, keine Preislogik und keine Persistenzänderung.

Build-Prüfung: `npm run build`.


### Sprint 47.6 – Kalkulationsmaske Feinschliff

- Der Kopfbereich der Kalkulationsmaske wurde kompakter gezogen, damit die Arbeitsreiter und Eingabefelder schneller in den sichtbaren Arbeitsbereich rücken.
- Die kompakte Infobox rechts im Kopf bleibt erhalten, wurde aber minimal breiter und besser lesbar gestaltet.
- Die normalen Eingabefeld-Konturen wurden zurückgenommen: weiße Feldflächen bleiben bestehen, die Cyan-Umrandung ist im Normalzustand feiner und ruhiger.
- Hover und Fokus bleiben klar cyanbetont, damit aktive Bearbeitung eindeutig sichtbar bleibt.
- Die Label-Hinterlegung wurde leicht beruhigt, damit viele Felder gleichzeitig weniger stark leuchten.
- Die Bottom-Navigation wurde bewusst nicht verändert; die Kalkulationsseite ist scrollbar.
- Keine neue Kalkulationslogik, keine Preislogik und keine Persistenzänderung.

Build-Prüfung: `npm run build`.

## Sprint 47.7 – Kalkulation: Labelspalte und Eingabewerte verfeinert

- Die Labelbereiche der Kalkulations-Eingabefelder wurden von leicht grauer Fläche auf Weiß umgestellt.
- Die Labeltexte wie Kunde, Telefon, Produkt, Format usw. verwenden jetzt PrintPilot-Cyan als Orientierungssignal.
- Pflicht-/Optional-Badges bleiben zurückhaltend, aber farblich sauber an das Cyan-System gekoppelt.
- Die Schriftgewichte der eigentlichen Eingabewerte wurden leicht reduziert, damit die Maske weniger massiv wirkt und näher an der ruhigen Auftragstaschen-Typografie bleibt.
- Feldinhalt, Rahmenlogik und Fokuszustand bleiben weiß/cyan und damit weiterhin klar als editierbare Eingabefelder erkennbar.
- Keine Änderung an Bottom-Navigation, Kalkulationslogik, Preislogik, Datenmodell oder Persistenz.

Build-Prüfung: `npm run build`.

## Sprint 48 – Kalkulationsmaske fachlich bereinigt

- Die Kalkulationsmaske wurde nach dem stabilisierten Sprint-47.7-Look fachlich überprüft und auf die spätere Auftragstaschen-Übergabe ausgerichtet.
- Doppelte oder missverständliche Begriffe wurden getrennt:
  - **Lieferant** bei Papier heißt jetzt **Papierlieferant**.
  - **Lieferant** bei Fremdproduktion heißt jetzt **Fremdlieferant**.
  - **Fremdleistung** im Ergebnis heißt jetzt **Fremdkosten**.
  - **Weiterverarbeitung** im Preisbereich heißt jetzt **Weiterverarbeitungskosten**.
  - **Marge** im Fremdbereich heißt jetzt **Fremdleistungs-Aufschlag**.
  - **Marge** im Preisabschluss heißt jetzt **Gesamtmarge / Deckungsbeitrag**.
  - **Zuschuss** in der Menge heißt jetzt **geplante Übermenge**.
  - **Makulatur** im Druckbereich heißt jetzt **Maschinenmakulatur**.
- Wichtige Auftragstaschen-Felder wurden ergänzt:
  - Druckdatei,
  - Dateiversion,
  - Ablageort / Link,
  - Druckdaten geprüft,
  - Freigabe,
  - Proof / Muster,
  - Arbeitsanweisung,
  - Zusatz / Verpackungshinweis.
- Lieferung und Versand wurden als produktionsrelevante Angaben erweitert:
  - Versandart,
  - Verpackung,
  - Lieferzeit / Tour,
  - Neutralversand / Label,
  - Lieferschein.
- Die Kontrollübergabe an die Auftragstasche wurde vorbereitet:
  - Kontrolle Druckdaten,
  - Kontrolle Farbe / Maß,
  - Kontrolle Weiterverarbeitung,
  - Kontrolle Menge,
  - Muster in Tasche,
  - Papierrechnung,
  - Lieferantenrechnung.
- Die Infobox und der Produktionskern berücksichtigen jetzt auch Druckdatei, Freigabe, Arbeitsanweisung, Zusatz und Versandlogik.
- Der akzeptierte Sprint-47.7-Look bleibt unverändert: weiße Labels mit Cyan-Schrift, weiße Eingabefelder mit feiner Cyan-Kontur, aktive Tabs vollflächig Cyan.
- Die Bottom-Navigation bleibt unverändert.
- Keine neue Preislogik, keine Persistenzänderung und keine echte Kalkulationsberechnung; Sprint 48 ist eine fachliche Feldbereinigung.

Build-Prüfung: `npm run build`.


## Sprint 48.1 – Kalkulation: Beschriftungen vollständig sichtbar

- Abgekürzte Fachlabels wurden ausgeschrieben: **WV-Anteil intern/extern** wurde zu **Weiterverarbeitungs-Anteil intern / extern**, **Gesamtmarge / DB** wurde zu **Gesamtmarge / Deckungsbeitrag** und **Kontrolle WV** wurde zu **Kontrolle Weiterverarbeitung**.
- Die Labelspalte der Eingabemaske wurde verbreitert, damit Begriffe wie **Kalkulationsnummer** oder **Geplante Übermenge** nicht abgeschnitten werden.
- Labeltexte dürfen innerhalb der weißen Labelzelle sauber umbrechen, statt mit Auslassungspunkten gekürzt zu werden.
- Die kompakte Infobox im Kopf darf ihre Werte umbrechen, damit Maschinen-, Material- und Produktbezeichnungen vollständig lesbar bleiben.
- Der akzeptierte Sprint-47.7-Look bleibt erhalten: weiße Labels mit Cyan-Schrift, weiße Eingabefelder mit feiner Cyan-Kontur, aktive Tabs vollflächig Cyan.
- Die Bottom-Navigation bleibt unverändert.
- Keine Kalkulationslogik, Preislogik, Datenmodell- oder Persistenzänderung.

Build-Prüfung: `npm run build`.

## Sprint 48.2 – Vollständige Feldbeschriftungen ohne Kollisionen

- Feldbeschriftungen der Kalkulationsmaske werden vollständig lesbar gehalten.
- Lange Begriffe wie `Kalkulationsnummer` und `Geplante Übermenge` dürfen sauber umbrechen und kollidieren nicht mehr mit Pflicht-/Optional-Badges.
- Die Labelspalte wurde moderat verbreitert, ohne die akzeptierte Auftragstaschen-Optik zu verändern.
- Badge-Positionierung in den Feldlabels wurde stabilisiert.
- Bottom-Navigation bleibt unverändert.


## Sprint 48.3 – Feldbeschriftungen vollständig ohne harte Worttrennung

- Lange Feldbeschriftungen werden nicht mehr mitten im Wort getrennt.
- Pflicht-/Optional-/Später-Kennzeichnungen stehen im Labelbereich unter der Bezeichnung und kollidieren nicht mehr mit langen Begriffen.
- Die Labelspalte wurde moderat stabilisiert, damit Begriffe wie „Kalkulationsnummer“ ausgeschrieben lesbar bleiben.
- Der akzeptierte Look der Kalkulationsmaske bleibt erhalten: weiße Labelbereiche, Cyan-Schrift, weiße Eingabefelder und feine Cyan-Kontur.
- Die Bottom-Navigation bleibt unverändert.

## Sprint 49 – Übergabe Kalkulation → Auftragstasche definiert

- Die Kalkulationsmaske erhält eine sichtbare Datenübergabe-Logik: **Kalkulation → Auftrag → Auftragstasche**.
- Die Übergabe trennt produktionsrelevante Daten konsequent von internen Preis- und Kalkulationsdaten.
- Produktionsrelevante Daten werden nach Auftragstaschen-Bereichen gemappt:
  - Kopfdaten,
  - Produktionsdaten,
  - Kunde,
  - Druckdaten,
  - Material / Druckbogen,
  - Druck / Nutzenplan,
  - Weiterverarbeitung / Versand,
  - Kontrolle.
- Preis- und Kalkulationswerte wie Materialkosten, Druckkosten, Weiterverarbeitungskosten, Fremdkosten, Rabatt, Marge und Deckungsbeitrag werden ausdrücklich als **nur Kalkulation** markiert und gehören nicht auf die Auftragstasche.
- Der Reiter **Preise & Ergebnis** zeigt eine vollständige Mapping-Übersicht mit Quelle, aktuellem Wert, Zielbereich und Übergabeart.
- Der Produktionskern unter der Maske zeigt zusätzlich eine kompakte Mapping-Version, damit sofort sichtbar bleibt, welche Werte später in die Auftragstasche wandern.
- Die Auftragstasche bleibt dadurch Produktionsdokument und wird nicht zur Preis- oder Kalkulationsübersicht.
- Der akzeptierte Look aus Sprint 47.7/48.3 bleibt erhalten: weiße Labelbereiche, Cyan-Schrift, weiße Eingabefelder, feine Cyan-Kontur und vollflächig cyanfarbige aktive Tabs.
- Die Bottom-Navigation bleibt unverändert.
- Keine neue Preislogik, keine Persistenzänderung und keine echte Auftragsnummernlogik; Sprint 49 definiert den sichtbaren Datenvertrag für die spätere Übergabe.

Build-Prüfung: `npm run build`.

## Sprint 49.1 – Datenübergabe lesbar machen

Die Datenübergabe `Kalkulation → Auftrag → Auftragstasche` wurde nach dem ersten Testscreen überarbeitet. Das Sprint-49-Raster war fachlich richtig, aber visuell zu eng und erzeugte gequetschte Mapping-Karten. Sprint 49.1 stabilisiert die Darstellung als lesbare Übergabeliste.

Umgesetzt:

- vollständige Datenübergabe bleibt erhalten
- Haupt-Mapping wird einspaltig und zeilenbasiert dargestellt
- Quellen, Werte und Zielbereiche werden nebeneinander lesbar geführt
- keine harten Kürzungen in Mapping-Zeilen
- kompakte Mapping-Version im Produktionskern zeigt nur Gruppenzusammenfassung statt alle Detailwerte
- Preis- und Kalkulationsdaten bleiben weiterhin klar von Auftragstaschen-Daten getrennt
- akzeptierter Kalkulationsmasken-Look bleibt unverändert
- Bottom-Navigation bleibt unverändert

Wichtiges Pattern:

- Detail-Mapping nur im Reiter `Preise & Ergebnis`
- Produktionskern nur als kompakte Übersicht
- Auftragstasche bleibt Produktionsdokument, keine Preis- oder Kalkulationsübersicht

## Sprint 49.2 – Datenübergabe anwenderorientiert darstellen

- Die technische Datenübergabe-Tabelle wurde aus der sichtbaren Arbeitsmaske entfernt.
- Benutzer sehen im Reiter **Preise & Ergebnis** nur noch eine einfache Übergabeprüfung: Status, enthaltene Produktionsbereiche und interne Bereiche, die nicht auf die Auftragstasche gehören.
- Die Detailzuordnung Kalkulation → Auftrag → Auftragstasche bleibt fachlich dokumentiert und kann später intern/administrativ genutzt werden.
- Preis-, Kosten-, Rabatt-, Margen- und Deckungsbeitragswerte bleiben ausdrücklich interne Kalkulationsdaten und werden nicht auf der Auftragstasche ausgegeben.
- Der akzeptierte Sprint-47.7-Eingabemasken-Look bleibt erhalten: weißer Hintergrund, aktive Tabs vollflächig Cyan, weiße Eingabefelder mit sehr feiner Cyan-Umrandung, Label-Felder weiß mit Cyan-Schrift.
- Die Bottom-Navigation wurde nicht verändert.

## Sprint 50 – Angebot aus der Kalkulation erzeugen

- Vor dem Schritt **Kalkulation → Auftrag erzeugen** wurde die Angebotsausgabe ergänzt.
- Die Kalkulationsmaske kann jetzt aus den aktuellen Kalkulationsdaten ein kundenorientiertes Angebot vorbereiten.
- Der Reiter **Preise & Ergebnis** enthält einen neuen Angebotsbereich mit Aktionen:
  - **Angebot anzeigen**,
  - **Angebot als PDF drucken**,
  - **E-Mail vorbereiten**.
- Das Angebot ist bewusst kein Produktionsdokument und keine Auftragstasche. Es enthält kundenrelevante Daten:
  - Angebotsnummer,
  - Datum,
  - Kunde und Ansprechpartner,
  - Projekt,
  - Produkt,
  - Auflage,
  - Format,
  - Umfang / Farbigkeit,
  - Material,
  - Druck / Produktionsweg,
  - Weiterverarbeitung,
  - Lieferung,
  - Verkaufspreis netto,
  - Hinweise und Zahlungsbedingungen.
- Interne Kalkulationswerte wie Materialkosten, Druckkosten, Weiterverarbeitungskosten, Fremdkosten, Rabatt, Marge und Deckungsbeitrag werden nicht im Angebot ausgegeben.
- Die PDF-Ausgabe läuft zunächst browserbasiert über den Druckdialog. Der Benutzer kann daraus ein PDF speichern oder direkt drucken.
- Die E-Mail-Aktion bereitet eine Mail an die hinterlegte Kundenadresse mit Betreff und Text vor. Das PDF wird aus dem Druckdialog gespeichert und anschließend manuell angehängt; eine echte Mail-Attachment-Automation ist später eine Backend-/Integrationsaufgabe.
- Die Angebotsfähigkeit berücksichtigt jetzt auch den Verkaufspreis netto. Ohne Verkaufspreis soll kein Angebot erzeugt werden.
- Der akzeptierte Eingabemasken-Look bleibt erhalten: weißer Hintergrund, aktive Tabs vollflächig Cyan, weiße Eingabefelder mit sehr feiner Cyan-Umrandung, Label-Felder weiß mit Cyan-Schrift.
- Die Bottom-Navigation wurde nicht verändert.
- Keine echte Preisberechnung, keine Persistenz, keine PDF-Servergenerierung und keine E-Mail-Backend-Integration; Sprint 50 bereitet den sichtbaren Angebotsworkflow im Frontend vor.

Build-Prüfung: `npm run build`.

## Sprint 50.1 – Angebots-PDF/Druckausgabe sichtbar stabilisieren

- Der Angebotsdruck wurde korrigiert, weil die erste browserweite Druckausgabe durch bestehende Auftragstaschen-Print-CSS-Regeln leer erscheinen konnte.
- **Angebot als PDF drucken** öffnet jetzt ein isoliertes Druckfenster mit ausschließlich dem Angebotsdokument und eigenem A4-Print-CSS.
- Dadurch wird die Angebotsausgabe nicht mehr von globalen Print-Regeln der Auftragstasche beeinflusst.
- Das sichtbare Angebots-Preview in der Kalkulationsmaske bleibt erhalten.
- Die E-Mail-Vorbereitung bleibt unverändert.
- Der akzeptierte Sprint-47.7-Eingabemasken-Look bleibt unverändert.
- Die Bottom-Navigation wurde nicht verändert.
- Keine echte Server-PDF-Erzeugung, keine Persistenzänderung und keine E-Mail-Attachment-Automation; Sprint 50.1 stabilisiert ausschließlich die lokale Druck-/PDF-Ausgabe.

Build-Prüfung: `npm run build`.

## Sprint 50.2 – Angebots-PDF als Kundendokument veredeln

- Die Angebotsausgabe wurde nach dem ersten echten PDF-Test fachlich und sprachlich bereinigt.
- Das Angebot ist jetzt konsequenter ein Kundendokument und kein technisches Produktionsdokument.
- Produkt-/Projektbezeichnung wird sauberer verwendet: der Angebotstitel nutzt den Projektnamen, die Produktart bleibt separat sichtbar.
- Doppelte Farbigkeit wurde bereinigt: statt technischer Wiederholung wie `4/4-farbig · 4/4-farbig · Skala` wird kundenverständlich `2-seitig · 4/4-farbig Euroskala` ausgegeben.
- Materialname und Grammatur wurden sauber getrennt, damit keine widersprüchlichen Angaben wie `Munken Lynx 300 g · 350 g/m²` entstehen.
- Interne Produktionsdaten wie Bogenanzahl, Nutzenraster und Ausschießdetails werden im Angebot nicht mehr ausgegeben. Diese Daten bleiben für Auftrag, Produktion und Auftragstasche relevant, aber nicht für das Kundenangebot.
- Die Positionstabelle wurde erweitert um Einzelpreis netto, Gesamtpreis netto, Zwischensumme, 19 % Umsatzsteuer und Gesamtsumme brutto.
- Angebotsfließtext, Hinweise, Konditionen und Abschlussformel wurden kundengerechter formuliert.
- Die E-Mail-Vorbereitung verwendet jetzt den bereinigten Angebotstext inklusive Netto- und Bruttosumme.
- Der isolierte Druckfenster-Export aus Sprint 50.1 bleibt erhalten.
- Die Bottom-Navigation wurde nicht verändert.
- Keine echte Preislogik, keine Persistenz, keine Server-PDF-Erzeugung und keine automatische Mail-Anhang-Funktion; Sprint 50.2 verbessert ausschließlich Inhalt, Sprache und Darstellung des Angebotsdokuments.

Build-Prüfung: `npm run build`.

## Sprint 50.3 – Angebots-PDF auf eine Seite optimieren

- Der PDF-Test aus Sprint 50.2 zeigte, dass einfache Angebote noch auf eine zweite Seite umbrechen konnten, obwohl nur Abschluss, Grußformel und Footer betroffen waren.
- Die Angebotsausgabe wurde deshalb für DIN A4 Hochformat kompakter gesetzt:
  - kleinere Seitenränder im isolierten Druckfenster,
  - geringere vertikale Abstände,
  - kompakterer Kopfbereich,
  - kompaktere Leistungsübersicht,
  - kleinere Tabellen- und Konditionsabstände.
- Die Leistungsübersicht wurde von acht auf sechs kundenrelevante Felder reduziert. Projekt und Lieferung stehen weiterhin im Dokument, aber nicht mehr doppelt in der Übersicht.
- Die Positionstabelle nutzt feste Spaltenbreiten, damit Menge, Einzelpreis netto und Gesamtpreis netto sauberer stehen und die Tabellenköpfe weniger unschön umbrechen.
- Der Satz `Interne Produktionsdaten, Kostenblöcke und Margen sind nicht Bestandteil dieses Angebots.` wurde entfernt. Die Aussage bleibt intern fachlich richtig, gehört aber nicht in ein Kundendokument.
- Der Preistext wurde kundenfreundlicher und eindeutiger formuliert: Preise netto zuzüglich 19 % gesetzlicher Umsatzsteuer, Bruttosumme ausgewiesen.
- Ziel für einfache Standardangebote: eine A4-Seite, druckbar oder als PDF per E-Mail versendbar.
- Die Bottom-Navigation wurde nicht verändert.
- Keine echte Preislogik, keine Persistenz, keine Server-PDF-Erzeugung und keine automatische Mail-Anhang-Funktion; Sprint 50.3 optimiert ausschließlich Layout, Sprache und Druckausgabe des Angebotsdokuments.

Build-Prüfung: `npm run build`.

## Sprint 50.4 – Angebotsdokument finalisieren

- Das einseitige Angebots-PDF aus Sprint 50.3 wurde fachlich abgerundet, ohne den akzeptierten Angebotslook grundsätzlich zu verändern.
- Das Angebot enthält jetzt einen kompakten Absender-/Firmendatenblock im Kopfbereich. Aktuell sind dies Demo-/Platzhalterdaten; später sollen diese Daten aus den Einstellungen beziehungsweise Firmenstammdaten kommen.
- Der Angebotskopf zeigt zusätzlich den Angebotsstatus, zunächst als `Entwurf`.
- Im Reiter **Preise & Ergebnis** wurden Angebotsstammdaten sicht- und editierbar ergänzt:
  - Angebotsnummer,
  - Angebotsdatum,
  - Angebotsstatus,
  - Angebotsgültigkeit,
  - Zahlungsbedingungen,
  - eigene Firma,
  - eigene Adresse,
  - eigene Kontaktdaten,
  - eigene Website.
- Für den Demo-Fall wurde eine Plausibilitätswarnung ergänzt: Liegt der Liefertermin vor dem Angebotsdatum, weist die Angebotsbox darauf hin. Die Warnung blockiert das Angebot nicht, sondern macht das Datum prüfbar.
- Der vorbereitete E-Mail-Text wurde professioneller formuliert und an das Kundendokument angepasst. Die PDF wird weiterhin nicht automatisch angehängt; der Benutzer speichert sie über den Druckdialog und hängt sie im Mailprogramm an.
- Der Footer des Angebots enthält jetzt kompakte Firmendaten und die Angebotsnummer.
- Die Bottom-Navigation wurde nicht verändert.
- Keine echte Preislogik, keine Persistenz, keine Server-PDF-Erzeugung, keine automatische Mail-Anhang-Funktion und kein firmenseitiger Einstellungsdialog; Sprint 50.4 schließt die sichtbare Angebotsvorbereitung fachlich ab.

Build-Prüfung: `npm run build`.

## Sprint 51 – Dokumenten-Stammdaten vorbereiten

- Die Dokumentenlogik wurde fachlich vorbereitet, damit Kundendokumente später nicht mehr direkt aus hart codierten Demo-Werten in der Kalkulationsmaske gespeist werden.
- Neue zentrale Struktur: `src/features/documents/document-settings.ts`.
- Dort liegen zunächst Demo-Dokumentenstammdaten für:
  - Firmenname,
  - Adresse,
  - Telefon,
  - E-Mail,
  - Website,
  - Steuernummer,
  - Umsatzsteuer-ID,
  - Bankname,
  - IBAN,
  - BIC,
  - Standard-Zahlungsbedingungen,
  - Standard-Angebotsgültigkeit,
  - Dokumentenfuß,
  - Branding-Modus und Logo-Platzhalter.
- Das Angebotsdokument verwendet nun die zentralen Dokumenten-Stammdaten als Initialwerte und ist damit für spätere Dokumenteinstellungen vorbereitet.
- Für Kundendokumente wurde ein Firmenlogo-Platzhalter vorbereitet. Das PrintPilot-Logo bleibt App-/Software-Branding; Angebote und spätere Geschäftsdokumente sollen perspektivisch das Firmenlogo der jeweiligen Druckerei verwenden.
- Im Reiter **Preise & Ergebnis** wurden die vorbereiteten Dokumentenfelder erweitert:
  - Logo-Platzhalter,
  - Logo-Hinweis,
  - Umsatzsteuer-ID,
  - Steuernummer,
  - Bank,
  - IBAN,
  - BIC,
  - Dokumentenfuß.
- Die Umsatzsteuerberechnung nutzt den zentralen Dokumenten-Standardwert `taxRatePercent` statt einer isolierten 19-Prozent-Konstante im Angebotscode.
- E-Mail-Text, Angebotskopf und Angebotsfooter bleiben mit den zentralen Dokumentendaten gekoppelt.
- Die Bottom-Navigation wurde nicht verändert.
- Noch nicht enthalten: echter Logo-Upload, Persistenz der Dokumenteneinstellungen, Mandantenfähigkeit, Server-PDF-Erzeugung oder automatische E-Mail-Anhänge. Sprint 51 bereitet die Stammdatenstruktur und die spätere Einstellungsmaske vor.

Build-Prüfung: `npm run build`.

## Sprint 51.1 – Dokumentenplatzhalter und Footer kundentauglich bereinigen

- Der PDF-Test aus Sprint 51 zeigte, dass vorbereitete Platzhalterwerte zu sichtbar im Kundendokument standen, insbesondere `FIRMENLOGO später aus Dokumenteinstellungen` und `USt-ID später`.
- Platzhalterwerte mit `später`, `Platzhalter`, `placeholder`, `Firmenlogo` oder leeren Werten werden im Angebots-PDF jetzt nicht mehr ausgegeben.
- Wenn noch kein echtes Firmenlogo beziehungsweise kein echter Logo-Wert gepflegt ist, wird der Logo-Platzhalter im Kundendokument ausgeblendet. Die Absenderdaten bleiben sauber im Kopf sichtbar.
- Umsatzsteuer-ID und Steuernummer werden nur noch im Footer angezeigt, wenn echte Werte gepflegt sind. Reine Vorbereitungswerte erscheinen nicht mehr auf dem PDF.
- Die Demo-Dokumentenstammdaten enthalten für Steuernummer, Umsatzsteuer-ID, Bank, IBAN, BIC und Logo-Hinweis keine druckbaren `später`-Platzhalter mehr.
- Der Angebotsfooter wurde stabilisiert:
  - E-Mail-Adresse wird nicht mehr mitten im Wort getrennt,
  - Angebotsnummer bleibt zusammen,
  - Steuer-/Umsatzsteuerangaben erscheinen nur bei echten Werten,
  - Firmenzeile darf bei Bedarf sauber umbrechen.
- Die Bottom-Navigation wurde nicht verändert.
- Keine Persistenz, kein echter Logo-Upload und keine Server-PDF-Erzeugung; Sprint 51.1 bereinigt ausschließlich die Kundendokument-Ausgabe und die Demo-Stammdaten.

Build-Hinweis: In dieser Umgebung konnte `npm run build` nicht vollständig ausgeführt werden, weil die aus dem ZIP ausgeschlossenen `node_modules` fehlen. Bitte lokal nach dem Einspielen mit installiertem Projektstand wie gewohnt prüfen.

## Sprint 52 – Nutzenrechner in der Kalkulationsmaske ergänzen

- Vor dem Workflow **Kalkulation → Angebot → Auftrag** wurde die Kalkulationsmaske fachlich um einen echten, produktionsnahen Nutzenrechner erweitert.
- Der Reiter **Papier & Druck** enthält jetzt einen eigenen Bereich **Nutzenrechner**.
- Der Rechner arbeitet aktuell clientseitig aus den vorhandenen Kalkulationsdaten:
  - Auflage,
  - Endformat,
  - Druckbogenformat,
  - Beschnitt,
  - Bogenrand,
  - Zwischenschnitt,
  - Berechnungsbasis `Endformat` oder `inklusive Beschnitt`,
  - Drehregel `Drehung erlaubt`, `nur aufrecht` oder `nur gedreht`.
- Es werden aufrechte und gedrehte Varianten berechnet, verglichen und die beste Variante nach Nutzenanzahl und Flächenausnutzung empfohlen.
- Der Rechner zeigt jetzt:
  - bestes Raster,
  - Nutzen pro Druckbogen,
  - Flächenausnutzung,
  - Nettobogen,
  - netto produzierte Stückzahl,
  - Restmenge,
  - Zuschussbogen,
  - Bruttobogen,
  - Variantenvergleich.
- Die bisher statischen Demo-Werte für `Nutzen`, `Nettobogen` und `Bruttobogen` werden in der sichtbaren Maske nun aus dem Nutzenrechner abgeleitet.
- Die Übergabe an die Auftragstasche nutzt ebenfalls das berechnete Nutzenraster aus der Kalkulation.
- Wichtig: Dies ist noch keine echte Ausschieß-Engine und erzeugt noch keine produktionsfertigen Druckbogen-PDFs. Der Rechner ist ein sauberer Kalkulations-/Planungsrechner für wiederholte Nutzen auf einem Bogen. Die spätere Ausschieß-Engine bleibt ein eigener Produktionsschritt.
- Die Bottom-Navigation wurde nicht verändert.

Build-Prüfung: `npm run build`.

## Sprint 52.1 – Nutzenrechner mit getrennten X-/Y-Zwischenschnitten

- Der Nutzenrechner wurde praxisnäher an Fiery-ähnliche Einstellungen angelehnt.
- Der bisher gemeinsame Wert **Zwischenschnitt** wurde in zwei editierbare Achsen getrennt:
  - **Zwischenschnitt X-Achse** für den horizontalen Abstand zwischen den Nutzen,
  - **Zwischenschnitt Y-Achse** für den vertikalen Abstand zwischen den Nutzen.
- Die Nutzenberechnung berücksichtigt X- und Y-Zwischenschnitt getrennt:
  - Spalten werden mit dem X-Zwischenschnitt berechnet,
  - Reihen werden mit dem Y-Zwischenschnitt berechnet,
  - belegte Breite und belegte Höhe werden separat ermittelt.
- Die Empfehlung der besten Variante nutzt weiterhin Nutzenanzahl und Flächenausnutzung, basiert jetzt aber auf den getrennten Achsenwerten.
- Ergebnis, Variantenvergleich, Produktionsnotizen und Übergabe an die Auftragstasche zeigen den Zwischenschnitt jetzt als `X … / Y …`, wenn sich beide Werte unterscheiden. Bei gleichen Werten bleibt die Anzeige kompakt.
- Der vorhandene Altwert `impositionGapMm` bleibt als interner Fallback erhalten, damit bestehende Demo-/Altzustände nicht brechen.
- Dies bleibt ein Kalkulations-Nutzenrechner und noch keine echte Ausschieß-Engine mit produktionsfertigem Druckbogen-PDF.
- Die Bottom-Navigation wurde nicht verändert.

Build-Prüfung: `npm run build`.

### Sprint 52.2 – Nutzenrechner als eigener Reiter

- Der Nutzenrechner wurde aus dem Reiter **Papier & Druck** herausgelöst und als eigener Reiter **Nutzenrechner** zwischen **Papier & Druck** und **Weiterverarbeitung** platziert.
- **Papier & Druck** bleibt für Material, Maschine, Druckart und zusammenfassende Bogenwerte zuständig.
- Der neue Reiter **Nutzenrechner** ist als Arbeitsfläche aufgebaut: links die editierbaren Fiery-ähnlichen Einstellungen, rechts daneben die Druckbogen-/Nutzenanzeige.
- Editierbar bleiben insbesondere Druckbogenformat, Endformat, Bogenrand, Zwischenschnitt X-Achse, Zwischenschnitt Y-Achse, Berechnungsbasis und Drehregel.
- Die Ergebniswerte und Variantenübersicht bleiben im selben Reiter sichtbar, damit der Anwender Änderungen unmittelbar kontrollieren kann.
- Die Bottom-Navigation wurde nicht verändert.

### Sprint 52.3 – Nutzen & Ausschießen zusammenführen

- Der eigenständige Reiter **Nutzenrechner** wurde fachlich zu **Nutzen & Ausschießen** erweitert.
- Der Reiter bleibt die zentrale Arbeitsfläche für den Kalkulationsnutzen und bereitet gleichzeitig das spätere Imposing/Ausschießen vor.
- Die Reiterlogik ist damit klarer:
  - **Papier & Druck** bleibt für Material, Maschine, Druckart und zusammenfassende Bogenwerte zuständig.
  - **Nutzen & Ausschießen** ist für Druckbogenlayout, Nutzenberechnung und spätere Ausschießvorbereitung zuständig.
- Links bleibt die editierbare Fiery-ähnliche Steuerung mit Druckbogen, Endformat, Bogenrand, Zwischenschnitt X-Achse, Zwischenschnitt Y-Achse, Berechnungsbasis und Drehregel.
- Rechts daneben bleibt die Druckbogen-/Nutzenanzeige sichtbar, damit Änderungen unmittelbar kontrolliert werden können.
- Zusätzlich wurde ein vorbereiteter Bereich **Ausschießplan / Imposing** ergänzt. Er zeigt bewusst noch keinen produktionsfertigen PDF-Export, sondern markiert die nächste fachliche Ausbaustufe:
  - Stand / Anlage,
  - Vorderseite / Rückseite,
  - Marken,
  - spätere Funktion **Druckbogen erzeugen**.
- Die eigentliche Ausschieß-Engine und die Erzeugung produktionsfertiger Druckbogen-PDFs bleiben ein späterer, eigener Produktionssprint.
- Die Bottom-Navigation wurde nicht verändert.

Build-Prüfung: `npm run build`.

### Sprint 53 – Systemhinweise aus Arbeitsmasken entfernen

- Die Kalkulationsmaske wurde nach dem Prinzip **Normalzustand = ruhig, Abweichungen = sichtbar** bereinigt.
- Dauerhafte System-/Prüfhinweise werden in der sichtbaren Arbeitsmaske nicht mehr permanent angezeigt:
  - keine sichtbare Übergabeprüfung,
  - kein dauerhaftes „noch nicht gespeichert“,
  - keine technische Feldzuordnung zur Auftragstasche,
  - keine dauerhafte Bereitschaftsstatusleiste.
- Interne Prüfungen und Mapping-Strukturen bleiben im Code vorbereitet, sind aber aus dem normalen Arbeitsfluss ausgeblendet.
- Aktionen wie **Angebot anzeigen**, **Angebot als PDF drucken**, **E-Mail vorbereiten** und **Auftragsentwurf erzeugen** bleiben sichtbar und lösen bei fehlenden Pflichtdaten eine gezielte Warnmeldung aus.
- Die Reiter zeigen nur noch offene Pflichtfelder an. Ein normaler OK-Zustand wird nicht mehr als zusätzlicher Text angezeigt.
- Die rechte Ergebnisleiste wurde beruhigt: sichtbar bleiben Produktionsdaten, Preisabschluss und die wichtigsten Aktionen. Technische Übergabedetails sind ausgeblendet.
- Die Angebotserzeugung bleibt unverändert funktionsfähig; Lieferterminwarnungen erscheinen weiterhin nur bei tatsächlicher Plausibilitätsabweichung.
- Die Bottom-Navigation wurde nicht verändert.

Build-Hinweis: In dieser Umgebung konnte `npm run build` nicht vollständig ausgeführt werden, weil im ZIP die installierten `node_modules` fehlen (`vite/client` und `node` Typdefinitionen nicht vorhanden). Bitte lokal nach dem Einspielen mit installiertem Projektstand prüfen.

### Sprint 53.1 – Pflicht-/Optional-/Später-Badges aus Arbeitsmasken entfernen

- Die dauerhaften Feld-Badges **Pflicht**, **optional** und **später** werden in der Kalkulationsmaske nicht mehr sichtbar gerendert.
- Die fachliche Einstufung der Felder bleibt intern im Code erhalten, damit Validierung und Aktionsprüfung weiterhin sauber funktionieren.
- **Optionale Felder** werden nicht mehr als solche beschriftet. Ein Feld ohne Warnung ist im Normalzustand einfach ein normales Eingabefeld.
- **Später-Felder** werden nicht mehr als Entwicklungsstatus im Arbeitsfluss markiert. Entwicklungs-/Roadmap-Informationen gehören in die Dokumentation oder spätere Admin-/Einstellungsbereiche, nicht dauerhaft in die Maske.
- **Pflichtfelder** werden nicht mehr permanent mit einem Badge markiert. Erst wenn der Anwender eine Aktion auslöst und Pflichtangaben fehlen, werden die fehlenden Pflichtfelder gezielt und ruhig hervorgehoben.
- Die vorhandenen Warn-Dialoge für Angebotserzeugung und Auftragsentwurf bleiben der primäre Hinweisweg. Die Maske bleibt im Normalzustand visuell ruhig.
- Die akzeptierte Eingabemasken-Optik bleibt erhalten: weiße Labels mit Cyan-Schrift, weiße Eingabefelder mit feiner Cyan-Umrandung und aktive Tabs vollflächig in PrintPilot-Cyan.
- Die Bottom-Navigation wurde nicht verändert.

Build-Hinweis: In dieser Umgebung konnte `npm run build` nicht vollständig ausgeführt werden, weil die lokalen Typdefinitionen aus `node_modules` fehlen (`vite/client` und `node`). Bitte lokal nach dem Einspielen mit installiertem Projektstand prüfen.

### Sprint 53.2 – Aktionsbezogene Validierung vereinheitlichen

- Die ruhige Maskenlogik aus Sprint 53/53.1 bleibt erhalten: Im Normalzustand werden keine Pflicht-/Optional-/Später-Badges und keine dauerhaften Prüfhinweise angezeigt.
- Die Validierung ist jetzt aktionsbezogen statt nur global:
  - **Angebot anzeigen** prüft die für ein Angebot notwendigen Felder.
  - **Angebot als PDF drucken** nutzt dieselbe Angebotsprüfung.
  - **E-Mail vorbereiten** prüft zusätzlich die E-Mail-Adresse des Ansprechpartners.
  - **Auftragsentwurf erzeugen** prüft die auftragsrelevanten Felder.
- Fehlende Felder werden erst nach der jeweiligen Aktion gezielt markiert. Dadurch bleibt die Maske ruhig, aber die Logik greift bei jeder fachlichen Aktion.
- Nach einer fehlgeschlagenen Aktion springt PrintPilot zum ersten Reiter mit fehlender Angabe. Reiter zeigen offene Felder nur nach einer ausgelösten Validierung an.
- Die Feldmarkierung arbeitet jetzt über konkrete Feldnamen statt über sichtbare Badge-Texte. Die frühere interne Einstufung bleibt für die Validierungslogik nutzbar, wird aber nicht mehr im UI gerendert.
- **Verkaufspreis netto** wird als Angebotsfeld sauber geprüft und markiert, obwohl kein sichtbares Pflicht-Badge mehr angezeigt wird.
- **Bottom-Navigation nicht angefasst.**

Build-Prüfung: `npm run build`.

### Sprint 53.3 – Validierungsdialog als Software-Popup

- Die aktionsbezogene Validierung aus Sprint 53.2 nutzt jetzt keinen nativen Browser-Alert mehr.
- Fehlende Pflichtangaben und technische Aktionsprobleme werden in einem softwareeigenen PrintPilot-Dialog angezeigt.
- Der Dialog folgt der ruhigen Eingabemasken-Optik: weißes Panel, dezente Linien, PrintPilot-Cyan als Aktionsfarbe und nur bei echten Problemen eine warme Warnmarkierung.
- Die Maske bleibt weiterhin im Normalzustand ruhig. Der Dialog erscheint nur nach einer ausgelösten Aktion, wenn etwas fehlt oder eine Aktion technisch nicht ausgeführt werden kann.
- Die vorhandene Feldmarkierung und der Sprung zum ersten Reiter mit fehlender Angabe bleiben erhalten.
- Die Dialoge wurden für folgende Fälle umgestellt:
  - Angebot kann noch nicht erzeugt werden,
  - Angebots-E-Mail kann noch nicht vorbereitet werden,
  - Auftrag kann noch nicht vorbereitet werden,
  - Angebotsdokument ist noch nicht bereit,
  - Druckfenster wurde vom Browser blockiert.
- Browser-eigene Dialoge werden für diese Validierung nicht mehr verwendet.
- **Bottom-Navigation nicht angefasst.**

Build-Hinweis: Bitte lokal nach dem Einspielen mit installiertem Projektstand `npm run build` ausführen.

### Sprint 53.4 – Validierungs-Popup zuverlässig als Overlay rendern

- Der softwareeigene Validierungsdialog aus Sprint 53.3 wird jetzt per React-Portal direkt am Dokument-Body gerendert.
- Dadurch hängt der Dialog nicht mehr im normalen Seitenfluss der Kalkulationsmaske und erscheint nicht mehr als ungestylter Block unterhalb der Arbeitsmaske.
- Zusätzlich wurden die wichtigsten Overlay-/Panel-/Button-Stile direkt am Dialog abgesichert, damit das Popup auch dann korrekt sichtbar bleibt, wenn CSS-Reihenfolge oder Browser-Cache die Klassen verspätet laden.
- Der Dialog bleibt fachlich unverändert:
  - erscheint nur nach aktionsbezogener Validierung,
  - zeigt fehlende Pflichtangaben gezielt,
  - Feldmarkierung und Sprung zum betroffenen Reiter bleiben erhalten.
- **Bottom-Navigation nicht angefasst.**

Build-Hinweis: Bitte lokal nach dem Einspielen mit installiertem Projektstand `npm run build` ausführen.

### Sprint 53.5 – Validierungsdialog produktiver machen

- Der Validierungsdialog bleibt ein softwareeigenes Overlay und wird weiterhin nur nach einer ausgelösten Aktion angezeigt.
- Die Liste der fehlenden Angaben ist jetzt interaktiv: Ein Klick auf einen fehlenden Punkt springt zum zuständigen Reiter und fokussiert das betroffene Feld.
- Der Hauptbutton wurde von **Angaben prüfen** zu **Zum ersten fehlenden Feld** präzisiert.
- Die fehlenden Angaben werden weiterhin ruhig und kompakt angezeigt, aber ohne störende Überlagerung durch das Warnsymbol.
- Das bisherige Icon-/Pseudo-Element im Dialog wurde so bereinigt, dass Markierung und Text sauber getrennt bleiben.
- Die Feldmarkierung in der Maske bleibt unverändert: fehlende Pflichtfelder werden erst nach einer passenden Aktion gezielt hervorgehoben.
- **Bottom-Navigation nicht angefasst.**

Build-Hinweis: Bitte lokal nach dem Einspielen mit installiertem Projektstand `npm run build` ausführen.

### Sprint 54 – Nutzenrechner und Spezialmodule trennen

- Die Reiterstruktur der Kalkulationsmaske wurde fachlich neu geordnet.
- Der bisherige Reiter **Nutzen & Ausschießen** wurde wieder getrennt:
  - **04 Nutzenrechner** bleibt das Kalkulationswerkzeug für Nutzen, Bogenanzahl, Zuschuss und Materialverbrauch.
  - **08 Impose / Ausschießen** wird als eigenes produktionsnahes Modul vorbereitet.
- Die Reiterfolge lautet jetzt:
  1. Kunde & Auftrag
  2. Produkt & Format
  3. Papier & Druck
  4. Nutzenrechner
  5. Weiterverarbeitung
  6. Fremdproduktion
  7. Preise & Ergebnis
  8. Impose
  9. Lettershop
  10. Großformat
- Der Nutzenrechner enthält keine sichtbaren Ausschieß-/Impose-Hinweise mehr. Er konzentriert sich auf Druckbogen, Endformat, Bogenrand, Zwischenschnitt X/Y, Berechnungsbasis, Drehung, Nutzen, Flächenausnutzung, Nettobogen, Zuschuss und Bruttobogen.
- Die Anzeige bleibt neben der editierbaren Steuerung: links Eingabeparameter, rechts Druckbogen-/Nutzenvorschau, darunter Ergebnis und Variantenvergleich.
- Die neuen Reiter **Impose**, **Lettershop** und **Großformat** sind als ruhige Modulbereiche vorbereitet, ohne Pflicht-/Optional-/Später-Badges und ohne permanente Systemhinweise.
- Impose wird später die echte Druckbogen-Erzeugung, Stand/Anlage, Vorderseite/Rückseite, Marken und produktionsfertige PDFs übernehmen.
- Lettershop wird später Adressdaten, Personalisierung, Porto, Sortierung, Kuvertierung und Einlieferung bündeln.
- Großformat / Plotter wird später Rollenmaterial, Laufmeter, Konturschnitt, Laminat, Montage und Nesting abbilden.
- Die Validierungslogik aus Sprint 53.5 bleibt unverändert: Hinweise erscheinen nur als softwareeigenes Popup bei Problemen.
- **Bottom-Navigation nicht angefasst.**

Build-Prüfung: `npm run build`.

## Sprint 54.1 – Kalkulation: Statuszeile und Produktionskern entfernen

- Die untere Status-/Bereitschaftszeile in der Kalkulationsmaske wurde entfernt.
- Plausibilitätsprüfungen und Pflichtfeldprüfungen bleiben intern und erscheinen nur noch über den Validierungsdialog aus Sprint 53.5.
- Der dauerhafte rechte/untere „Produktionskern“ wurde aus der Arbeitsmaske entfernt, weil die dort gezeigten Informationen bereits in den jeweiligen Reitern fachlich gepflegt werden.
- Angebots- und Auftragsaktionen bleiben im Reiter „Preise & Ergebnis“ sichtbar.
- Aktionsbuttons sind dort nicht mehr vollbreit, sondern als kompakte Buttonzeile ausgeführt.
- Die Bottom-Navigation bleibt unverändert.

## Sprint 55 – Nutzenrechner fachlich ausbauen

- Der Reiter **04 Nutzenrechner** bleibt ein reines Kalkulationswerkzeug und wurde fachlich weiter ausgebaut.
- Der Nutzenrechner kann jetzt neben der automatischen Bestvariante auch ein manuelles Raster verwenden.
- Neue Eingaben:
  - **Rastermodus**: automatisch beste Variante oder Raster manuell festlegen.
  - **Manuelle Spalten**.
  - **Manuelle Reihen**.
- Bei manuellem Raster wird geprüft, ob das gewünschte Raster mit Bogenrand, Berechnungsformat und X-/Y-Zwischenschnitt auf den Druckbogen passt.
- Passt das manuelle Raster nicht, bleibt die Berechnung stabil und die Variantenübersicht zeigt den Hinweis, ohne die restliche Kalkulationsmaske mit permanentem Systemrauschen zu belasten.
- Die Vorschau wurde hochauflösender/feiner dargestellt:
  - größere Druckbogenfläche im Reiter,
  - korrektes Seitenverhältnis über das Druckbogenformat,
  - feinere Raster-/Randdarstellung,
  - sichtbarer nutzbarer Bereich,
  - schärfere Nutzenkacheln mit dezenten Innenlinien.
- Ergebniswerte bleiben im Nutzenrechner sichtbar: Nutzen, Ausnutzung, Nettobogen, Restmenge, Zuschussbogen und Bruttobogen.
- Keine echte Ausschieß-Engine und kein produktionsfertiges Druckbogen-PDF in diesem Sprint. Das bleibt Aufgabe des separaten Moduls **08 Impose**.
- Validierungsdialog und Bottom-Navigation bleiben unverändert.

Build-Hinweis: Bitte lokal nach dem Einspielen mit installiertem Projektstand `npm run build` ausführen.

## Sprint 55.1 – Nutzenvorschau bei manuellem Raster korrekt skalieren

- Die Druckbogen-Vorschau im Reiter **04 Nutzenrechner** wurde von einer reinen CSS-Rasterfüllung auf eine physikalisch skalierte Darstellung umgestellt.
- Manuelle Raster wie **3 × 3** werden jetzt nicht mehr über die komplette Bogenfläche gestreckt.
- Jeder Nutzen wird anhand seiner realen Breite/Höhe relativ zum Druckbogen positioniert.
- Bogenrand, X-Zwischenschnitt und Y-Zwischenschnitt fließen in die Vorschaupositionierung ein.
- Restfläche bleibt sichtbar und wird nicht mehr durch gedehnte Nutzenkacheln kaschiert.
- Die Vorschau bleibt weiterhin rein kalkulatorisch und erzeugt kein produktionsfertiges Ausschieß-PDF.
- **08 Impose** bleibt das spätere Modul für echte Druckbogenerzeugung, Marken, Stand/Anlage und PDF-Ausgabe.
- Validierungsdialog und Bottom-Navigation bleiben unverändert.

Build-Hinweis: Bitte lokal nach dem Einspielen mit installiertem Projektstand `npm run build` ausführen.

## Sprint 55.2 – Nutzenvorschau auf dem Druckbogen zentrieren

- Die Nutzenvorschau im Reiter **04 Nutzenrechner** wird jetzt innerhalb der nutzbaren Druckbogenfläche zentriert.
- Manuelle Raster wie **3 × 3** kleben nicht mehr oben links am Bogenrand.
- Die physikalische Skalierung aus Sprint 55.1 bleibt erhalten: Nutzen werden weiterhin in realer Größe relativ zum Druckbogen dargestellt.
- Bogenrand, Zwischenschnitt X-Achse und Zwischenschnitt Y-Achse werden weiterhin in der Positionierung berücksichtigt.
- Die sichtbare Restfläche verteilt sich bei kleineren manuellen Rastern links/rechts und oben/unten gleichmäßig.
- **08 Impose** bleibt weiterhin ein separates späteres Produktionsmodul; der Nutzenrechner bleibt Kalkulationswerkzeug.
- Bottom-Navigation bleibt unverändert.


## Sprint 55.3 – Nutzenrechner-Eingabe verbessern

Der Nutzenrechner wurde in der Eingabe ergonomisch verfeinert. Ziel ist, die Fiery-ähnlichen Parameter klarer und ohne abgeschnittene Werte zu bedienen.

- Druckbogen und Endformat werden nicht mehr als zusammengequetschte Textfelder dargestellt, sondern jeweils in Breite und Höhe getrennt.
- Bogenrand sowie Zwischenschnitt X/Y zeigen die Einheit direkt am Feld.
- Manuelle Spalten und manuelle Reihen bleiben als direkte Eingabewerte erhalten.
- Berechnungsbasis, Drehung und Rastermodus werden als klare Auswahlbuttons statt schmaler Dropdowns angezeigt.
- Der Ergebnisbereich zeigt den Zwischenschnitt ausdrücklich als X/Y-Wert.
- Die Nutzenvorschau bleibt physikalisch skaliert und zentriert aus Sprint 55.1/55.2.
- Impose/Ausschießen bleibt weiterhin ein separates späteres Modul; der Nutzenrechner bleibt Kalkulationswerkzeug.
- Die Bottom-Navigation wurde nicht verändert.

## Sprint 55.4 – Nutzenrechner-Eingabe nach Split-Feldern stabilisieren

- Die in Sprint 55.3 eingeführten getrennten Breite-/Höhe- und Auswahlfelder wurden layoutseitig stabilisiert.
- `fieldset`-/`legend`-Darstellung im Nutzenrechner wurde ersetzt, damit Browser-Defaults die Eingabezeilen nicht mehr zerreißen.
- Druckbogen, Endformat, Bogenrand, Zwischenschnitt X/Y, manuelle Spalten/Reihen und Auswahlfelder stehen wieder sauber untereinander im linken Bedienbereich.
- Auswahlbuttons für Berechnungsbasis, Drehung und Rastermodus bleiben vollständig lesbar und werden nicht mehr über Ergebnis-/Vorschaukarten gelegt.
- Die Druckbogen-Vorschau rechts bleibt daneben sichtbar; physikalische Skalierung und Zentrierung aus Sprint 55.1/55.2 bleiben erhalten.
- Keine Änderung an der Bottom-Navigation.

## Sprint 55.5 – Nutzenrechner-Steuerung stabilisieren

- Die Eingabesteuerung im Reiter **04 Nutzenrechner** wurde nach Sprint 55.4 nochmals stabilisiert.
- Die Felder **Druckbogen**, **Endformat**, **Bogenrand**, **Zwischenschnitt X/Y**, **Manuelle Spalten/Reihen**, **Berechnungsbasis**, **Drehung** und **Rastermodus** werden wieder vollständig sichtbar dargestellt.
- Die Steuerung ist jetzt als robuste Zeilenmatrix aufgebaut, damit keine Eingabefelder oder Auswahlbuttons mehr ineinanderlaufen.
- Die Druckbogen-Vorschau bleibt rechts daneben und behält physikalische Skalierung sowie Zentrierung aus Sprint 55.1/55.2.
- **Bottom-Navigation unverändert.**

## Sprint 55.6 – Nutzenrechner kompakter verdichten

- Die Steuerung im Reiter **04 Nutzenrechner** wurde kompakter aufgebaut, damit die Eingabefelder weniger vertikalen Platz einnehmen.
- Druckbogen, Endformat, Bogenrand, Zwischenschnitt X/Y, manuelle Spalten/Reihen sowie Auswahlfelder bleiben vollständig sichtbar, werden aber als kompaktere Kartenmatrix geführt.
- Der bisher große Kasten **Beste Variante** wurde entfernt und mit der Variantenübersicht kombiniert.
- Die Variantenübersicht enthält jetzt oben die empfohlene beziehungsweise manuelle Variante als kurze Zusammenfassung und darunter die Vergleichstabelle.
- Ergebniskennzahlen wie Druckbogen, Zwischenschnitt, Rastermodus, Nettobogen, Restmenge, Zuschussbogen und Bruttobogen werden kompakter als Kennzahlenleiste dargestellt.
- Die physikalische Vorschau, reale Skalierung und Zentrierung aus Sprint 55.1/55.2 bleiben erhalten.
- Keine Änderung an der Bottom-Navigation.

### Sprint 55.7 – Nutzenrechner Feinschliff

- Die linke Nutzenrechner-Steuerung wurde weiter verdichtet.
- Zahlenfelder für Bogenrand, Zwischenschnitt und manuelles Raster sind flacher und nehmen weniger Platz ein.
- Auswahlbuttons bleiben vollständig lesbar, sind aber kompakter.
- Die Druckbogen-Vorschau bleibt groß, wirkt durch dezenteres Hintergrundraster aber ruhiger.
- Die Kennzahlenleiste wurde leicht kompakter gesetzt.
- „Beste Variante“ und Variantenvergleich bleiben in einem gemeinsamen Bereich; der separate große Ergebnisraum wird nicht wieder eingeführt.
- Die physikalische Skalierung und Zentrierung des manuellen Rasters bleiben unverändert.
- Bottom-Navigation unverändert.

## Sprint 55.8 – Nutzenrechner-Eingaben entklobigen

Die Eingabefelder im Reiter **04 Nutzenrechner** wurden nochmals verdichtet. Ziel ist eine klare Arbeitszeilen-Logik statt großer Touch-/Kachel-Felder.

- linke Steuerung als kompakte Zeilen aufgebaut
- Zahlenfelder für Bogenrand, Zwischenschnitt X/Y und manuelles Raster flacher gesetzt
- Druckbogen- und Endformatfelder bleiben getrennt nach Breite/Höhe, wirken aber weniger massiv
- Einheiten bleiben sichtbar, nehmen aber weniger Raum ein
- Auswahlbuttons für Berechnungsbasis, Drehung und Rastermodus kompakter gesetzt
- Druckbogen-Vorschau rechts bleibt groß und unverändert physikalisch skaliert
- keine Logikänderung, keine Impose-Engine, Bottom-Navigation unverändert

## Sprint 55.9 – Nutzenrechner als kompaktes Werkzeugpanel

Die linke Eingabe im Reiter **04 Nutzenrechner** wurde nicht nur verkleinert, sondern als technisches Werkzeugpanel neu verdichtet. Ziel ist eine deutlich weniger klobige Bedienfläche mit mehr Raum für die Druckbogen-Vorschau.

- linkes Bedienpanel weiter verschmälert und als kompakte Einstellmatrix geführt
- Zeilenhöhe der Eingabeparameter reduziert
- Labelspalte, Zahlenfelder und Einheiten deutlich platzsparender gesetzt
- Druckbogen und Endformat bleiben als Breite/Höhe steuerbar, wirken aber nicht mehr wie große Kacheln
- Bogenrand, Zwischenschnitt X/Y und manuelle Spalten/Reihen laufen als schlanke Arbeitszeilen
- Auswahlbuttons für Berechnungsbasis, Drehung und Rastermodus als kompakte Segmente geführt
- Druckbogen-Vorschau rechts bleibt groß und unverändert physikalisch skaliert und zentriert
- keine Änderung an Nutzenberechnung, Variantenlogik, Impose-Modul oder Bottom-Navigation

## Sprint 55.10 – Nutzenrechner-Steuerung oberhalb der Vollbreiten-Vorschau

- Der Reiter **04 Nutzenrechner** führt die Bedienung nicht mehr links neben der Vorschau.
- Die Steuerung sitzt jetzt als kompakte Werkzeugleiste oberhalb der Druckbogen-Vorschau.
- Die Druckbogen-Vorschau nutzt darunter die volle verfügbare Breite und bleibt hochauflösend/physikalisch skaliert.
- Der Erklärungskasten **„Nutzenplan einrichten“** wurde entfernt, weil dauerhafte Erklär- und Systemhinweise in Arbeitsmasken vermieden werden.
- Rechenlogik, Zentrierung, Variantenlogik, Validierungsdialog und Bottom-Navigation bleiben unverändert.

## Sprint 55.11 – Nutzenrechner als Profi-Toolbar verdichten

- Die Steuerung im Reiter **04 Nutzenrechner** wurde nochmals von Eingabe-Karten zu einer flachen Werkzeugleiste verdichtet.
- Die Toolbar nutzt zwei kompakte Zeilen: oben Format-, Rand-, Zwischenschnitt- und Rasterwerte; darunter Berechnungsbasis, Drehung und Rastermodus.
- Eingabefelder, Einheiten und Auswahlsegmente sind deutlich flacher, damit die Druckbogen-Vorschau früher sichtbar wird.
- Die Druckbogen-Vorschau bleibt über die volle verfügbare Breite angelegt und erhält ein nochmals dezenteres Hintergrundraster.
- Der Bereich bleibt frei von Erklärungskästen, Statusrauschen, Pflicht-/Optional-Badges und dauerhaften Systemhinweisen.
- Keine Änderung an Nutzenberechnung, physikalischer Skalierung, Zentrierung, Variantenlogik, Impose-Modul oder Bottom-Navigation.

## Sprint 55.12 – Nutzenrechner-Toolbar neu strukturieren

- Die Toolbar im Reiter **04 Nutzenrechner** wurde nicht weiter zusammengedrückt, sondern als saubere Inline-Werkzeugleiste neu aufgebaut.
- Formatwerte laufen jetzt als kompakte technische Controls: **Druckbogen 450 × 320 mm**, **Endformat 85 × 55 mm**, **Rand**, **Schnitt X/Y** und **Raster**.
- Berechnungsbasis, Drehung und Rastermodus werden als schlanke Segment-Controls geführt.
- Die Werte bleiben lesbar; die Toolbar wirkt weniger wie Touch-/Kachel-UI und mehr wie ein Profi-Werkzeug.
- Der Vorschaubogen wird optisch ca. 25 % kleiner dargestellt, bleibt aber hochauflösend und physikalisch korrekt skaliert.
- Rechenlogik, Variantenlogik, Zentrierung, Impose-Modul, Validierungsdialog und Bottom-Navigation bleiben unverändert.

# PrintPilot Next UI

## Stand: Design Sprint 11

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


## Design Sprint 19 – Maschinenkarte responsiv beruhigt

- Die Maschinenkarte wurde für unterschiedliche Fensterbreiten robuster aufgebaut.
- Auf breiteren Ansichten bleibt die Darstellung zweispaltig mit Illustration links und Maschinendaten rechts.
- Auf schmaleren Ansichten wechselt die Karte automatisch in eine einspaltige Darstellung mit Bild oben und Daten darunter.
- Die vorherigen Mini-Meta-Kacheln für Typ, Standort und Service wurden entfernt, damit die Karte weniger kleinteilig wirkt.
- Typ und Standort erscheinen jetzt als ruhige Textzeile unter dem Maschinennamen; der letzte Service steht als dezente Servicezeile darunter.
- Status-Badge und technische Merkmale bleiben erhalten, sind aber weniger dominant und dürfen sauber umbrechen.
- Header, Footer, Logo, Top-Info-Bereich und übrige Karten wurden nicht verändert.

## Design Sprint 20 – Maschinenkarte und Verlauf beruhigt

- Die Maschinenkarte wurde weiter stabilisiert: Der Status-Badge sitzt jetzt unter dem Maschinennamen statt rechts daneben.
- Der Maschinenname bekommt dadurch mehr nutzbare Breite und bricht auf schmaleren Karten ruhiger um.
- Typ, Standort, Status, technische Merkmale und Service bleiben erhalten, wirken aber weniger gequetscht.
- Die Karte bleibt responsiv: Bild und Daten können weiterhin je nach Fensterbreite ein- oder zweispaltig erscheinen.
- Der Bereich `Kommentare / Verlauf` wurde von einer tabellarischen Darstellung auf eine kompakte Timeline umgestellt.
- Zeit, Datum, Ereignis und Benutzer sind klarer gruppiert; die Timeline ist bei schmaleren Fenstern robuster.
- Header, Footer, Top-Info-Bereich und übrige Karten wurden nicht verändert.

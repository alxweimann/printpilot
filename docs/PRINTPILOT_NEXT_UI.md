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

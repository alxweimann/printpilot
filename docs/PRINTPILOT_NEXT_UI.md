# PrintPilot Next UI

## Stand: Design Sprint 9

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

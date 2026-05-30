# PrintPilot – Übergabe für neues Chat-Fenster

Stand: nach dem Block **Auftragsdrawer Blocker-/Produktionsprüfung**  
Branch: `restart-designsystem`  
Projektordner lokal: `C:\printpilot`

## Aktueller gepushter Stand

### Dashboard / Plantafel

Umgesetzt und gepushed:

- echte Kennzahlen oben
- sechs Kennzahlenkarten mit konsistenter Farblogik: Angebote grün, Aufträge lila, Versand gelb, Rechnungen blau, Mahnungen magenta, Material orange
- Bereich **Handlungsbedarf** über volle Breite
- Deep-Link aus Handlungsbedarf in passende Drawer
- Plantafel als Wochen-/Tageszeilenansicht
- Aufbau der Plantafel:
  - Überfällig
  - Montag
  - Dienstag
  - Mittwoch
  - Donnerstag
  - Freitag
- Tage stehen untereinander
- Aufträge stehen rechts daneben als Mini-Karten
- Mini-Karten sind kompakt und ruhig
- Mini-Karten haben einheitliche Wirkung
- Fortschrittsbalken sind sichtbar und etwas kräftiger
- Blocker-Hinweis bleibt sichtbar
- Typografie der Plantafel und des Handlungsbedarfs ist beruhigt
- Plantafel zeigt konkrete Produktionsschritte aus `handoff` statt nur den Sammelstatus `In Produktion`

### Aufträge

Umgesetzt und gepushed bzw. in diesem Paket enthalten:

- Produktionsstatus-Panel im Auftragsdrawer
- Statuskarten im Bereich **Produktion**:
  - Status
  - Freigabe
  - Übergabe
  - Fällig
- Schnellaktionen als farbige Pill-Buttons:
  - Freigabe erteilt
  - Daten fehlen
  - In Druck
  - Weiterverarbeitung
  - Abholbereit
  - Fertig
- Schnellaktionen setzen Status/Handoff fachlich nach:
  - Daten fehlen → `approval = Daten unvollständig`, `handoff = Wartet auf Daten`, `status = Wartet`
  - In Druck → `handoff = In Druck`, `status = In Produktion`
  - Weiterverarbeitung → `handoff = In Weiterverarbeitung`, `status = In Produktion`
  - Abholbereit → `handoff = Abholbereit`, `status = In Produktion`
  - Fertig → `handoff = Abgeschlossen`, `status = Fertig`
- Produktionsprüfung im Drawer ergänzt:
  - fehlender Kunde
  - fehlendes Produkt
  - fehlende Fälligkeit
  - fehlende Freigabe bei produktionsrelevantem Auftrag
  - fehlende Maschine bei produktionsrelevantem Auftrag
  - Daten unvollständig / wartet auf Druckdaten
- aktive Schnellaktion wird optisch markiert
- Dropdowns bleiben darunter erhalten

### Dokumentation

Die konsolidierten Doku-Dateien wurden weitergeführt:

- `docs/PROJECT_STATE.md`
- `docs/ROADMAP.md`
- `docs/WORKFLOWS.md`
- `docs/UI_STANDARDS.md`
- `docs/PRINTPILOT_HANDOFF_NEXT_WINDOW.md`

## Wichtige technische Hinweise

### Build/Test

Nach jedem neuen Block ausführen:

```cmd
cd C:\printpilot
npm run build
npm run dev
```

Danach Browser hart neu laden:

```txt
Strg + F5
```

### Git-Workflow

Nach erfolgreichem Test:

```cmd
git status
git add .
git commit -m "<sinnvolle Commit Message>"
git push
```

### ZIP für weitere Arbeit

```cmd
cd C:\printpilot
del printpilot-current-full.zip
powershell Compress-Archive -Path .\src,.\docs -DestinationPath .\printpilot-current-full.zip -Force
```

## Nächster sinnvoller Schritt

Nach diesem Block bitte zuerst im Browser testen:

1. Auftrag öffnen.
2. Bearbeitung aktivieren.
3. Schnellaktion **Daten fehlen** klicken.
4. Prüfen, ob die Produktionsprüfung den Blocker klar zeigt.
5. Speichern.
6. Dashboard öffnen und Plantafel prüfen.
7. Danach **Freigabe erteilt**, **In Druck**, **Weiterverarbeitung**, **Abholbereit** und **Fertig** jeweils prüfen.

Aktueller Zusatz: Die Plantafel zeigt jetzt zusätzlich zum konkreten Produktionsschritt auch den Freigabestand als kompakte Meta-Pill. Bitte besonders prüfen, ob `Freigabe ok`, `Freigabe fehlt` und `Daten unvollständig` in den Mini-Karten fachlich richtig und optisch ruhig angezeigt werden.

Wenn das passt, kann als nächstes entweder der Auftragsdrawer optisch weiter geglättet oder der nächste Funktionsblock begonnen werden.
Aktueller Zusatz: Die Produktions-Schnellaktionen im Auftragsdrawer sind jetzt ruhiger. Inaktive Schritte sind neutral, nur Hover und aktiver Zustand verwenden die fachliche Farbe. Bitte besonders prüfen, ob die aktive Aktion klar genug ist und die Button-Reihe nicht mehr zu bunt wirkt.

- Schnellaktionen im Auftragsdrawer sind beruhigt und verwenden wieder lesbare einzeilige Labels ohne zusammengeschobene Wörter.

## Letzter Stand
Schnellaktionsbuttons im Auftragsdrawer sind nicht mehr komplett rund, sondern entsprechen optisch den unteren Drawer-Buttons. Nächster sinnvoller Schritt: finaler Sichttest des Drawers und anschließend nächster Funktionsblock.

## Letzter Stand – Auftragsdrawer finaler Layout-Check
Der aktuelle Stand enthält den finalen Layout-Feinschliff für den Produktionsbereich im Auftragsdrawer. Statuskarten, Produktionsprüfung und Schnellaktionen sind kompakter und ruhiger. Die Schnellaktionen haben eine eigene Überschrift und verwenden denselben moderaten Button-Radius wie die übrigen Buttons. Keine Änderung an der fachlichen Statuslogik.

## Letzter Stand – Auftragsliste Status-/Freigabeanzeige
Die Auftragsliste zeigt jetzt neben der Freigabe auch den konkreten Übergabeschritt und einen fachlichen Status. Dadurch sind `Weiterverarbeitung`, `Abholbereit`, `Daten fehlen`, `Freigabe ok` usw. direkt in der Liste sichtbar. Die interne Logik bleibt unverändert: `Abholbereit` bleibt `In Produktion`, `Fertig` entfernt den Auftrag aus der offenen Plantafel.

## Update: Auftragsliste Statuslabel In Produktion

- Das Statuslabel `Offene Plantafel` wurde zurückgenommen, weil es fachlich missverständlich war.
- `status = In Produktion` wird in Drawer und Auftragsliste wieder als `In Produktion` angezeigt.
- Der konkrete Produktionsschritt bleibt separat über `Übergabe` sichtbar, z. B. `In Druck`, `Weiterverarbeitung` oder `Abholbereit`.
- Die interne Logik bleibt unverändert: Aufträge bleiben bis `Fertig` in der offenen Plantafel sichtbar.


## Letzter Stand – Auftragsliste Filter und Suche

Die Auftragsliste enthält jetzt eine funktionale Suche und Schnellfilter. Suche und Filter arbeiten auf den getrennten Informationen Status, Freigabe und Übergabe. Besonders testen: Suche nach `Abholbereit`, `Weiterverarbeitung`, `Daten fehlen`, `Freigabe fehlt`; Schnellfilter `Abholbereit`, `Daten fehlen`, `Freigabe fehlt` und `Fertig`.

Nächster sinnvoller Schritt: Belegerstellung/Vorschau aus Auftrag fachlich prüfen oder den Übergang Angebot → Auftrag weiter ausbauen.

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

## Übergabe-Update: Auftragsliste Tabellen-Feinschliff

Zuletzt umgesetzt: Auftragsliste final optisch beruhigt. Feste Spaltenbreiten, gekürzte lange Zelltexte, konsistente Badge-Breiten, kompaktere Filterdarstellung bei kleinen Breiten und Empty-State für leere Treffer. Keine Änderung an Status-/Freigabe-/Übergabe- oder Plantafel-Logik.

Empfohlener nächster Schritt: Auftragsbereich kurz im Browser gesamthaft prüfen und dann entscheiden, ob mit Angebote, Kunden, Material oder Maschinen weitergearbeitet wird.

## Letzter Stand - Tabellen-Feinschliff globalisiert

Nach dem finalen Feinschliff der Auftragsliste wurde der gleiche visuelle Tabellenstandard auf die übrigen Listen übertragen. Betroffene Seiten: CustomersPage, QuotesPage, DeliveryNotesPage, InvoicesPage, RemindersPage, MaterialPage, MachinesPage, FinishingPage, ServicesPage, TemplatesPage. Zusätzlich wurde der gemeinsame CSS-Standard in `src/styles/globals.css` ergänzt.

Bitte nach dem Einsetzen prüfen: alle genannten Listen öffnen, lange Namen/Betreffe kontrollieren, Status-Badges prüfen und Fensterbreite verkleinern.
## Letzter Block: Globaler UI-Konsistenzcheck

Umgesetzt und gepushed werden soll nach dem Einsetzen:

- alte Pill-Optiken weiter reduziert
- Badge-/Status-Radius an Button-Stil angeglichen
- Dashboard-Pills, Produktionslabels und Tabellen-Badges optisch harmonisiert
- extreme Schriftgewichte in Plantafel/Handlungsbedarf weiter reduziert
- Fortschrittsbalken und echte Indikatorpunkte bleiben rund
- keine Logikänderungen

Nächster sinnvoller Schritt danach: fachliches Modul auswählen, zum Beispiel Angebote, Material oder Maschinen.

## Letzter Block – Kalkulation V1 Digitaldruck-Bogenrechner

Die Kalkulationsseite enthält jetzt den ersten aktiven Digitaldruck-Bogenrechner. Eingaben: Auflage, Endformat, Rohbogenformat, Beschnitt, Nutzenabstand, Maschinenrand, Simplex/Duplex, Vorder-/Rückseiten-Farbigkeit, Ausschuss, Rüstbogen, Papierpreis je 1000 Bogen, Klickkosten Farbe/Schwarz und Aufschlag. Der Rechner vergleicht normale und gedrehte Ausrichtung und zeigt Nutzen, Druckbogen netto/brutto, Klicks, Papierkosten, Klickkosten, Herstellkosten und kalkulatorischen Verkaufspreis.

Nächster sinnvoller Schritt: V1 im Browser mit realen Digitaldruck-Beispielen testen, dann grafische Bogenvorschau und Papierlaufrichtung ergänzen.


## Letzter Stand – Kalkulation Digitaldruck Formate

- Endformat-Vorlagen ergänzt: DIN A3, A4, A5, A6, A7, DIN Lang, DIN Lang quer, DIN Lang Plus.
- Rohbogen-Vorlagen ergänzt: SRA3, DIN A3, DIN A4, DIN A5, DIN A6, DIN A7, freies Rohformat.
- Keine Änderung an der eigentlichen Nutzen-/Kostenlogik; nur Formatvorgaben und automatische Custom-Umschaltung ergänzt.

Empfohlener Test:
- DIN Lang quer auf SRA3 testen.
- DIN A6 auf SRA3 testen.
- DIN A7 auf A4 testen.
- Breite/Höhe manuell ändern und prüfen, ob die Vorlage auf frei springt.

## Letzter Stand – Einstellungen Format-Stammdaten

Die Einstellungen enthalten jetzt neue Tabs `Formate` und `Rohbogenformate`. Formate sind zentrale Endformate für Einzelblatt/Flyer/Broschüre/Block/SD-Satz/Karte/Großformat. Rohbogenformate sind Produktionsformate für Nutzenberechnung und spätere Maschinen-/Materiallogik. Der Digitaldruck-Bogenrechner nutzt die aktiven Stammdaten direkt in seinen Dropdowns. Manuelle Breite-/Höhe-Änderungen bleiben weiterhin als freie Formate möglich.

Empfohlener Test:
- Einstellungen öffnen → Bearbeitung aktivieren → Formate prüfen/ändern/speichern.
- Rohbogenformate prüfen, SRA3 als Standard belassen.
- Kalkulation öffnen und kontrollieren, ob die Dropdowns die aktiven Stammdaten anzeigen.

## Letzter Stand – Einstellungen Format-Stammdaten mit Drawer

Die Tabs `Formate` und `Rohbogenformate` in den Einstellungen verwenden jetzt Listenansichten statt Inline-Karten. Zeilen öffnen einen Detaildrawer. Neue Formate/Rohbogenformate werden über den Button in der Liste angelegt und direkt im Drawer bearbeitet. Standardformate sind gegen Löschen geschützt. Die Kalkulation liest weiterhin die aktiven Stammdaten aus den Einstellungen.

Empfohlener Test:
- Einstellungen → Formate öffnen, Bearbeitung aktivieren, Zeile anklicken, Drawer prüfen.
- Neues Format anlegen, speichern, danach Kalkulation öffnen und Dropdown prüfen.
- Einstellungen → Rohbogenformate genauso testen.

## Letzter Stand – Produktvorlagen in Einstellungen

Neu ergänzt wurde der Einstellungstab `Produktvorlagen`. Er nutzt Listenansicht plus Detaildrawer und enthält Stammdaten für produktartspezifische Kalkulationen. Besonders wichtig für Folder/Falzflyer: geschlossenes Format und offenes Druckformat sind getrennt gespeichert. Enthaltene Startvorlagen: DIN A4 Einzelblatt, DIN Lang 4-seitig Einfachfalz, DIN Lang 6-seitig Wickelfalz, DIN Lang 6-seitig Zickzackfalz und DIN A5 4-seitig Einfachfalz.

Empfohlener Test:
- Einstellungen → Produktvorlagen öffnen.
- Bearbeitung aktivieren.
- DIN Lang 6-seitig Wickelfalz öffnen und Panelbreiten prüfen.
- Neue Vorlage anlegen und speichern.

Nächster sinnvoller Schritt: Kalkulation um Produktart/Vorlage erweitern, sodass Folder mit offenem Druckformat in die Nutzenberechnung gehen.

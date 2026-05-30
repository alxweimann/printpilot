# PrintPilot – Übergabe für neues Chat-Fenster

Stand: nach dem Block **Plantafel-Datenlogik / Abholbereit-Fertig-Trennung**  
Branch: `restart-designsystem`  
Projektordner lokal: `C:\printpilot`

## Aktueller gepushter Stand

### Dashboard

Umgesetzt und gepushed:

- echte Kennzahlen oben
- Bereich **Handlungsbedarf** über volle Breite
- Handlungsbedarf typografisch beruhigt
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
- Mini-Karten sind kompakt
- Fortschrittsbalken sichtbar
- Blocker-Hinweis sichtbar
- Typografie der Plantafel beruhigt
- Kartenoptik optisch reduziert und ruhiger gestaltet

### Aufträge

Umgesetzt und gepushed:

- Produktionsstatus-Panel im Auftragsdrawer
- Statuskarten im Bereich **Produktion**:
  - Status
  - Freigabe
  - Übergabe
  - Fällig
- Schnellaktionen als Pill-Buttons:
  - Freigabe erteilt
  - Daten fehlen
  - In Druck
  - Weiterverarbeitung
  - Abholbereit
  - Fertig
- Schnellbuttons farblich differenziert:
  - Freigabe erteilt = grün
  - Daten fehlen = orange
  - In Druck = blau
  - Weiterverarbeitung = blau
  - Abholbereit = gelb
  - Fertig = violett
- Dropdowns bleiben darunter erhalten
- Produktionspanel optisch korrigiert

### Dokumentation

Bei den letzten Blöcken wurden die Doku-Dateien jeweils mitgeführt:

- `docs/PROJECT_STATE.md`
- `docs/ROADMAP.md`
- `docs/WORKFLOWS.md`
- `docs/UI_STANDARDS.md`

Die Dokumentation sollte weiterhin konsolidiert in diesen Dateien bleiben, damit nicht zu viele separate Markdown-Dateien entstehen.

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

### ZIP-/Datei-Hinweis

Beim Arbeiten mit ZIPs kam mehrfach vor, dass die hochgeladene ZIP nicht den aktuellen Stand enthielt. Deshalb künftig vor Uploads prüfen:

```cmd
cd C:\printpilot
findstr /C:"productionWeekColumns" src\pages\DashboardPage.tsx
```

Wenn Treffer kommt, ist die Plantafel-Wochenansicht lokal enthalten.

Für neue ZIPs:

```cmd
cd C:\printpilot
del printpilot-current-full.zip
powershell Compress-Archive -Path .\src,.\docs -DestinationPath .\printpilot-current-full.zip -Force
```

Bei kritischen Änderungen besser zusätzlich Einzeldateien hochladen, zum Beispiel:

```txt
C:\printpilot\src\pages\DashboardPage.tsx
C:\printpilot\src\pages\OrdersPage.tsx
C:\printpilot\src\styles\globals.css
```

## Nächster sinnvoller Schritt

### Block: Plantafel-Datenlogik testen

Die wichtigste Korrektur wurde umgesetzt: **Abholbereit** bleibt jetzt offen in der Plantafel und wird nicht mehr sofort als Fertig abgeschlossen. Trotzdem sollte der Ablauf im Browser einmal praktisch getestet werden.

Testablauf:

1. In **Aufträge** einen Testauftrag öffnen.
2. Bearbeitung aktivieren.
3. Schnellaktion klicken.
4. Auftrag speichern.
5. Dashboard öffnen.
6. Plantafel prüfen.

### Zu prüfende Fälle

#### Freigabe erteilt

Erwartung:

- `approval = Freigabe erteilt`
- Blocker **Freigabe fehlt** sollte verschwinden
- Auftrag bleibt in der Plantafel, wenn er offen/produktionsrelevant ist

#### Daten fehlen

Erwartung:

- `approval = Daten unvollständig`
- `handoff = Wartet auf Daten`
- `status = Wartet`
- Auftrag erscheint als blockiert/wartend
- Plantafel zeigt einen passenden Blocker-Hinweis

#### In Druck

Erwartung:

- `handoff = In Druck`
- `status = In Produktion`
- Auftrag erscheint in der Plantafel als aktiv/in Produktion

#### Weiterverarbeitung

Erwartung:

- `handoff = In Weiterverarbeitung`
- `status = In Produktion`
- Auftrag erscheint in der Plantafel entsprechend weiter fortgeschritten

#### Abholbereit

Erwartung jetzt:

- `handoff = Abholbereit`
- `status = In Produktion`
- Auftrag bleibt offen in der Plantafel sichtbar
- Fortschritt liegt bei 90%

#### Fertig

Erwartung:

- `handoff = Abgeschlossen`
- `status = Fertig`
- Auftrag verschwindet aus der offenen Plantafel

## Mögliche nächste Code-Blöcke

### 1. Plantafel-Datenlogik nachziehen

Falls Tests zeigen, dass Blocker oder Fortschritt nicht sauber passen:

- Blocker-Logik verfeinern
- Fortschrittsberechnung verfeinern
- Status/Handoff-Kombinationen prüfen
- Abholbereit/Fertig fachlich sauber trennen

### 2. Abholbereit als eigener Produktionszustand prüfen

Vorläufig gelöst: **Abholbereit** bleibt mit `status = In Produktion` offen sichtbar und wird über `handoff = Abholbereit` abgebildet. Ein eigener Hauptstatus **Abholbereit** kann später ergänzt werden, ist aktuell aber nicht zwingend notwendig.

### 3. Maschinen-/Kapazitätslogik vorbereiten

Später sinnvoll:

- Maschinen-Auslastung in der Plantafel
- Tageslast je Maschine
- Warnung bei zu vielen Aufträgen pro Maschine/Tag
- Filter nach Maschine

### 4. Material-/Papierpreisverwaltung später

Nicht jetzt, aber geplant:

- Lieferanten wie OVOL, Berberich Papier, IGEPA
- keine unzuverlässigen Live-Webpreise
- Artikelnummern
- manuelle oder CSV/Excel-Preislistenimporte
- Preis pro Ries/Palette/1000 Bogen
- Staffelpreise
- gültig-ab Datum
- Preisverlauf optional

### 5. Installer später

Nicht jetzt, aber geplant:

- Windows-Installer/Setup.exe
- vorher weg von LocalStorage
- später SQLite oder App-Datenordner
- eventuell Tauri-Wrapper

## Empfohlener Startprompt für neues Chat-Fenster

```txt
Wir machen im PrintPilot-Projekt weiter. Aktueller Stand ist gepushed auf Branch restart-designsystem. Dashboard und Plantafel sind fertig: Kennzahlen, Handlungsbedarf, Plantafel als Tageszeilen mit Mini-Auftragskarten. Auftragsdrawer hat ein Produktionspanel mit Statuskarten und farbigen Schnellaktionen. Bitte zuerst die Plantafel-Datenlogik testen: Freigabe erteilt, Daten fehlen, In Druck, Weiterverarbeitung, Abholbereit, Fertig. Danach ggf. Logik nachziehen. Bitte wie bisher kleine Blöcke, komplette geänderte Dateien als ZIP und Doku in PROJECT_STATE.md, ROADMAP.md, WORKFLOWS.md, UI_STANDARDS.md mitführen.
```

## Wichtig für den nächsten Chat

Der nächste Chat sollte direkt mit einem aktuellen Paket starten:

```cmd
cd C:\printpilot
del printpilot-current-full.zip
powershell Compress-Archive -Path .\src,.\docs -DestinationPath .\printpilot-current-full.zip -Force
```

Dann `printpilot-current-full.zip` im neuen Chat hochladen.

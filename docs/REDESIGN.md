# PrintPilot Redesign Dokumentation

## Aktueller Stand

PrintPilot befindet sich auf dem Branch:

```text
restart-designsystem
```

Der aktuelle Fokus liegt auf:

- stabilem Designsystem
- sauberem App-Layout
- zentralem Store
- kontrollierten Formular-Drafts
- Dirty-State
- Schloss-Edit-Mode
- echter lokaler Speicherung im Browser
- Backup-Export aus dem aktuellen Store-Zustand

Wichtig:

```text
Keine Fachlogik weiter ausbauen, bevor Store, Backup und Grunddatenfluss sauber stabil sind.
```

---

## Arbeitsweise

Für Änderungen gilt weiterhin:

```text
1. vollständige betroffene Dateien als Einzeldownload bereitstellen
2. Gesamtpaket-ZIP immer zuletzt anbieten
3. Datei lokal ersetzen
4. npm run build
5. npm run dev
6. visuell und fachlich prüfen
7. committen
8. pushen
9. erst dann nächster Schritt
```

Wichtig für Dateiantworten:

```text
Einzeldateien zuerst.
Gesamtpaket immer ganz zuletzt.
```

---

## Architekturstand

Wichtige Dateien und Bereiche:

```text
src/main.tsx
src/app/App.tsx
src/app/AppRouter.tsx
src/app/moduleConfig.ts
src/app/navigation.ts

src/store/PrintPilotStore.tsx

src/data/printPilotStore.ts
src/data/backup.ts

src/hooks/useMasterDetailSelection.ts
src/hooks/useEditableDraft.ts

src/layout/AppShell.tsx
src/layout/Sidebar.tsx
src/layout/PageHeader.tsx
src/layout/PageTabs.tsx

src/pages/
src/ui/
src/styles/
```

---

## App-Struktur

Der `PrintPilotStoreProvider` wird in `src/main.tsx` um die App gelegt.

Prinzip:

```tsx
<React.StrictMode>
  <PrintPilotStoreProvider>
    <App />
  </PrintPilotStoreProvider>
</React.StrictMode>
```

Wichtig:

```text
App.tsx darf nicht vereinfacht werden.
AppShell, Navigation und AppRouter bleiben in der bestehenden App-Struktur.
```

Der StoreProvider sitzt bewusst außen in `main.tsx`, damit Navigation, Layout und Tabs nicht beschädigt werden.

---

## Zentraler Store

Datei:

```text
src/store/PrintPilotStore.tsx
```

Der Store enthält aktuell:

```text
PrintPilotStoreProvider
usePrintPilotStore()
data
quotes
settings
updateQuote()
updateSettings()
replaceStoreData()
resetStoreData()
getBackupData()
```

Der Store speichert den aktuellen Zustand zusätzlich in:

```text
localStorage["printpilot-store-v1"]
```

Dadurch bleiben aktuell gespeicherte Daten auch nach einem Browser-Reload erhalten.

Wichtig:

```text
Das ist lokale Browser-Persistenz.
Noch keine Datenbank.
Noch keine API.
Noch kein Mehrplatzbetrieb.
```

---

## Zentrale Datenstruktur

Datei:

```text
src/data/printPilotStore.ts
```

Vorbereitete Store-Bereiche:

```text
customers
quotes
orders
materials
machines
services
finishing
templates
settings
```

Zentrale Typen:

```text
PrintPilotStoreData
PrintPilotCustomer
PrintPilotQuote
PrintPilotQuoteStatus
PrintPilotOrder
PrintPilotMaterial
PrintPilotMachine
PrintPilotService
PrintPilotFinishingProcess
PrintPilotTemplate
PrintPilotSettings
```

Wichtige Exporte:

```text
initialPrintPilotQuotes
initialPrintPilotSettings
createEmptyPrintPilotStoreData()
createPrintPilotStoreSnapshot()
groupPrintPilotQuotesByStatus()
```

---

## Angebote

Datei:

```text
src/pages/QuotesPage.tsx
```

Die Angebotsseite ist die erste Seite, die an den echten App-weiten Store angebunden ist.

Sie nutzt:

```ts
const { quotes, updateQuote } = usePrintPilotStore();
```

Beim Klick auf `Änderungen speichern` passiert:

```ts
const savedQuote = draft as PrintPilotQuote;

updateQuote(savedQuote);
saveDraft(savedQuote);
setIsEditing(false);
```

Dadurch gilt aktuell:

```text
Angebot ändern
Änderungen speichern
Tab wechseln
zurückwechseln
Änderung bleibt erhalten
Seite wechseln
zurück zu Angebote
Änderung bleibt erhalten
Browser neu laden
Änderung bleibt erhalten
```

Wichtig:

```text
Das gilt aktuell für Angebote.
Weitere Seiten verwenden noch überwiegend lokale Mock-/Draft-Strukturen.
```

---

## SaveActionButton

Datei:

```text
src/ui/SaveActionButton.tsx
```

Wichtigster Fix:

```tsx
<Button variant="primary" onClick={onClick}>
  {isDirty ? dirtyLabel : defaultLabel}
</Button>
```

Der Button muss `onClick` weitergeben. Sonst wird `handleSaveDraft()` nicht ausgeführt und es wird nichts gespeichert.

Verhalten:

```text
isDirty = false
- zeigt normale Modulaktion, z. B. "Angebot ausgeben"

isDirty = true
- zeigt "Änderungen speichern"
- Klick führt onClick aus
```

---

## Editable Draft Hook

Datei:

```text
src/hooks/useEditableDraft.ts
```

Der Hook liefert aktuell:

```text
draft
isDirty
updateDraftField()
resetDraft()
saveDraft()
```

Wichtig:

```text
saveDraft(nextSavedSource?)
```

Damit kann nach dem Store-Update exakt der gespeicherte Datensatz als neuer gespeicherter Stand gesetzt werden.

Prinzip:

```ts
updateQuote(savedQuote);
saveDraft(savedQuote);
```

Der Draft wird nur bei einem Wechsel der Datensatz-ID zurückgesetzt, nicht bei jeder neuen Objekt-Referenz.

---

## Dirty-State

Dirty-State bedeutet:

```text
Der aktuelle Draft weicht vom gespeicherten Stand ab.
```

Komponente:

```text
src/ui/DirtyStateNotice.tsx
```

Verhalten:

```text
keine Änderung
- kein Hinweis

Änderung vorhanden
- Hinweis "Ungespeicherte Änderungen"
- Hauptbutton wird "Änderungen speichern"
```

---

## Schloss-Edit-Mode

Komponente:

```text
src/ui/EditLockToggle.tsx
```

Prinzip:

```text
geschlossenes Schloss
- Bearbeitung gesperrt

offenes Schloss
- Bearbeitung erlaubt
```

Wichtig:

```text
Das Schloss speichert nicht automatisch.
Speichern bleibt eine bewusste Aktion über den Speichern-Button.
```

Das Schloss ist:

```text
randlos
ohne Button-Fläche
unten in der Button-Leiste
optisch auf Button-Höhe ausgerichtet
```

---

## Einstellungen

Datei:

```text
src/pages/SettingsPage.tsx
```

Die Einstellungen nutzen den Store für:

```text
settings
updateSettings()
getBackupData()
```

Die Standard-Einstellungen liegen zentral in:

```text
src/data/printPilotStore.ts
```

Export:

```text
initialPrintPilotSettings
```

Tabs:

```text
Allgemein
Nummernkreise
Firma
Design
System
Datensicherung
```

---

## Backup

Datei:

```text
src/data/backup.ts
```

Backup-Datenstruktur:

```text
PrintPilotBackupData = PrintPilotStoreData
```

Der Backup-Export nutzt jetzt den echten App-Store.

In `SettingsPage.tsx`:

```ts
const { settings, updateSettings, getBackupData } = usePrintPilotStore();
```

Beim Export:

```ts
const backup = createPrintPilotBackup(getBackupData());
```

Dadurch enthält die JSON-Sicherung den aktuellen Store-Zustand, inklusive geänderter Angebote.

Backup-Struktur:

```json
{
  "app": "PrintPilot",
  "version": "0.1.0",
  "createdAt": "...",
  "data": {
    "customers": [],
    "quotes": [],
    "orders": [],
    "materials": [],
    "machines": [],
    "services": [],
    "finishing": [],
    "templates": [],
    "settings": {}
  }
}
```

Wichtiger Bereich in der Backup-Datei:

```text
data.quotes
```

Dort liegen die Angebote.

---

## Backup-Workflow

Aktuell umgesetzt:

```text
Backup erstellen
- erzeugt JSON-Datei aus aktuellem Store

Backup auswählen
- liest JSON-Datei ein
- validiert PrintPilot-Backup-Format
- zeigt Zusammenfassung

Auswahl zurücksetzen
- entfernt die aktuelle Backup-Auswahl

Alles ersetzen vorbereiten
- nur vorbereitet
- ersetzt noch keine Daten
```

Noch nicht umgesetzt:

```text
echter Backup-Import
Alles ersetzen
Daten ergänzen
automatische Backups
Server-Sicherung
```

---

## UI-Komponenten

Aktuelle zentrale UI-Komponenten:

```text
src/ui/Button.tsx
src/ui/Input.tsx
src/ui/Select.tsx
src/ui/Field.tsx
src/ui/FieldGrid.tsx
src/ui/SectionHeader.tsx
src/ui/Badge.tsx
src/ui/Table.tsx
src/ui/WorkspaceHeader.tsx
src/ui/EditLockToggle.tsx
src/ui/DirtyStateNotice.tsx
src/ui/SaveActionButton.tsx
```

---

## Nicht aktiv

Die visuelle Einzelfeld-Markierung ist aktuell bewusst nicht aktiv.

Nicht aktiv:

```text
DirtyFieldMarker
```

Grund:

```text
Der automatische Rollout hatte JSX-Verschachtelungsfehler erzeugt.
Die Funktion wird später kontrolliert pro Seite eingebaut.
```

Nächster Versuch nur:

```text
eine Seite
ein Feldblock
Build testen
dann weiter
```

---

## Aktuell stabil

Aktuell stabil und gepusht:

```text
StoreProvider in main.tsx
AppShell bleibt intakt
Navigation funktioniert
Tabs funktionieren
SaveActionButton führt onClick aus
Angebotsänderungen werden in Store geschrieben
Store persistiert in localStorage
Angebotsänderungen bleiben nach Reload erhalten
Backup exportiert aktuellen Store
data.quotes enthält geänderte Angebote
```

---

## Nächste sinnvolle Schritte

Empfohlene Reihenfolge:

```text
1. Backup-Import "Alles ersetzen" erst vorbereiten, aber sehr vorsichtig
2. Settings vollständig an updateSettings testen
3. weitere Seite an Store anbinden, z. B. CustomersPage
4. danach OrdersPage oder MaterialPage
5. Backup-Import an replaceStoreData anschließen
6. später LocalStorage-Verwaltung / Reset / Migration
7. später echte Persistenz über Datenbank oder API planen
```

Wichtig:

```text
Ab jetzt keine Massenänderungen über alle Seiten.
Jede Store-Anbindung seitenweise und mit Build-Test.
```

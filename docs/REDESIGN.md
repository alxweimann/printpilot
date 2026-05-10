# PrintPilot Redesign Dokumentation

## Ziel

PrintPilot wird als moderne Druckerei-Software neu aufgebaut.

Der Fokus liegt zuerst auf:

- Designsystem
- Grundlayout
- Navigation
- kompakte technische Eingabemasken
- klare Modulstruktur
- einheitliche Arbeitsmasken
- statische Designzustände
- Master-Detail-Darstellung mit echter lokaler Auswahl
- kontrollierte Formular-Drafts ohne Persistenz
- kompakter Edit-Mode über ein einzelnes randloses Schloss in der Button-Leiste
- Dirty-State für lokale Entwürfe
- Save-Simulation ohne echte Persistenz
- Datensicherung als JSON-Export und abgesicherte Import-Prüfung
- zentrale lokale Datenstruktur als Vorbereitung für Store / Persistenz
- zentrale Standard-Einstellungen über `initialPrintPilotSettings`

Es gilt weiterhin:

```text
Keine Fachlogik, bevor das Designsystem stabil ist.
```

## Branch

Aktueller Arbeitsbranch:

```text
restart-designsystem
```

## Arbeitsweise

```text
1. vollständige betroffene Dateien als Download
2. Datei lokal ersetzen
3. npm run build
4. npm run dev
5. visuell prüfen
6. committen
7. pushen
8. erst dann nächster Schritt
```

## Lokaler Datenstore

Datei:

```text
src/data/printPilotStore.ts
```

Der Store ist aktuell noch kein React-State und noch keine echte Persistenz. Er definiert zuerst nur die zentrale Datenstruktur für PrintPilot.

Vorbereitete Bereiche:

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
PrintPilotOrder
PrintPilotMaterial
PrintPilotMachine
PrintPilotService
PrintPilotFinishingProcess
PrintPilotTemplate
PrintPilotSettings
```

Hilfsfunktionen:

```text
createEmptyPrintPilotStoreData()
createPrintPilotStoreSnapshot()
```

## Zentrale Einstellungen

Die Standard-Einstellungen liegen jetzt zentral in:

```text
src/data/printPilotStore.ts
```

Export:

```ts
initialPrintPilotSettings
```

Die `SettingsPage.tsx` nutzt diese zentrale Struktur jetzt direkt:

```ts
useEditableDraft(initialPrintPilotSettings)
```

Damit sind die Standardwerte nicht mehr doppelt in der Seite gepflegt.

Wichtig:

```text
PrintPilotSettings enthält aktuell eine id.
Diese id wird für useEditableDraft benötigt.
```

## Backup-Dateiformat

Datei:

```text
src/data/backup.ts
```

Das Backup verwendet die zentrale Store-Struktur aus:

```text
src/data/printPilotStore.ts
```

Das bedeutet:

```text
PrintPilotBackupData = PrintPilotStoreData
```

Aktuell umgesetzt:

```text
Backup erstellen
Backup auswählen
Backup validieren
Backup-Zusammenfassung anzeigen
Auswahl zurücksetzen
Alles ersetzen vorbereiten
```

Noch nicht umgesetzt:

```text
echter globaler Store
echte Datenpersistenz
echter Datenimport
Daten ersetzen
Daten ergänzen
automatische Backups
LocalStorage / Datenbank / API
```

## Einstellungen

Datei:

```text
src/pages/SettingsPage.tsx
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

Der Tab `Datensicherung` enthält:

```text
Backup-Format
Sicherungsumfang
Letzter Status
Ausgewähltes Backup
Backup erstellen
Backup auswählen
Auswahl zurücksetzen
Alles ersetzen vorbereiten
```

## UI-Komponenten

Wiederverwendbare Komponenten:

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

## Aktueller Stand

Umgesetzt:

- zentrale Auswahl über `useMasterDetailSelection`
- lokaler Bearbeitungs-Draft über `useEditableDraft`
- Dirty-State im Draft-Hook
- Save-Simulation
- `DirtyStateNotice` als zentrale UI-Komponente
- `EditLockToggle` als zentrale UI-Komponente
- `SaveActionButton` als zentrale UI-Komponente
- kompakter Edit-Mode über einzelnes randloses Schloss-Icon unten
- Backup-Grundstruktur
- Backup-Export als JSON
- Backup-Dateiprüfung beim Import
- Backup-Auswahlstatus
- abgesicherte Import-Vorbereitung ohne echten Datenersatz
- zentrale Store-Datentypen und leeres Store-Snapshot
- zentrale Standard-Einstellungen über `initialPrintPilotSettings`

Wichtig:

```text
Die normalen Moduländerungen sind noch nicht echt persistent.
Die Seiten verwenden noch überwiegend lokale Mock-Daten.
Der Store ist zuerst nur die saubere Zielstruktur.
```

## Nicht aktiv

```text
DirtyFieldMarker / visuelle Einzelfeld-Markierung
```

Die Einzelfeld-Markierung wird später kontrolliert nur auf einer Seite getestet.

## Nächste sinnvolle Schritte

1. erste Seite kontrolliert auf Store-Datenstruktur umstellen
2. Store-State als Hook vorbereiten
3. Backup mit echtem Store-Snapshot verbinden
4. später Persistenz / LocalStorage / API planen

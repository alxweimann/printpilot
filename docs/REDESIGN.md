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
- einheitliche Tabellen- und Statusdarstellung
- Master-Detail-Darstellung mit echter lokaler Auswahl
- kontrollierte Formular-Drafts ohne Persistenz
- kompakter Edit-Mode über ein einzelnes randloses Schloss in der Button-Leiste
- Dirty-State für lokale Entwürfe auf allen relevanten Seiten
- Save-Simulation ohne echte Persistenz
- Datensicherung als JSON-Export und Import-Prüfung
- wiederverwendbare UI-Komponenten für Edit-State, Dirty-State und Hauptaktion

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

## Backup-Dateiformat

Datei:

```text
src/data/backup.ts
```

Das Backup ist als JSON-Datei geplant.

Struktur:

```json
{
  "app": "PrintPilot",
  "version": "0.1.0",
  "createdAt": "2026-05-10T15:30:00.000Z",
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

Aktuell umgesetzt:

```text
Backup erstellen
- erzeugt eine JSON-Datei
- enthält aktuell leere Datenbereiche plus Einstellungen-Draft
- lädt die Datei im Browser herunter

Backup prüfen/importieren
- liest eine JSON-Datei ein
- prüft, ob es eine gültige PrintPilot-Backup-Datei ist
- zeigt Status, Version und Erstellzeit
- ersetzt noch keine Daten
```

Noch nicht umgesetzt:

```text
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

Neuer Tab:

```text
Datensicherung
```

Enthalten:

```text
Backup-Format
Sicherungsumfang
Letzter Status
Backup erstellen
Backup prüfen/importieren
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

## Bearbeitbare Formular-Drafts

Die Master-Detail-Seiten und die Einstellungen verwenden kontrollierte lokale Drafts.

Datei:

```text
src/hooks/useEditableDraft.ts
```

Zweck:

- ausgewählten Datensatz oder Einstellungszustand in einen lokalen Draft übernehmen
- Formularfelder kontrolliert editierbar machen
- Änderungen lokal halten
- Änderungen verwerfen über `resetDraft`
- simuliertes Speichern über `saveDraft`
- Dirty-State über `isDirty`
- keine echte Speicherung
- keine Persistenz
- keine API
- keine echte Datenbank

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

Wichtig:

```text
Die normalen Moduländerungen sind noch nicht echt persistent.
Das Backup enthält aktuell nur die vorbereitete Struktur und Einstellungen.
```

## Nicht aktiv

```text
DirtyFieldMarker / visuelle Einzelfeld-Markierung
```

Die Einzelfeld-Markierung wird später kontrolliert nur auf einer Seite getestet.

## Nächste sinnvolle Schritte

1. Backup-Import-Dialog fachlich planen
2. lokale Datenstruktur für echte Datensätze vorbereiten
3. später Backup-Import mit "Alles ersetzen" anschließen
4. später Persistenz / Store / API planen

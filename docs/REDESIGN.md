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
- Datensicherung als JSON-Export und abgesicherte Import-Prüfung
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

Backup auswählen
- liest eine JSON-Datei ein
- prüft, ob es eine gültige PrintPilot-Backup-Datei ist
- zeigt Status, Version, Erstellzeit und enthaltene Datenbereiche
- merkt das geprüfte Backup lokal als ausgewählt

Auswahl zurücksetzen
- entfernt die aktuelle Backup-Auswahl

Alles ersetzen vorbereiten
- ist als abgesicherte Aktion vorbereitet
- ersetzt noch keine Daten
- zeigt nur, welches Backup verwendet würde
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

Tab:

```text
Datensicherung
```

Enthalten:

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

1. lokalen Datenstore planen
2. Backup-Import mit "Alles ersetzen" erst nach Datenstore anschließen
3. später Daten ergänzen / Daten ersetzen getrennt anbieten
4. später Persistenz / Store / API planen

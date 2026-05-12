# PrintPilot Backup

## Datei

```text
src/data/backup.ts
```

## Datenbasis

Backups basieren auf:

```ts
PrintPilotStoreData
```

Das bedeutet:

```text
Backup = kompletter aktueller App-Store
```

## Backup-Struktur

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

## Export

In den Einstellungen:

```text
Einstellungen
Datensicherung
Backup erstellen
```

Technisch:

```ts
createPrintPilotBackup(getBackupData())
```

## Import

Aktueller Import-Modus:

```text
Alles ersetzen
```

Ablauf:

```text
Backup auswählen
Backup wird gelesen
Backup wird validiert
Zusammenfassung wird angezeigt
Alles ersetzen vorbereiten
Import jetzt ausführen
Sicherheitsbackup wird automatisch exportiert
Browser-Bestätigung
replaceStoreData(selectedBackup.data)
```

## Sicherheitsbackup

Vor dem eigentlichen Ersetzen wird automatisch ein Backup des aktuellen Stands heruntergeladen.

Grund:

```text
Daten können danach wieder eingespielt werden.
```

## Backup prüfen

In einer exportierten JSON-Datei können die Bereiche geprüft werden:

```text
data.customers
data.quotes
data.orders
data.materials
data.machines
data.services
data.finishing
data.templates
data.settings
```

## Noch nicht umgesetzt

```text
Daten ergänzen
Konfliktprüfung
Teilimport einzelner Bereiche
Backup-Vergleich
Automatische periodische Backups
Serverbackup
```

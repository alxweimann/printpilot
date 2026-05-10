# Backup-Konzept

## Datei

```text
src/data/backup.ts
```

## Format

Backup-Dateien sind JSON-Dateien mit folgender Grundstruktur:

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

Der Export wird in den Einstellungen unter `Datensicherung` ausgelöst.

Quelle:

```ts
getBackupData()
```

Dadurch wird der aktuelle Store exportiert.

## Import

Aktuell umgesetzt:

```text
Datei auswählen
Datei lesen
Format validieren
Zusammenfassung anzeigen
Auswahl zurücksetzen
Alles ersetzen vorbereiten
```

Noch nicht umgesetzt:

```text
Daten wirklich ersetzen
Daten ergänzen
Konfliktprüfung
Vorheriges Backup automatisch erstellen
```

## Sicherheitsregel

Vor einem echten Import sollte später immer automatisch ein Sicherheitsbackup erstellt werden.

Prinzip:

```text
Backup vor Import erstellen
Import validieren
Nutzer bestätigt "Alles ersetzen"
Store ersetzen
localStorage aktualisieren
```

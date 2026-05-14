# PrintPilot Backup

## Ziel

Lokale PrintPilot-Daten exportieren und wieder einspielen.

## Datei

```text
src/data/backup.ts
```

## Datenbasis

```text
Backup = kompletter PrintPilotStoreData
```

Enthalten:

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

## Export

```text
Einstellungen
Datensicherung
Backup erstellen
```

## Import

Aktueller Modus:

```text
Alles ersetzen
```

Ablauf:

```text
Backup auswählen
Backup prüfen
Zusammenfassung anzeigen
Alles ersetzen vorbereiten
ConfirmDialog
Sicherheitsbackup wird heruntergeladen
Store wird ersetzt
localStorage wird aktualisiert
```

## Noch nicht umgesetzt

```text
Teilimport
Konfliktprüfung
Backup-Vergleich
automatische Backups
Server-Backup
```

# Backup-Import: Alles ersetzen

## Ziel

Der Backup-Import kann jetzt kontrolliert einen kompletten lokalen Store-Zustand wiederherstellen.

## Betroffene Dateien

```text
src/pages/SettingsPage.tsx
src/store/PrintPilotStore.tsx
```

## Ablauf in der App

```text
Einstellungen
Datensicherung
Backup auswählen
Alles ersetzen vorbereiten
Import jetzt ausführen
```

## Sicherheit

Vor dem Ersetzen wird automatisch ein Sicherheitsbackup des aktuellen lokalen Standes heruntergeladen.

Zusätzlich erscheint eine Browser-Bestätigung.

## Import-Verhalten

Beim Ausführen wird der lokale Store ersetzt durch:

```ts
selectedBackup.data
```

Technisch:

```ts
replaceStoreData(selectedBackup.data);
```

Der Store wird anschließend automatisch in `localStorage["printpilot-store-v1"]` geschrieben.

## Wichtig

Der Import ersetzt aktuell den kompletten lokalen Browser-Store.

Noch nicht vorhanden:

```text
Datensätze ergänzen
Konfliktprüfung
Detailvergleich
Migrationslogik
Server-Sync
```

## Testempfehlung

```text
1. Angebot ändern
2. Änderungen speichern
3. Backup erstellen
4. Angebot erneut ändern
5. Änderungen speichern
6. Backup auswählen
7. Alles ersetzen vorbereiten
8. Import jetzt ausführen
9. prüfen, ob Zustand aus Backup wiederhergestellt wurde
```

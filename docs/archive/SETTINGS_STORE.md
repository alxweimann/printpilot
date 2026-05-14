# Settings Store

## Ziel

Die Einstellungen sind vollständig an den App-weiten Store angebunden.

## Betroffene Datei

```text
src/pages/SettingsPage.tsx
```

## Datenquelle

Die Einstellungen kommen aus:

```ts
const { settings, updateSettings, getBackupData, replaceStoreData } =
  usePrintPilotStore();
```

## Bearbeitung

Die Seite nutzt weiterhin einen lokalen Draft:

```ts
useEditableDraft(settings)
```

Beim Speichern wird der Draft in den Store geschrieben:

```ts
updateSettings(draft);
saveDraft(draft);
```

Da der Store in `localStorage["printpilot-store-v1"]` persistiert, bleiben Einstellungsänderungen nach Reload erhalten.

## Backup

Beim Backup-Export werden die gespeicherten Einstellungen aus dem Store exportiert.

Sie liegen in der JSON-Datei unter:

```text
data.settings
```

## Backup-Import

Beim Import mit `Alles ersetzen` wird der komplette Store ersetzt:

```ts
replaceStoreData(selectedBackup.data);
```

Danach wird der Settings-Draft auf die importierten Einstellungen gesetzt:

```ts
saveDraft(selectedBackup.data.settings);
```

## Test

```text
Einstellungen öffnen
Schloss öffnen
Firma ändern
Einstellungen speichern
Browser neu laden
Änderung bleibt

Backup erstellen
JSON öffnen
data.settings prüfen
```

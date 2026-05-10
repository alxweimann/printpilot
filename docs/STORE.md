# Store- und Speicherstand

## Zweck

Dieses Dokument beschreibt den aktuellen Speichermechanismus in PrintPilot.

## StoreProvider

Datei:

```text
src/store/PrintPilotStore.tsx
```

Der StoreProvider hält den App-Zustand zentral und schreibt ihn zusätzlich in `localStorage`.

Key:

```text
printpilot-store-v1
```

## Aktuelles Speicherverhalten

Bei Angeboten:

```text
Feld ändern
Änderungen speichern klicken
updateQuote(savedQuote)
saveDraft(savedQuote)
localStorage wird aktualisiert
```

Dadurch bleiben geänderte Angebote erhalten bei:

```text
Tabwechsel
Seitenwechsel
Browser-Reload
```

## Grenzen

Noch nicht vorhanden:

```text
Datenbank
Server-Sync
Mehrplatzfähigkeit
Benutzerverwaltung
Konfliktlösung
Migrationen
```

## LocalStorage zurücksetzen

Für Tests kann der lokale Speicher in der Browser-Konsole gelöscht werden:

```js
localStorage.removeItem("printpilot-store-v1");
```

Danach die Seite neu laden.

## Backup

Der Backup-Export nutzt:

```ts
getBackupData()
```

und erzeugt daraus eine PrintPilot-JSON-Datei.

Geänderte Angebote befinden sich in:

```text
data.quotes
```

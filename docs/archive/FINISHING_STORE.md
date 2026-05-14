# Finishing Store

## Ziel

Die Weiterverarbeitung ist an den App-weiten Store angebunden.

## Betroffene Dateien

```text
src/data/printPilotStore.ts
src/store/PrintPilotStore.tsx
src/pages/FinishingPage.tsx
```

## Store-Daten

Neue zentrale Weiterverarbeitungsdaten:

```text
initialPrintPilotFinishing
```

Neue Typen:

```text
PrintPilotFinishingProcess
PrintPilotFinishingStatus
```

Neue Hilfsfunktion:

```text
groupPrintPilotFinishingByStatus()
```

## Store-Funktion

Neue Store-Funktion:

```ts
updateFinishingProcess(process)
```

## FinishingPage

Die Seite nutzt:

```ts
const { finishing, updateFinishingProcess } = usePrintPilotStore();
```

Beim Speichern:

```ts
updateFinishingProcess(savedProcess);
saveDraft(savedProcess);
```

## localStorage-Migration

Wenn bereits ein alter `printpilot-store-v1` ohne Weiterverarbeitungsdaten existiert, füllt `createPrintPilotStoreSnapshot()` den Bereich automatisch mit `initialPrintPilotFinishing`.

Bestehende Kunden, Angebote, Materialien, Maschinen, Leistungen und Einstellungen bleiben erhalten.

## Erwartetes Verhalten

```text
Weiterverarbeitung ändern
Änderungen speichern
Tab wechseln
zurückwechseln
Änderung bleibt
Seite wechseln
zurück zu Weiterverarbeitung
Änderung bleibt
Browser neu laden
Änderung bleibt
Backup erstellen
data.finishing enthält Änderungen
```

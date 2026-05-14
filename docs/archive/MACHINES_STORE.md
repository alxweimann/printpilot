# Machines Store

## Ziel

Die Druckmaschinenverwaltung ist an den App-weiten Store angebunden.

## Betroffene Dateien

```text
src/data/printPilotStore.ts
src/store/PrintPilotStore.tsx
src/pages/MachinesPage.tsx
```

## Store-Daten

Neue zentrale Maschinendaten:

```text
initialPrintPilotMachines
```

Neue Typen:

```text
PrintPilotMachine
PrintPilotMachineStatus
```

Neue Hilfsfunktion:

```text
groupPrintPilotMachinesByStatus()
```

## Store-Funktion

Neue Store-Funktion:

```ts
updateMachine(machine)
```

## MachinesPage

Die Seite nutzt:

```ts
const { machines, updateMachine } = usePrintPilotStore();
```

Beim Speichern:

```ts
updateMachine(savedMachine);
saveDraft(savedMachine);
```

## localStorage-Migration

Wenn bereits ein alter `printpilot-store-v1` ohne Maschinen existiert, füllt `createPrintPilotStoreSnapshot()` den Maschinenbereich automatisch mit `initialPrintPilotMachines`.

Bestehende Kunden, Angebote, Materialien und Einstellungen bleiben erhalten.

## Erwartetes Verhalten

```text
Maschine ändern
Änderungen speichern
Tab wechseln
zurückwechseln
Änderung bleibt
Seite wechseln
zurück zu Maschinen
Änderung bleibt
Browser neu laden
Änderung bleibt
Backup erstellen
data.machines enthält Änderungen
```

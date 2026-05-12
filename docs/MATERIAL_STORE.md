# Material Store

## Ziel

Die Materialverwaltung ist an den App-weiten Store angebunden.

## Betroffene Dateien

```text
src/data/printPilotStore.ts
src/store/PrintPilotStore.tsx
src/pages/MaterialPage.tsx
```

## Store-Daten

Neue zentrale Materialdaten:

```text
initialPrintPilotMaterials
```

Neue Typen:

```text
PrintPilotMaterial
PrintPilotMaterialStatus
```

Neue Hilfsfunktion:

```text
groupPrintPilotMaterialsByStatus()
```

## Store-Funktion

Neue Store-Funktion:

```ts
updateMaterial(material)
```

## MaterialPage

Die Seite nutzt:

```ts
const { materials, updateMaterial } = usePrintPilotStore();
```

Beim Speichern:

```ts
updateMaterial(savedMaterial);
saveDraft(savedMaterial);
```

## localStorage-Migration

Wenn bereits ein alter `printpilot-store-v1` ohne Materialdaten existiert, füllt `createPrintPilotStoreSnapshot()` den Materialbereich automatisch mit `initialPrintPilotMaterials`.

Bestehende Kunden, Angebote und Einstellungen bleiben erhalten.

## Erwartetes Verhalten

```text
Material ändern
Änderungen speichern
Tab wechseln
zurückwechseln
Änderung bleibt
Seite wechseln
zurück zu Material
Änderung bleibt
Browser neu laden
Änderung bleibt
Backup erstellen
data.materials enthält Änderungen
```

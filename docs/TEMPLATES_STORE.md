# Templates Store

## Ziel

Die Vorlagenverwaltung ist an den App-weiten Store angebunden.

## Betroffene Dateien

```text
src/data/printPilotStore.ts
src/store/PrintPilotStore.tsx
src/pages/TemplatesPage.tsx
```

## Store-Daten

Neue zentrale Vorlagendaten:

```text
initialPrintPilotTemplates
```

Neue Typen:

```text
PrintPilotTemplate
PrintPilotTemplateStatus
```

Neue Hilfsfunktion:

```text
groupPrintPilotTemplatesByStatus()
```

## Store-Funktion

Neue Store-Funktion:

```ts
updateTemplate(template)
```

## TemplatesPage

Die Seite nutzt:

```ts
const { templates, updateTemplate } = usePrintPilotStore();
```

Beim Speichern:

```ts
updateTemplate(savedTemplate);
saveDraft(savedTemplate);
```

## localStorage-Migration

Wenn bereits ein alter `printpilot-store-v1` ohne Vorlagen existiert, füllt `createPrintPilotStoreSnapshot()` den Vorlagenbereich automatisch mit `initialPrintPilotTemplates`.

Bestehende Kunden, Angebote, Materialien, Maschinen, Leistungen, Weiterverarbeitung und Einstellungen bleiben erhalten.

## Erwartetes Verhalten

```text
Vorlage ändern
Änderungen speichern
Tab wechseln
zurückwechseln
Änderung bleibt
Seite wechseln
zurück zu Vorlagen
Änderung bleibt
Browser neu laden
Änderung bleibt
Backup erstellen
data.templates enthält Änderungen
```

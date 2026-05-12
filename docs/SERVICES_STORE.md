# Services Store

## Ziel

Die Leistungsverwaltung ist an den App-weiten Store angebunden.

## Betroffene Dateien

```text
src/data/printPilotStore.ts
src/store/PrintPilotStore.tsx
src/pages/ServicesPage.tsx
```

## Store-Daten

Neue zentrale Leistungsdaten:

```text
initialPrintPilotServices
```

Neue Typen:

```text
PrintPilotService
PrintPilotServiceStatus
```

Neue Hilfsfunktion:

```text
groupPrintPilotServicesByStatus()
```

## Store-Funktion

Neue Store-Funktion:

```ts
updateService(service)
```

## ServicesPage

Die Seite nutzt:

```ts
const { services, updateService } = usePrintPilotStore();
```

Beim Speichern:

```ts
updateService(savedService);
saveDraft(savedService);
```

## localStorage-Migration

Wenn bereits ein alter `printpilot-store-v1` ohne Leistungen existiert, füllt `createPrintPilotStoreSnapshot()` den Leistungsbereich automatisch mit `initialPrintPilotServices`.

Bestehende Kunden, Angebote, Materialien, Maschinen und Einstellungen bleiben erhalten.

## Erwartetes Verhalten

```text
Leistung ändern
Änderungen speichern
Tab wechseln
zurückwechseln
Änderung bleibt
Seite wechseln
zurück zu Leistungen
Änderung bleibt
Browser neu laden
Änderung bleibt
Backup erstellen
data.services enthält Änderungen
```

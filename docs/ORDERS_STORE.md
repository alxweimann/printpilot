# Orders Store

## Ziel

Die Auftragsverwaltung ist an den App-weiten Store angebunden.

## Betroffene Dateien

```text
src/data/printPilotStore.ts
src/store/PrintPilotStore.tsx
src/pages/OrdersPage.tsx
```

## Store-Daten

Neue zentrale Auftragsdaten:

```text
initialPrintPilotOrders
```

Neue Typen:

```text
PrintPilotOrder
PrintPilotOrderStatus
```

Neue Hilfsfunktion:

```text
groupPrintPilotOrdersByStatus()
```

## Store-Funktion

Neue Store-Funktion:

```ts
updateOrder(order)
```

## OrdersPage

Die Seite nutzt:

```ts
const { orders, updateOrder } = usePrintPilotStore();
```

Beim Speichern:

```ts
updateOrder(savedOrder);
saveDraft(savedOrder);
```

## localStorage-Migration

Wenn bereits ein alter `printpilot-store-v1` ohne Aufträge existiert, füllt `createPrintPilotStoreSnapshot()` den Auftragsbereich automatisch mit `initialPrintPilotOrders`.

Bestehende Kunden, Angebote, Materialien, Maschinen, Leistungen, Weiterverarbeitung, Vorlagen und Einstellungen bleiben erhalten.

## Erwartetes Verhalten

```text
Auftrag ändern
Änderungen speichern
Tab wechseln
zurückwechseln
Änderung bleibt
Seite wechseln
zurück zu Aufträge
Änderung bleibt
Browser neu laden
Änderung bleibt
Backup erstellen
data.orders enthält Änderungen
```

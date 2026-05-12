# PrintPilot Store

## Zweck

Dieses Dokument beschreibt den aktuellen App-weiten Store von PrintPilot.

## Datei

```text
src/store/PrintPilotStore.tsx
```

## Provider

```text
PrintPilotStoreProvider
```

Der Provider wird in `src/main.tsx` um die App gelegt.

## Hook

```text
usePrintPilotStore()
```

Der Hook stellt Store-Daten und Update-Funktionen bereit.

## Persistenz

Der Store wird automatisch in `localStorage` geschrieben.

Key:

```text
printpilot-store-v1
```

## Store-Daten

Aktuelle Bereiche:

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

## Update-Funktionen

```text
updateCustomer(customer)
updateQuote(quote)
updateOrder(order)
updateMaterial(material)
updateMachine(machine)
updateService(service)
updateFinishingProcess(process)
updateTemplate(template)
updateSettings(settings)
```

## Backup-Funktionen

```text
getBackupData()
replaceStoreData(data)
resetStoreData()
```

## Initialdaten

Initialdaten liegen in:

```text
src/data/printPilotStore.ts
```

Enthalten:

```text
initialPrintPilotCustomers
initialPrintPilotQuotes
initialPrintPilotOrders
initialPrintPilotMaterials
initialPrintPilotMachines
initialPrintPilotServices
initialPrintPilotFinishing
initialPrintPilotTemplates
initialPrintPilotSettings
```

## Migrationen

Wenn ein bestehender localStorage-Store ältere Bereiche nicht enthält oder leere Bereiche hat, ergänzt `createPrintPilotStoreSnapshot()` Initialdaten für neue Bereiche.

Beispiel:

```text
machines ist leer
→ initialPrintPilotMachines wird ergänzt
```

## Test-Hinweis

localStorage kann in der Browser-Konsole zurückgesetzt werden:

```js
localStorage.removeItem("printpilot-store-v1");
```

Danach Seite neu laden.

Achtung:

```text
Dabei gehen lokal gespeicherte Testdaten verloren.
Vorher Backup erstellen, wenn Daten erhalten bleiben sollen.
```

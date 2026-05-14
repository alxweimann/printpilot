# PrintPilot Architektur

## Technische Basis

```text
React
TypeScript
Vite
CSS / Tailwind-nahes Styling
localStorage
```

## Wichtige Ordner

```text
src/app/
src/data/
src/hooks/
src/layout/
src/pages/
src/store/
src/ui/
```

## Store

Dateien:

```text
src/data/printPilotStore.ts
src/store/PrintPilotStore.tsx
```

Persistenz-Key:

```text
localStorage["printpilot-store-v1"]
```

## Store-Struktur

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

## Wichtige Store-Funktionen

```text
addOrder(order)
updateCustomer(customer)
updateQuote(quote)
updateOrder(order)
updateMaterial(material)
updateMachine(machine)
updateService(service)
updateFinishingProcess(process)
updateTemplate(template)
updateSettings(settings)
replaceStoreData(data)
resetStoreData()
getBackupData()
```

## Wichtige Hilfsfunktionen

```text
createPrintPilotStoreSnapshot()
createPrintPilotOrderFromQuote(quote, existingOrders)
getPrintPilotApprovalBadgeVariant(approval)
groupPrintPilotCustomersByStatus()
groupPrintPilotQuotesByStatus()
groupPrintPilotOrdersByStatus()
groupPrintPilotMaterialsByStatus()
groupPrintPilotMachinesByStatus()
groupPrintPilotServicesByStatus()
groupPrintPilotFinishingByStatus()
groupPrintPilotTemplatesByStatus()
```

## Zentrale UI-Komponenten

```text
Badge
Button
ConfirmDialog
EditLockToggle
Field
FieldGrid
Input
SaveActionButton
Select
Table
table.css
```

## Geplant

```text
DetailDrawer
Dokumenten-/Ausgabesystem
PDF-Ausgabe
Dashboard-Plantafel
Kalkulationsverknüpfungen
```

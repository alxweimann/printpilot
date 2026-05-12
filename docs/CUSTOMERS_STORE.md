# Customers Store

## Ziel

Die Kundenverwaltung ist an den App-weiten Store angebunden.

## Betroffene Dateien

```text
src/data/printPilotStore.ts
src/store/PrintPilotStore.tsx
src/pages/CustomersPage.tsx
```

## Store-Daten

Neue zentrale Kundendaten:

```text
initialPrintPilotCustomers
```

Neue Typen:

```text
PrintPilotCustomer
PrintPilotCustomerStatus
```

Neue Hilfsfunktion:

```text
groupPrintPilotCustomersByStatus()
```

## Store-Funktion

Neue Store-Funktion:

```ts
updateCustomer(customer)
```

## CustomersPage

Die Seite nutzt:

```ts
const { customers, updateCustomer } = usePrintPilotStore();
```

Beim Speichern:

```ts
updateCustomer(savedCustomer);
saveDraft(savedCustomer);
```

## Erwartetes Verhalten

```text
Kunde ändern
Änderungen speichern
Tab wechseln
zurückwechseln
Änderung bleibt
Seite wechseln
zurück zu Kunden
Änderung bleibt
Browser neu laden
Änderung bleibt
Backup erstellen
data.customers enthält Änderungen
```

## Hinweis

Wenn ein Kunde in einen anderen Status verschoben wird, erscheint er nach dem Speichern im entsprechenden Tab.

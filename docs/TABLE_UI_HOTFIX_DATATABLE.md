# Table UI Hotfix: DataTable Export

Stand: 14.05.2026

## Problem

`CustomersPage.tsx` importiert `DataTable` aus:

```txt
src/ui/Table.tsx
```

Die erste Version von `Table.tsx` enthielt aber nur die kleineren Tabellen-Bausteine und keinen `DataTable`-Export.

Dadurch entstand im Browser:

```txt
The requested module '/src/ui/Table.tsx' does not provide an export named 'DataTable'
```

## Lösung

`src/ui/Table.tsx` exportiert jetzt zusätzlich:

- `DataTable`
- `DataTableColumn`
- `DataTableProps`

Die bisherigen Exporte bleiben erhalten.

# Table UI Hotfix: TableToolbar Export

Stand: 14.05.2026

## Problem

`CustomersPage.tsx` importiert zusätzlich zu `DataTable` auch `TableToolbar` aus:

```txt
src/ui/Table.tsx
```

Die bisherige Hotfix-Version hatte `DataTable`, aber noch keinen `TableToolbar`-Export.

## Lösung

`src/ui/Table.tsx` exportiert jetzt zusätzlich:

- `TableToolbar`

Die bisherigen Exporte bleiben erhalten:

- `DataTable`
- `TableShell`
- `TableHeader`
- `TableHeadCell`
- `TableBody`
- `TableRow`
- `TableCell`
- `TablePrimaryText`
- `TableSecondaryText`
- `StatusBadge`
- `EmptyTableState`

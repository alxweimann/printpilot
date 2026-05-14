# Table UI Standard

Stand: 14.05.2026

## Ziel

Alle Tabellen in PrintPilot sollen optisch gleich wirken:

- einheitliche Zellabstände
- mehr Luft zwischen farbigen Statusflächen und Text
- gleiche Badge-Optik
- gleiche Hover-Zustände
- gleiche Rundungen, Rahmen und Schatten
- saubere horizontale Scrollbarkeit bei kleinen Fenstern

## Zentrale Datei

Die Tabellenbasis liegt in:

```txt
src/ui/Table.tsx
```

## Komponenten

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

## Statusfarben

Aktuelle Badge-Töne:

- `neutral`
- `blue`
- `green`
- `red`
- `amber`
- `purple`

## Nächster Schritt

Bestehende Tabellen in `Customers.tsx` und `Quotes.tsx` sollen schrittweise auf diese Komponenten umgestellt werden.

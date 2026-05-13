# Table Hard No-Wrap Fix

## Ziel

Alle Tabellenzellen sollen wirklich konsequent einzeilig bleiben.

## Problem

Die vorherige CSS-Regel hat nicht überall gegriffen. Kunde und Produkt konnten weiterhin umbrechen.

## Lösung

`Table.tsx` importiert `table.css` jetzt fest.

```ts
import "./table.css";
```

Zusätzlich stellt `DataTable` sicher, dass jede Tabelle die Klasse bekommt:

```tsx
<table className="data-table">
```

Die CSS-Regeln wurden robuster gemacht:

```css
white-space: nowrap !important;
overflow: hidden !important;
text-overflow: ellipsis !important;
```

## Verhalten

```text
Kunde bleibt in einer Zeile
Produkt bleibt in einer Zeile
Betreff bleibt in einer Zeile
Name bleibt in einer Zeile
Nummern bleiben in einer Zeile
Datum bleibt in einer Zeile
Badges bleiben in einer Zeile
lange Inhalte werden mit … gekürzt
```

## Wichtig

Diese Version ersetzt:

```text
src/ui/Table.tsx
src/ui/table.css
```

## Test

```text
npm run build
npm run dev

Aufträge öffnen
Alle Aufträge prüfen
markierte Zeile prüfen
Kunde / Produkt dürfen nicht mehr umbrechen
bei zu langem Text muss … erscheinen
```

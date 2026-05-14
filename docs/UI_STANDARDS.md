# UI Standards

## CSS-Import Standard

Direkte Side-Effect-CSS-Imports in UI-Komponenten werden aktuell vermieden, weil der TypeScript-Build im Projekt diese Imports mit `TS2882` blockiert.

Betroffen waren:

```txt
src/ui/DetailDrawer.tsx
src/ui/Table.tsx
```

Die direkten Imports wurden entfernt:

```ts
import "./detailDrawer.css";
import "./table.css";
```

Die Komponenten bleiben funktional erhalten. Die CSS-Dateien können als Platzhalter liegen bleiben, werden aber nicht mehr direkt importiert.

## Globale Tabellensortierung

Sortierbare Tabellen verwenden die zentralen Bausteine:

```txt
src/ui/useSortableTable.ts
src/ui/SortableTableHeader.tsx
```

Standardverhalten:

```txt
1. Klick auf Spaltenkopf → aufsteigend sortieren
2. Klick auf denselben Spaltenkopf → absteigend sortieren
aktive Sortierung bleibt beim Tab-Wechsel innerhalb der Seite erhalten
```

Aktuell angebunden:

```txt
Aufträge
Angebote
Kunden
Material
Maschinen
Weiterverarbeitung
Leistungen
Vorlagen
```

Neue Tabellen sollen keine eigene lokale Sortierlogik mehr erhalten, sondern diese zentralen Bausteine verwenden.

## SortableTableHeader Kompatibilität

`SortableTableHeader` unterstützt zwei Nutzungsarten.

Standard für neue Seiten:

```tsx
<SortableTableHeader
  label="Name"
  sortKey="name"
  sortConfig={sortConfig}
  onSort={handleSort}
/>
```

Kompatibilität für bestehende Stammdaten-Seiten:

```tsx
<SortableTableHeader
  label="Name"
  active={sortConfig?.key === "name"}
  direction={sortConfig?.direction}
  onClick={() => handleSort("name")}
/>
```

Neue Seiten sollen bevorzugt die `sortKey`/`sortConfig`/`onSort`-Variante verwenden.

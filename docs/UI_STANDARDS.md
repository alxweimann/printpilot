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
## Sortierbare Tabellen

Für sortierbare Tabellen werden zentrale UI-Bausteine verwendet:

```txt
src/ui/useSortableTable.ts
src/ui/SortableTableHeader.tsx
```

Standardverhalten:

```txt
1. Klick auf Spaltenkopf: aufsteigend sortieren
2. Klick auf denselben Spaltenkopf: absteigend sortieren
Tab-Wechsel: Sortierung bleibt auf der Seite erhalten
```

Die Auftragsliste ist der erste umgestellte Bereich. Weitere Tabellen sollen schrittweise auf dieselben Utilities nachgezogen werden.

## Globale Tabellensortierung: Angebote

Die Angebotsliste nutzt den zentralen Sortierstandard aus:

```txt
src/ui/useSortableTable.ts
src/ui/SortableTableHeader.tsx
```

Sortierbare Spalten:

```txt
Angebot
Kunde
Betreff
Datum
Status
```

Die Sortierung funktioniert wie bei den Aufträgen: erster Klick aufsteigend, zweiter Klick absteigend.

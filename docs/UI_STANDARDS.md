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

# Build Baseline CSS Hotfix

Stand: 14.05.2026

## Änderung

Der Build scheiterte noch an zwei fehlenden CSS-Dateien:

```txt
src/ui/detailDrawer.css
src/ui/table.css
```

Diese Dateien wurden ergänzt, damit die Side-Effect-Imports in `DetailDrawer.tsx` und `Table.tsx` sauber von TypeScript/Vite aufgelöst werden.

## Ziel

Nur Build-Baseline reparieren. Keine neue Funktionalität.

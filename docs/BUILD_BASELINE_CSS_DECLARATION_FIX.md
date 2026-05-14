# Build Baseline CSS Declaration Fix

Stand: 14.05.2026

## Änderung

TypeScript konnte CSS-Side-Effect-Imports noch nicht auflösen.

Ergänzt wurde:

```txt
src/vite-env.d.ts
```

mit:

```ts
/// <reference types="vite/client" />

declare module "*.css";
```

Zusätzlich liegen die beiden importierten CSS-Dateien im Paket:

```txt
src/ui/detailDrawer.css
src/ui/table.css
```

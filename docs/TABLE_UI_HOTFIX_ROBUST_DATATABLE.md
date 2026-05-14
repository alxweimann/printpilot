# Table UI Hotfix: Robust DataTable

Stand: 14.05.2026

## Problem

Die vorhandene Seite nutzt `DataTable`, aber nicht exakt mit den Props der ersten neuen Tabellen-Komponente.

Fehler:

```txt
Cannot read properties of undefined (reading 'map')
```

Das bedeutet: `columns` oder `data` war beim Rendern `undefined`.

## Lösung

`DataTable` ist jetzt defensiv aufgebaut und unterstützt mehrere vorhandene Schreibweisen:

- `columns`
- `data`
- `rows`
- `items`
- `getRowKey`
- `rowKey`
- `label`, `header` oder `title`
- `key`, `accessorKey` oder `id`
- `render` oder `cell`

Wenn `columns` oder Daten kurz fehlen, rendert die Tabelle jetzt einen leeren Zustand statt abzustürzen.

# Table UI Hotfix: Children Support

Stand: 14.05.2026

## Problem

Nach dem robusten `DataTable`-Hotfix lief die App wieder, aber vorhandene Testdaten wurden nicht angezeigt.

Wahrscheinliche Ursache:

Bestehende Seiten nutzen `DataTable` bereits als Tabellen-Wrapper mit manuell gesetztem Inhalt, z. B.:

```tsx
<DataTable>
  <thead>...</thead>
  <tbody>...</tbody>
</DataTable>
```

Die vorherige Hotfix-Version hat `children` nicht berücksichtigt und stattdessen nur die neue `columns/data`-API gerendert.

## Lösung

`DataTable` unterstützt jetzt zusätzlich wieder die alte `children`-Nutzung.

Wenn `children` vorhanden sind, rendert `DataTable` diese direkt innerhalb der Tabelle. Dadurch bleiben bestehende Testdaten, Aufträge, Lieferscheine und manuell gebaute Tabellenzeilen sichtbar.

## Weiterer Standard

Neue Tabellen können weiterhin über die neue API gebaut werden:

- `columns`
- `data`
- `rows`
- `items`

Bestehende Tabellen müssen dadurch nicht sofort umgebaut werden.

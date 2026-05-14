# UI Standards

Stand: 14.05.2026

## Tabellenstandard

PrintPilot-Tabellen sind grundsätzlich linksbündig.

```txt
Header linksbündig
Zellinhalte linksbündig
keine zentrierten Default-Spalten
Sortierpfeil rechts neben dem Header-Text
Sortierpfeil sichtbar
kein Button-Look
kein Textcursor
```

Ausnahmen, z. B. Beträge oder Mengen rechtsbündig, werden später bewusst je Spalte definiert.

## Sortierbare Tabellen

Globale Dateien:

```txt
src/ui/useSortableTable.ts
src/ui/SortableTableHeader.tsx
```

Verwendung:

```tsx
<SortableTableHeader
  label="Kunde"
  sortKey="customerName"
  sortConfig={sortConfig}
  onSort={requestSort}
/>
```

Kompatible ältere Verwendung:

```tsx
<SortableTableHeader
  label="Kunde"
  active={sortConfig?.key === "customerName"}
  direction={sortConfig?.direction}
  onClick={() => requestSort("customerName")}
/>
```

## Wichtige Strukturregel

`SortableTableHeader` rendert selbst ein `<th>`.

Deshalb:

```tsx
<tr>
  <SortableTableHeader ... />
</tr>
```

Nicht:

```tsx
<tr>
  <th>
    <SortableTableHeader ... />
  </th>
</tr>
```

Verschachtelte `th`-Elemente verursachen falsche Ausrichtungen und Browser-Rendering-Probleme.

## Master-Detail-Drawer

Standard:

```txt
Tabelle = Hauptansicht
Zeile anklicken = DetailDrawer rechts
Drawer enthält Detailfelder, Positionen und Aktionen
Tabelle bleibt sichtbar
ConfirmDialog liegt über Drawer
```

## Dialog-Layer

Layer-Standard:

```txt
DetailDrawer Root: z-index 1000
DetailDrawer Panel: z-index 1001
ConfirmDialog: z-index 3000
```

## Doku-Standard

Keine neuen Einzeldokumente für kleine Hotfixes.

Zentrale Dateien:

```txt
docs/PROJECT_STATE.md
docs/ROADMAP.md
docs/UI_STANDARDS.md
docs/MASTER_DETAIL_DRAWER.md
```

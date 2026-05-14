# Ui Standards

## Aufträge: Sortierheader-Struktur

Auch die Auftragsliste verwendet `SortableTableHeader` direkt als Tabellenkopf.

Nicht erlaubt:

```tsx
<th>
  <SortableTableHeader ... />
</th>
```

Erlaubt:

```tsx
<SortableTableHeader ... />
```

Damit ist die Tabellenkopf-Struktur bei Aufträgen, Angeboten, Rechnungen und Lieferscheinen identisch.

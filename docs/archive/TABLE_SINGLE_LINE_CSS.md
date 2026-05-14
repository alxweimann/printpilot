# Table Single Line CSS

## Ziel

Alle Tabellenansichten sollen einzeilig bleiben.

## Verhalten

```text
keine Umbrüche mehr in Tabellenzellen
Kunde bleibt in einer Zeile
Produkt bleibt in einer Zeile
Betreff bleibt in einer Zeile
Name bleibt in einer Zeile
Status bleibt in einer Zeile
lange Inhalte werden mit … gekürzt
```

## Neue Datei

```text
src/ui/table.css
```

## Wichtig

Die Datei muss in `src/ui/Table.tsx` importiert werden:

```ts
import "./table.css";
```

Der Import gehört ganz oben in die Datei, direkt nach möglichen React-/Type-Imports.

## CSS-Regel

```css
.data-table {
  table-layout: fixed;
  width: 100%;
}

.data-table th,
.data-table td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

## Warum zentral?

Damit nicht jede einzelne Seite Inline-Styles bekommt.

Alle Tabellenbereiche profitieren automatisch:

```text
Angebote
Aufträge
Kunden
Material
Maschinen
Weiterverarbeitung
Leistungen
Vorlagen
```

## Test

```text
npm run build
npm run dev

Alle Tabellen öffnen.
Kunde, Produkt, Name, Betreff, Datum, Nummern und Status müssen einzeilig bleiben.
Lange Inhalte werden mit … abgeschnitten.
```

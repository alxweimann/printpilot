# Table Wide Scroll

## Ziel

Tabellen sollen einzeilig bleiben, aber nicht mehr gequetscht wirken.

## Problem

Kunde und Produkt konnten trotz No-Wrap-Ansatz noch umbrechen oder zu eng wirken, weil die Tabelle im linken Panel zu wenig Breite hatte.

## Lösung

Die Tabelle bekommt jetzt mehr Mindestbreite und darf horizontal scrollen.

Neue Kerneinstellungen:

```css
.master-list-panel {
  overflow-x: auto;
}

.data-table {
  min-width: 980px;
  table-layout: auto;
}
```

## Verhalten

```text
alle Tabellenzellen bleiben einzeilig
Kunde bleibt einzeilig
Produkt bleibt einzeilig
Betreff bleibt einzeilig
lange Inhalte werden mit … gekürzt
die Tabelle darf horizontal scrollen
Zeilenhöhen bleiben ruhig
```

## Spaltenlogik

Typische Mindestbreiten:

```text
Spalte 1: Nummer / Kennung
Spalte 2: Kunde / Name
Spalte 3: Produkt / Betreff / Typ
Spalte 4: Datum / Format / Gruppe
letzte Spalte: Status
Badge-Spalten: kompakt, aber einzeilig
```

## Wichtig

In `src/ui/Table.tsx` muss weiterhin dieser Import stehen:

```ts
import "./table.css";
```

## Test

```text
npm run build
npm run dev

Aufträge öffnen
Alle Aufträge prüfen
markierte Zeile prüfen
Kunde und Produkt müssen einzeilig bleiben
bei Bedarf horizontal scrollen
andere Tabellen kurz prüfen
```

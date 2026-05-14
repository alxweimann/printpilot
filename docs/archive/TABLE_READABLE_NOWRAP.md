# Table Readable No-Wrap

## Ziel

Tabellen sollen weiterhin einzeilig sein, aber nicht mehr gequetscht wirken.

## Problem

Die erste No-Wrap-Version nutzte:

```css
table-layout: fixed;
```

Dadurch wurden Spalten zu gleichmäßig verteilt. In markierten Zeilen wirkten Auftragsnummer, Kunde und Produkt zu eng zusammen.

## Neue Lösung

Die Tabelle nutzt jetzt:

```css
table-layout: auto;
min-width: 760px;
overflow-x: auto;
```

Dadurch gilt:

```text
Zellen bleiben einzeilig
Spalten dürfen sinnvoll breiter werden
lange Inhalte werden mit … gekürzt
bei Bedarf entsteht horizontales Scrollen
markierte Zeilen wirken ruhiger
```

## Neue Datei

```text
src/ui/table.css
```

## Wichtig

In `src/ui/Table.tsx` muss weiterhin stehen:

```ts
import "./table.css";
```

## Geänderte Wirkung

```text
Auftragsnummer bleibt lesbar
Kunde bleibt einzeilig
Produkt bleibt einzeilig
Datum bleibt einzeilig
Badges bleiben einzeilig
Zeilen werden nicht unnötig hoch
Inhalte kleben nicht mehr so eng zusammen
```

## Test

```text
npm run build
npm run dev

Aufträge öffnen
Alle Aufträge prüfen
markierte Zeile prüfen
lange Kunden-/Produktnamen prüfen
andere Tabellen prüfen
```

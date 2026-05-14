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
## Sortierbare Tabellen

Für sortierbare Tabellen werden zentrale UI-Bausteine verwendet:

```txt
src/ui/useSortableTable.ts
src/ui/SortableTableHeader.tsx
```

Standardverhalten:

```txt
1. Klick auf Spaltenkopf: aufsteigend sortieren
2. Klick auf denselben Spaltenkopf: absteigend sortieren
Tab-Wechsel: Sortierung bleibt auf der Seite erhalten
```

Die Auftragsliste ist der erste umgestellte Bereich. Weitere Tabellen sollen schrittweise auf dieselben Utilities nachgezogen werden.

## Stabilisierter Tabellen-/Drawer-Standard

Für alle Drawer-Seiten gilt:

```tsx
<tr>
  <SortableTableHeader ... />
</tr>
```

Nicht erlaubt:

```tsx
<th>
  <SortableTableHeader ... />
</th>
```

`DetailDrawer` wird per React Portal in `document.body` gerendert, damit Seitenlayouts und Scrollcontainer die Position nicht beeinflussen.

## Drawer-Akzentfarben

DetailDrawer verwendet die Akzentfarbe des jeweiligen Moduls.

Standard:

```text
accentColor kommt aus module.accentColor
farbige Kopflinie oben im Drawer
dezenter Header-Wash
Eyebrow-Text und kleiner Punkt in Modulfarbe
keine flächige Überfärbung des Inhalts
```

## Drawer-Innenakzente

Innerhalb des `DetailDrawer` werden auch die internen Akzente über die Modulfarbe gesteuert.

Standard:

```text
Drawer-Kopflinie = module.accentColor
Eyebrow = module.accentColor
Abschnittsstriche = module.accentColor
primärer Footer-Button = module.accentColor
```

So bleibt jeder Drawer farblich eindeutig dem aktuellen Modul zugeordnet.

## SectionHeader im Drawer

`SectionHeader` rendert als `.form-section-title`. Im `DetailDrawer` wird diese Klasse gezielt auf die aktuelle Modulfarbe gemappt.

Standard:

```text
.form-section-title im Drawer = module.accentColor
Abschnittsstrich = module.accentColor
Button-Akzent = module.accentColor
```

## SectionHeader Inline-Akzent

`SectionHeader` nutzt keine globale Akzentfarbe mehr aus `.form-section-title`, sondern rendert den Akzent direkt über CSS-Variablen.

Standard:

```text
im Drawer: --detail-drawer-accent-color
außerhalb: --item-accent oder Blau-Fallback
keine feste cyan/blaue Section-Linie mehr
```

## Sidebar Uhr/Datum Farbverlauf

Die Datums- und Uhrzeitanzeige in der Sidebar nutzt denselben Verlauf wie das PP-Logo.

Standard:

```text
linear-gradient(135deg, var(--color-cyan), var(--color-magenta))
Text mit background-clip
kein Rahmen
kein Balken
reduzierter Glow über drop-shadow
```

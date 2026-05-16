# Master-Detail-Drawer

Stand: 14.05.2026

## Aktueller Standard

Der DetailDrawer wird per React Portal direkt an `document.body` gerendert.

Dadurch hängt der Drawer nicht mehr innerhalb einzelner Seitenlayouts oder Scrollcontainer und kann nicht mehr unten im normalen Dokumentfluss erscheinen.

## Layout

```txt
fixed rechts
Overlay über der App
Drawer-Panel rechts
Content scrollt im Drawer
Footer bleibt unten im Drawer
```

## Bereits umgesetzt

```txt
Angebote
Aufträge
Rechnungen
Lieferscheine
Mahnungen
```

## Technische Regel

`DetailDrawer` darf nicht von externen CSS-Dateien abhängen, wenn es um kritische Positionierung geht.

Kritische Styles liegen direkt in `src/ui/DetailDrawer.tsx`.

## Workflow-Realignment

Die Drawer-Aktionen der Dokumentseiten arbeiten wieder gegen denselben Store-Stand. Besonders wichtig: Rechnungen und Mahnungen werden nicht mehr statisch dargestellt, sondern über `usePrintPilotStore()` gelesen und gespeichert.

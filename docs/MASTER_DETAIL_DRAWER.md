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

## Workflow-Hinweise im Drawer

Drawer können oberhalb der Detailbereiche eine kompakte Hinweis-Ampel anzeigen. Die Hinweise sind nicht blockierend, sondern sollen fachliche Lücken sichtbar machen.

## Workflow-Hinweise in Rechnungs- und Mahnungsdrawern

Rechnungs- und Mahnungsdrawer verwenden die gemeinsame Komponente `WorkflowHints`, um Statushinweise direkt oberhalb der Detailbereiche anzuzeigen.

## Workflow-Hinweise im Lieferscheindrawer

Der Lieferscheindrawer verwendet die gemeinsame Komponente `WorkflowHints`, um Statushinweise direkt oberhalb der Detailbereiche anzuzeigen.

## Hotfix Lieferscheindrawer

Die Status-Hinweise im Lieferscheindrawer sind jetzt typkonform zum aktuellen Datenmodell.

## Hotfix Lieferscheindrawer Hinweise

Der Lieferscheindrawer rendert `WorkflowHints` direkt oberhalb des ersten Inhaltsbereichs.

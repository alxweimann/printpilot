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

## Dokumenthistorie im Drawer

Dokumentdrawer zeigen über `DocumentHistory` eine kompakte Ereignishistorie. Aktuell entstehen Einträge beim Ausgeben/Versenden.

## Drawer bleibt nach Ausgeben offen

Ausgabeaktionen schließen den Drawer nicht mehr. Der Datensatz bleibt ausgewählt und der neue Historieneintrag ist sofort sichtbar.

## Historie Statuswechsel

`DocumentHistory` zeigt Statuswechsel mit `previousStatus → nextStatus`, wenn diese Informationen am Historieneintrag vorhanden sind.

## Rechnungsdrawer: getrennte Aktionen

Der Rechnungsdrawer verwendet separate Aktionen für `Änderungen speichern` und `Rechnung ausgeben`, damit manuelle Statuswechsel nicht überschrieben werden.

## Angebotsdrawer: getrennte Aktionen

Der Angebotsdrawer verwendet separate Aktionen für `Änderungen speichern` und `Angebot ausgeben`, damit manuelle Statuswechsel nicht überschrieben werden.

## Auftragshistorie im Drawer

Der Auftragsdrawer zeigt `DocumentHistory` wie die Belegdrawer. Der Drawer bleibt nach dem Speichern offen.

## Historie für Folgeaktionen

Folgeaktionen wie Auftrag/Lieferschein/Rechnung/Mahnung erstellen erzeugen Historieneinträge und halten den Drawer offen.

## Verlinkte Historie

Folgeaktionen schreiben Historieneinträge mit der Nummer des erzeugten bzw. auslösenden Dokuments.

## Kompakte Historien-Timeline

`DocumentHistory` nutzt im Drawer eine Timeline-Darstellung mit Referenz-Badges für Dokumentnummern und hervorgehobenen Statuswechseln.

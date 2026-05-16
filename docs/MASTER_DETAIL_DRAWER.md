# Master-Detail-Drawer

Stand: 14.05.2026

## Ziel

PrintPilot verwendet für Listen und Detailansichten einen einheitlichen Master-Detail-Standard.

```txt
Liste/Tabelle bleibt volle Hauptansicht
Klick auf eine Zeile öffnet rechts den DetailDrawer
Detailinformationen liegen im Drawer
Aktionen liegen im Drawer-Footer
Tabelle bleibt währenddessen sichtbar
```

## Komponente

```txt
src/ui/DetailDrawer.tsx
```

## Bereits umgesetzt

```txt
Angebote
Aufträge
Rechnungen
Lieferscheine
```

## Noch offen

```txt
Mahnungen
Kunden
Material
Maschinen
Weiterverarbeitung
Leistungen
Vorlagen
```

## Verhalten

### Öffnen

```txt
Zeile anklicken
ausgewählter Datensatz bleibt in Tabelle markiert
Drawer öffnet rechts
```

### Schließen

```txt
X rechts oben
Klick außerhalb
Speichern/Ausgeben schließt den Drawer, wenn fachlich sinnvoll
```

### Dialoge

Warnungen und ConfirmDialog liegen immer über dem Drawer.

## Tabellen im Drawer-Kontext

Die Haupttabelle bleibt die zentrale Arbeitsfläche.

Detailbereiche werden nicht dauerhaft unter oder neben die Tabelle gesetzt, sondern erscheinen ausschließlich im Drawer.

## Auftragsaktion Rechnung im Drawer

Der Auftragsdrawer enthält die fachliche Aktion `Rechnung erstellen`.

Die Aktion erzeugt eine Rechnung nur, wenn für den Auftrag noch keine Rechnung mit gleicher `orderId` existiert. Dadurch bleibt die Kette Auftrag → Rechnung eindeutig.

## Auftragsaktionen gemeinsam

Der Auftragsdrawer kann sowohl Lieferscheine als auch Rechnungen erzeugen. Beide Aktionen prüfen vorhandene Dokumente über `orderId`, bevor neue Dokumente erstellt werden.

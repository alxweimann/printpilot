# Master-Detail Drawer Standard

## Ziel

PrintPilot soll perspektivisch einen einheitlichen Master-Detail-Standard bekommen.

Die Tabellenansicht ist dabei die Hauptarbeitsfläche.

Beim Klick auf eine Tabellenzeile öffnet sich rechts ein Detail-Drawer.

## Zielbild

```text
Tabelle über volle Breite
Zeile anklicken
Detail-Drawer öffnet rechts
Tabelle bleibt sichtbar
Drawer kann geschlossen werden
```

## Warum

Das bisherige Layout mit fester Tabelle links und festem Editor rechts macht die Tabellen unnötig schmal.

Der Drawer-Ansatz ist besser für:

```text
mehr Tabellenbreite
weniger gequetschte Spalten
ruhigere Übersicht
moderne Bedienung
bessere Skalierung auf viele Datensätze
```

## Grundprinzip

```text
Liste / Tabelle = Hauptansicht
Detail-Drawer = Bearbeiten / Prüfen / Aktionen
```

## Betroffene Module

Der Standard soll perspektivisch gelten für:

```text
Angebote
Aufträge
Rechnungen
Lieferscheine
Mahnungen
Kunden
Material
Maschinen
Weiterverarbeitung
Leistungen
Vorlagen
```

## Geplante UI-Komponente

```text
src/ui/DetailDrawer.tsx
```

Mögliche Props:

```ts
type DetailDrawerProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  status?: string;
  onClose: () => void;
  children: React.ReactNode;
};
```

## Verhalten

```text
Klick auf Tabellenzeile
ausgewählter Datensatz wird gesetzt
Drawer öffnet
Bearbeitungsmodus ist zunächst gesperrt
Schloss öffnet Bearbeitung
Speichern aktualisiert Store
Schließen verwirft keine gespeicherten Daten
```

## Bestehende Logik bleibt erhalten

Der Drawer ersetzt nicht die fachliche Logik.

Weiterhin gültig:

```text
Edit-Lock
Dirty-State
Speichern
Änderungen verwerfen
ConfirmDialog für kritische Aktionen
Status-Badges
localStorage-Persistenz
```

## Aufträge

Bei Aufträgen bleibt bestehen:

```text
Freigabe-Dropdown
Übergabe-Dropdown
Maschinen-Dropdown
Status-Dropdown
Warnung bei Produktion ohne gültige Freigabe
ConfirmDialog
```

Nur die Darstellung ändert sich:

```text
fester rechter Editor → rechter Drawer
```

## Angebote

Bei Angeboten bleibt bestehen:

```text
Alle Angebote
Status-Tabs
Angebot → Auftrag
Dublettenwarnung bei erneutem Auftrag
ConfirmDialog
```

Nur die Darstellung ändert sich:

```text
fester rechter Editor → rechter Drawer
```

## Rechnungen / Lieferscheine / Mahnungen

Für spätere Ausgabedokumente ist der Drawer besonders sinnvoll.

Mögliche Aktionen im Drawer:

```text
PDF erstellen
Drucken
E-Mail senden
Status ändern
Zahlung prüfen
Versand prüfen
Mahnstufe prüfen
```

## Umsetzungsreihenfolge

Nicht alles auf einmal umbauen.

Empfohlene Reihenfolge:

```text
1. DetailDrawer-Komponente bauen
2. Aufträge auf Drawer-Layout umstellen
3. Angebote auf Drawer-Layout umstellen
4. Rechnungen vorbereiten
5. Lieferscheine vorbereiten
6. Mahnungen vorbereiten
7. Kunden / Material / Maschinen / Leistungen / Vorlagen nachziehen
```

## Wichtig

```text
Ein Modul pro Schritt.
Keine Massenänderung.
Nach jedem Modul Build testen.
Nach jedem Modul pushen.
```

## Akzeptanzkriterien

Für ein umgestelltes Modul gilt:

```text
Tabelle nutzt volle Breite
Klick auf Zeile öffnet Drawer
Drawer zeigt vollständige Details
Bearbeiten funktioniert wie vorher
Speichern funktioniert wie vorher
Schließen funktioniert zuverlässig
Statuswechsel / Warnungen funktionieren weiterhin
```

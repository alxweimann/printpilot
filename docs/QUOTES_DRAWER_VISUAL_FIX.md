# Angebote: Drawer Visual Fix

Stand: 14.05.2026

## Problem

Die Drawer-Funktion war technisch vorhanden, aber optisch falsch:

- Detailbereich wurde unter der Tabelle statt rechts als Drawer angezeigt
- Inhalt scrollte nicht sauber
- Schriftgrößen und Abstände passten nicht zum bestehenden PrintPilot-Design
- Tabellen-Styling wurde teilweise nicht geladen

## Lösung

Geändert wurden:

```txt
src/pages/QuotesPage.tsx
src/ui/DetailDrawer.tsx
src/ui/detailDrawer.css
src/ui/Table.tsx
src/ui/table.css
```

## Ergebnis

- Tabelle bleibt volle Hauptansicht
- Klick auf Angebotszeile öffnet rechten fixed Drawer
- Drawer hat eigene Kopfzeile, scrollbaren Inhalt und festen Footer
- Formularfelder im Drawer sind kompakter und sauber ausgerichtet
- Tabelle nutzt wieder die bestehenden `data-table`-Styles

## Wichtig

`DetailDrawer.tsx` nutzt jetzt bewusst CSS-Klassen statt Tailwind-Klassen, weil der aktuelle PrintPilot-Stand primär mit eigenen CSS-Klassen arbeitet.

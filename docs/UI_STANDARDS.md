# UI Standards

Stand: 14.05.2026

## DetailDrawer

Der DetailDrawer wird per React Portal in `document.body` gerendert.

Standard:

```txt
fixed rechts
z-index 1000/1001
Overlay über der App
Content scrollt intern
Footer bleibt unten
keine Abhängigkeit von externer CSS-Datei für kritische Positionierung
```

## Nummernkreis- und Workflow-Seiten

Die Nummernkreis-Karten bleiben im 3-Spalten-Layout mit Innenabstand. Dokumentseiten lesen ihre Daten aus dem zentralen Store, nicht aus lokalen statischen Arrays.

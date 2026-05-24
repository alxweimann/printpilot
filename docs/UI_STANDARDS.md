# Ui Standards

## Sidebar LED-Anzeige

Die Sidebar zeigt unten Datum und Uhrzeit als reduzierte LED-Anzeige.

Standard:

```text
kein zusätzliches Label wie „Systemzeit“
kein äußerer Rahmen um die Anzeige
Datum und Uhrzeit gleich breit
zwei kompakte LED-Zeilen
ruhiger dunkler Hintergrund je Zeile
```

## Sidebar LED-Anzeige ohne Rahmen

Die LED-Anzeige in der Sidebar besteht nur aus leuchtendem Text.

Standard:

```text
kein äußerer Rahmen
kein Hintergrundbalken je Zeile
kein Kasten um Datum/Uhrzeit
Datum und Uhrzeit gleich breit
größere LED-Ziffern
zentrierte Darstellung
```

## Sidebar LED-Anzeige Breite und Glow

Datum und Uhrzeit werden als gleich breite LED-Zeilen dargestellt.

Aktueller Standard:

```text
Zeilenbreite: 138px
Schriftgröße: 16px
Glow deutlich reduziert
kein Rahmen
kein Hintergrundbalken
zentrierte Darstellung
```

## Workflow-Hints

Workflow-Hinweise erscheinen als kompakte Karten im Drawer.

```text
warning = fachliche Lücke / kritisch
info = Prüfung empfohlen
success = Status ist positiv/abgeschlossen
```

## Globaler CSS-Import

`src/main.tsx` muss `./styles/globals.css` importieren. Ohne diesen Import wird PrintPilot als ungestyltes Browser-HTML dargestellt.

## CSS Import Types

Für globale CSS-Imports muss `src/vite-env.d.ts` vorhanden sein:

```ts
/// <reference types="vite/client" />
```

## Workflow-Hints für Belegstatus

Die Workflow-Hints werden auch für Rechnungs- und Mahnungsstatus verwendet. Kritische Zustände wie `Überfällig` oder offene Mahnungen werden als `warning` dargestellt.

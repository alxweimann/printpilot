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

## Workflow-Hints für Lieferscheine

Die Workflow-Hints werden auch für Lieferscheinstatus verwendet. Versandbereite Lieferscheine werden als `warning` dargestellt, damit Versand/Abholung bewusst geprüft wird.

## Hotfix Workflow-Hints Lieferscheine

Workflow-Hints dürfen nur Statuswerte verwenden, die im jeweiligen Dokumenttyp definiert sind.

## Lieferschein Workflow-Hints

Lieferschein-Hints werden für `Entwurf`, `Versandbereit`, `Geliefert` und `Abgeschlossen` angezeigt.

## Vorschau-Button

`Vorschau prüfen` wird als sekundäre Footer-Aktion vor primären Folgeaktionen platziert.

## Preview Dialog Layout

`DocumentPreviewDialog` verwendet ein kompaktes Sheet und eine höhere Overlay-Ebene. Bei breiten Viewports wird die Vorschau vom rechten Drawer weg nach links versetzt.

## Preview Dialog Foreground

Die Vorschau nutzt `z-index: 9999`, damit sie als oberste Ebene über Drawer und App sichtbar ist.

## Einheitliche Dokumentvorschau

`DocumentPreviewDialog` wird für Angebote, Aufträge, Lieferscheine, Rechnungen und Mahnungen genutzt.

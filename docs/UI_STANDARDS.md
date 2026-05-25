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

## DocumentHistory

Historieneinträge werden als kompakte Karten unterhalb der Workflow-Hinweise angezeigt. Die Markierung nutzt den CMYK-Akzentverlauf.

## DocumentHistory Statuswechsel

Statuswechsel werden fett als `Alt → Neu` dargestellt. Die Historie zeigt maximal 5 neueste Einträge direkt an.

## Dashboard Deep-Link Rows

Handlungsbedarf-Zeilen sind klickbare Deep-Links in das passende Modul und den konkreten Drawer-Datensatz.

## Produktions-Timeline

Die Dashboard-Plantafel nutzt kompakte Auftragskarten mit Fortschrittsbalken, Prioritäts-Pill, Fälligkeit und Blocker-Hinweis.

## Plantafel Typisierung

Fälligkeitsgruppen der Produktions-Timeline sind als `ProductionTimelineDueGroup` typisiert.

## Dashboard Full-Width Sections

Dashboard-Arbeitsbereiche werden als gestapelte Full-Width-Sektionen dargestellt. Die Plantafel nutzt responsive Karten-Spalten.

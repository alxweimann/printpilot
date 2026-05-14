# Orders All Tab

## Ziel

Die Auftragsseite hat jetzt einen echten Übersichtstab.

## Neue Tab-Struktur

```text
Alle Aufträge
Neu
In Produktion
Wartet
Fertig
Archiv
```

## Verhalten

### Alle Aufträge

Zeigt alle Aufträge unabhängig vom Status.

```text
Neu
In Produktion
Wartet
Fertig
Archiv
```

### Status-Tabs

Die anderen Tabs zeigen weiterhin nur den jeweiligen Status.

## Warum

Vorher konnte ein Auftrag nach Statuswechsel aus der aktuellen Ansicht verschwinden.

Mit `Alle Aufträge` bleibt die Übersicht stabil:

```text
Status ändern
speichern
Auftrag bleibt sichtbar
neuer Status ist sofort in der Tabelle erkennbar
```

## Speichern nach Statuswechsel

Nach dem Speichern wechselt die Seite automatisch zurück zu:

```text
Alle Aufträge
```

Der gespeicherte Auftrag bleibt ausgewählt.

## Freigabe-Warnung

Die bestehende Warnlogik bleibt erhalten.

Wenn ein Auftrag ohne gültige Freigabe in Produktion gesetzt wird:

```text
Warnung erscheint
Trotz Warnung speichern
Auftrag bleibt in Alle Aufträge sichtbar
Status ist In Produktion
```

## Test

```text
Aufträge öffnen
Alle Aufträge ist aktiv
Schloss öffnen
Status eines Auftrags ändern
Speichern
Ansicht bleibt / wechselt zu Alle Aufträge
Auftrag bleibt sichtbar
Status ist aktualisiert
```

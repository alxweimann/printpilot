# PrintPilot Workflow-Stand

## Aufträge

Die Auftragsseite ist aktuell der am weitesten entwickelte Workflow-Bereich.

## Tabs

```text
Alle Aufträge
Neu
In Produktion
Wartet
Fertig
Archiv
```

`Alle Aufträge` zeigt alle Aufträge unabhängig vom Status.

## Felder

### Status

```text
Neu
In Produktion
Wartet
Fertig
Archiv
```

### Freigabe

```text
Freigabe ausstehend
Freigabe erteilt
Korrektur angefordert
Daten unvollständig
Nicht erforderlich
```

### Übergabe

```text
Druckdaten prüfen
Wartet auf Daten
In Druck
In Weiterverarbeitung
Abholbereit
Versendet
Abgeschlossen
```

### Priorität

```text
Niedrig
Normal
Hoch
Express
```

### Maschine

Maschinen werden aus dem Store geladen.

Der Auftrag speichert:

```text
machineId
```

Die Maschinen kommen aus:

```text
data.machines
```

## Freigabe-Logik

Eine Warnung erscheint, wenn ein Auftrag produktionsrelevant ist und keine gültige Freigabe hat.

Produktionsrelevant:

```text
Status = In Produktion
oder Übergabe = In Druck
oder Übergabe = In Weiterverarbeitung
```

Gültige Freigaben:

```text
Freigabe erteilt
Nicht erforderlich
```

Warnung bei:

```text
Freigabe ausstehend
Korrektur angefordert
Daten unvollständig
```

## Automatische Statuslogik

Wenn die Übergabe gesetzt wird auf:

```text
In Druck
In Weiterverarbeitung
```

dann wird der Auftragsstatus automatisch gesetzt auf:

```text
In Produktion
```

## ConfirmDialog

Die Warnung erscheint als modales Popup über:

```text
src/ui/ConfirmDialog.tsx
```

Aktionen:

```text
Abbrechen
Trotzdem speichern
```

Bei `Abbrechen` werden Status, Übergabe und Freigabe auf den zuletzt gespeicherten Stand zurückgesetzt.

Bei `Trotzdem speichern` wird direkt gespeichert.

## Angebote

Die Angebotsseite hat jetzt:

```text
Alle Angebote
Entwurf
Offen
Angenommen
Abgelehnt
```

`Alle Angebote` zeigt alle Angebote unabhängig vom Status.

## Nächster Workflow-Schritt

Empfohlen:

```text
Angebot → Auftrag vorbereiten
```

Ziel:

```text
Angenommenes Angebot auswählen
Aktion "Auftrag erstellen"
Auftragsentwurf erzeugen
Daten übernehmen
in Alle Aufträge sichtbar machen
```

Wichtig:

```text
erst kontrollierte Aktion
keine automatische Magie
ConfirmDialog für Umwandlung verwenden
```

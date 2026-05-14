# Quotes All Tab

## Ziel

Die Angebotsseite hat jetzt einen echten Übersichtstab.

## Neue Tab-Struktur

```text
Alle Angebote
Entwurf
Offen
Angenommen
Abgelehnt
```

## Verhalten

### Alle Angebote

Zeigt alle Angebote unabhängig vom Status.

```text
Entwurf
Offen
Angenommen
Abgelehnt
```

### Status-Tabs

Die anderen Tabs zeigen weiterhin nur Angebote mit dem jeweiligen Status.

## Warum

Wie bei den Aufträgen soll die Übersicht stabil bleiben.

Wenn ein Angebotsstatus geändert wird, verschwindet das Angebot nicht aus der Ansicht, sondern bleibt in `Alle Angebote` sichtbar.

## Speichern nach Statuswechsel

Nach dem Speichern wechselt die Seite automatisch zurück zu:

```text
Alle Angebote
```

Der gespeicherte Datensatz bleibt ausgewählt.

## Test

```text
Angebote öffnen
Alle Angebote ist aktiv
Schloss öffnen
Status eines Angebots ändern
Speichern
Ansicht bleibt / wechselt zu Alle Angebote
Angebot bleibt sichtbar
Status ist aktualisiert
Browser neu laden
Änderung bleibt
```

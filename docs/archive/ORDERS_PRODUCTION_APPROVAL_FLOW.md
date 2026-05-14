# Orders Production Approval Flow

## Ziel

Der Wechsel auf `In Produktion` ist jetzt sichtbar und sicher.

## Problem

Die vorherige Logik hat den Status bei fehlender Freigabe nicht sichtbar geändert. Dadurch wirkte es so, als würde nichts passieren.

## Neues Verhalten

Wenn ein Auftrag ohne gültige Freigabe auf `In Produktion` gesetzt wird:

```text
Status wird sichtbar auf In Produktion gesetzt
Warnblock erscheint direkt in der Maske
Speichern wird blockiert
```

Erst nach Klick auf:

```text
Warnung bestätigen
```

kann der Auftrag gespeichert werden.

## Abbrechen

Bei Klick auf:

```text
Abbrechen
```

wird der Status wieder auf den aktuellen Tab zurückgesetzt.

Beispiel:

```text
Tab Wartet
Status auf In Produktion gesetzt
Abbrechen
Status geht zurück auf Wartet
```

## Gültige Freigaben ohne Warnung

```text
Freigabe erteilt
Nicht erforderlich
```

## Warnung bei

```text
Freigabe ausstehend
Korrektur angefordert
Daten unvollständig
```

## Test

```text
Aufträge öffnen
Schloss öffnen
Auftrag im Tab Wartet mit Freigabe ausstehend wählen
Status auf In Produktion setzen
Status muss sichtbar auf In Produktion wechseln
Warnblock muss erscheinen
Änderungen speichern klicken
Speichern darf noch nicht passieren
Warnung bestätigen
Änderungen speichern klicken
Auftrag wandert in Tab In Produktion
```

# Orders Approval Warning Panel

## Ziel

Die Freigabe-Logik für den Wechsel auf `In Produktion` ist jetzt sichtbar und robuster.

## Problem

Die Browser-Bestätigung per `window.confirm` wurde nicht zuverlässig wahrgenommen oder ausgelöst.

## Lösung

Wenn ein Auftrag ohne gültige Freigabe auf `In Produktion` gesetzt werden soll, wird jetzt ein sichtbarer Warnblock direkt in der Auftragsmaske angezeigt.

## Verhalten

```text
Status auf In Produktion setzen
Freigabe ist nicht gültig
→ Status wird noch nicht geändert
→ Warnblock erscheint
```

Der Warnblock bietet:

```text
Abbrechen
Trotzdem in Produktion setzen
```

Bei `Abbrechen` bleibt der alte Status erhalten.

Bei `Trotzdem in Produktion setzen` wird der Status im Draft auf `In Produktion` gesetzt.

Beim Speichern wandert der Auftrag danach in den Tab `In Produktion`.

## Zusätzliche Sicherheit

Beim Speichern bleibt zusätzlich eine `window.confirm`-Prüfung als Fallback erhalten.

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
Auftrag mit Freigabe ausstehend wählen
Status auf In Produktion setzen
Warnblock muss erscheinen
Abbrechen klicken
Status bleibt alt
erneut Status auf In Produktion setzen
Trotzdem in Produktion setzen klicken
Änderungen speichern
Auftrag wandert in Tab In Produktion
```

# Orders Status Change Guard

## Ziel

Die Warnlogik für den Wechsel auf `In Produktion` wurde robuster umgesetzt.

## Problem

Die Warnung beim Speichern war zu spät beziehungsweise wurde nicht zuverlässig ausgelöst.

## Lösung

Die Warnung sitzt jetzt direkt am Status-Dropdown.

Wenn im Auftrag der Status auf `In Produktion` geändert wird und die Freigabe nicht gültig ist, erscheint sofort eine Browser-Bestätigung.

## Blockierende Freigaben

Warnung erscheint bei:

```text
Freigabe ausstehend
Korrektur angefordert
Daten unvollständig
```

## Erlaubt ohne Warnung

Keine Warnung bei:

```text
Freigabe erteilt
Nicht erforderlich
```

## Verhalten

```text
Status auf In Produktion setzen
Warnung erscheint sofort
Abbrechen → Status bleibt unverändert
Bestätigen → Status wird im Draft gesetzt
Änderungen speichern → Auftrag wandert in Tab In Produktion
```

## Tabwechsel nach Speichern

Nach dem Speichern wird der aktive Tab auf den gespeicherten Status gesetzt.

Zusätzlich wird die Auswahl per `setTimeout` erneut gesetzt, damit sie nach der Store-Aktualisierung stabil bleibt.

## Test

```text
Aufträge öffnen
Schloss öffnen
Auftrag mit Freigabe ausstehend wählen
Status auf In Produktion setzen
Popup muss sofort erscheinen
Abbrechen klicken
Status bleibt alt
Status erneut auf In Produktion setzen
Bestätigen
Änderungen speichern
Auftrag muss in Tab In Produktion erscheinen
```

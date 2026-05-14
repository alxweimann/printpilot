# Orders Approval Change Guard

## Ziel

Die Freigabe-Warnung greift jetzt nicht nur beim Statuswechsel, sondern auch beim Ändern der Freigabe.

## Problem

Vorher erschien das Modal nur bei:

```text
Status → In Produktion
```

Wenn ein Auftrag bereits in Produktion war und die Freigabe danach auf `Freigabe ausstehend` geändert wurde, erschien keine Warnung.

## Neue Logik

Das Modal erscheint jetzt bei beiden Fällen:

```text
Status wird auf In Produktion gesetzt
Freigabe ist nicht gültig
```

und:

```text
Auftrag ist In Produktion
Freigabe wird auf nicht gültig geändert
```

## Blockierende Freigaben

```text
Freigabe ausstehend
Korrektur angefordert
Daten unvollständig
```

## Gültige Freigaben

```text
Freigabe erteilt
Nicht erforderlich
```

## Abbrechen

Bei Abbrechen werden Status und Freigabe wieder auf den zuletzt gespeicherten Stand zurückgesetzt.

## Test

```text
Aufträge öffnen
Schloss öffnen
Auftrag auf In Produktion setzen oder bereits produzierenden Auftrag wählen
Freigabe auf Freigabe ausstehend ändern
Modal muss erscheinen
Abbrechen setzt Freigabe zurück
Trotzdem speichern speichert direkt
```

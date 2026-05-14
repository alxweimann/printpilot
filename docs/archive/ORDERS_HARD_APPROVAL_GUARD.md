# Orders Hard Approval Guard

## Ziel

Die Freigabeprüfung ist jetzt maximal sichtbar und diagnostisch eindeutig.

## Änderungen

Wenn der Status auf `In Produktion` gesetzt wird und keine gültige Freigabe vorliegt:

```text
1. Der Status wird im Draft auf In Produktion gesetzt.
2. Sofort erscheint ein window.alert().
3. Direkt unter dem Statusfeld erscheint ein roter Warnblock.
4. Speichern wird blockiert, bis die Warnung bestätigt wurde.
```

## Warnblock

Der Warnblock steht jetzt direkt unter dem Statusfeld, nicht unten am Formular.

Aktionen:

```text
Status zurücksetzen
Warnung bestätigen
```

## Speichern

Beim Speichern wird erneut geprüft.

Wenn die Warnung nicht bestätigt wurde:

```text
window.alert()
Speichern wird abgebrochen
```

## Diagnose

Wenn beim Wechsel auf `In Produktion` immer noch gar nichts passiert, dann ist einer dieser Punkte sicher:

```text
die laufende App nutzt nicht diese OrdersPage.tsx
oder der Status-Handler wird nicht ausgelöst
oder der Auftrag hat bereits Freigabe erteilt / Nicht erforderlich
oder das Schloss ist nicht wirklich im Bearbeitungsmodus
```

## Test

```text
Aufträge öffnen
Schloss öffnen
Auftrag mit Freigabe ausstehend wählen
Status auf In Produktion setzen
alert muss sofort erscheinen
roter Warnblock muss direkt unter Status erscheinen
Speichern muss blockieren
Warnung bestätigen
Speichern
Auftrag wandert in Tab In Produktion
```

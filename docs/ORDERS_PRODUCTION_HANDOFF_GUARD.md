# Orders Production Handoff Guard

## Ziel

Die Freigabe-Warnung greift jetzt nicht nur beim Status `In Produktion`, sondern auch bei produktionsrelevanten Übergabe-Status.

## Warnung erscheint bei

```text
Status = In Produktion
oder Übergabe = In Druck
oder Übergabe = In Weiterverarbeitung
```

und gleichzeitig:

```text
Freigabe ist nicht gültig
```

## Gültige Freigaben

```text
Freigabe erteilt
Nicht erforderlich
```

## Blockierende Freigaben

```text
Freigabe ausstehend
Korrektur angefordert
Daten unvollständig
```

## Automatische Statuslogik

Wenn die Übergabe auf `In Druck` oder `In Weiterverarbeitung` gesetzt wird, wird der Auftragsstatus automatisch auf `In Produktion` gesetzt.

## Modal

Die Warnung nutzt die zentrale Komponente:

```text
src/ui/ConfirmDialog.tsx
```

## Test

```text
Aufträge öffnen
Schloss öffnen
Übergabe auf In Druck setzen
Freigabe ist ausstehend
ConfirmDialog muss erscheinen

oder:
Status auf In Produktion setzen
Freigabe ist ausstehend
ConfirmDialog muss erscheinen

oder:
Auftrag ist In Produktion
Freigabe auf ausstehend setzen
ConfirmDialog muss erscheinen
```

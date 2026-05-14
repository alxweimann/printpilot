# Orders Warning Confirm Save

## Ziel

Die Warnbestätigung bei Produktion ohne Freigabe speichert jetzt direkt und zuverlässig.

## Problem

Die Warnung erschien, aber die Bestätigung setzte nur einen Zwischenzustand. Dadurch konnte es passieren, dass der Auftrag danach nicht sauber gespeichert wurde.

## Lösung

Der Button im Warnblock heißt jetzt:

```text
Trotz Warnung speichern
```

Beim Klick passiert direkt:

```ts
const savedOrder = {
  ...draft,
  status: "In Produktion",
};

updateOrder(savedOrder);
saveDraft(savedOrder);
setIsEditing(false);
setActiveTab("In Produktion");
selectItem(savedOrder.id);
```

Damit wird nicht mehr auf einen Zwischenstatus gewartet.

## Verhalten

```text
Auftrag mit fehlender Freigabe
Status auf In Produktion setzen
Warnung erscheint
Trotz Warnung speichern klicken
Auftrag wird gespeichert
Auftrag wandert in Tab In Produktion
```

## Abbrechen

Bei `Status zurücksetzen` / `Abbrechen` wird der Status wieder auf den aktuellen Tab gesetzt.

## Test

```text
Aufträge öffnen
Schloss öffnen
Auftrag mit Freigabe ausstehend wählen
Status auf In Produktion setzen
Warnung erscheint
Trotz Warnung speichern klicken
Auftrag muss in Tab In Produktion erscheinen
Browser neu laden
Auftrag muss dort bleiben
```

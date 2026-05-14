# Orders Approval Modal

## Ziel

Die Freigabe-Warnung für Aufträge wird jetzt als echtes Modal-Popup angezeigt.

## Betroffene Datei

```text
src/pages/OrdersPage.tsx
```

## Verhalten

Wenn ein Auftrag ohne gültige Freigabe auf `In Produktion` gesetzt wird, erscheint ein Modal über der Auftragsmaske.

Das Modal zeigt:

```text
Auftrag
Produkt
Kunde
aktuellen Freigabestatus
```

Aktionen:

```text
Abbrechen
Trotzdem speichern
```

## Abbrechen

Bei `Abbrechen` wird der Status wieder auf den vorherigen Tab beziehungsweise den ursprünglichen Status zurückgesetzt.

## Trotzdem speichern

Bei `Trotzdem speichern` wird der Auftrag direkt gespeichert und bleibt anschließend in `Alle Aufträge` sichtbar.

## Vorteile

```text
klarer als ein Inline-Warnblock
bewusste Entscheidung nötig
optisch sauberer
besser für spätere Produktionslogik
```

## Test

```text
Aufträge öffnen
Schloss öffnen
Auftrag mit Freigabe ausstehend wählen
Status auf In Produktion setzen
Modal muss erscheinen
Abbrechen klicken
Status wird zurückgesetzt
erneut Status auf In Produktion setzen
Trotzdem speichern klicken
Auftrag wird gespeichert
```

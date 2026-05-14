# Quote Duplicate Order Guard

## Ziel

Aus demselben Angebot soll nicht versehentlich mehrfach ein Auftrag erstellt werden.

## Betroffene Datei

```text
src/pages/QuotesPage.tsx
```

## Logik

Die Angebotsseite prüft:

```ts
orders.find((order) => order.quoteId === selectedQuote.id)
```

Wenn zu einem Angebot bereits ein Auftrag existiert, erscheint ein `ConfirmDialog`.

## Dialog

Titel:

```text
Auftrag existiert bereits
```

Aktionen:

```text
Abbrechen
Weiteren Auftrag erstellen
```

## Verhalten

```text
kein vorhandener Auftrag
→ normaler Dialog "Angebot in Auftrag umwandeln?"

vorhandener Auftrag
→ Warn-Dialog "Auftrag existiert bereits"
→ nur bei bewusster Bestätigung wird ein weiterer Auftrag erzeugt
```

## Warum

So bleibt es flexibel, falls wirklich mehrere Aufträge aus einem Angebot erstellt werden sollen, aber versehentliche Duplikate werden verhindert.

## Test

```text
Angebote öffnen
Angebot auswählen
Auftrag erstellen
Auftrag bestätigen
erneut dasselbe Angebot auswählen
Auftrag erstellen
Warn-Dialog muss erscheinen
Abbrechen: kein neuer Auftrag
Weiteren Auftrag erstellen: zusätzlicher Auftrag wird erzeugt
```

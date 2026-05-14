# Orders Compact Approval Warning

## Ziel

Der Warnblock für Aufträge ohne gültige Freigabe wurde optisch kompakter gemacht.

## Betroffene Datei

```text
src/pages/OrdersPage.tsx
```

## Änderung

Der Warnblock unter dem Statusfeld hat jetzt:

```text
weniger Padding
kleinere Abstände
kürzeren Text
Buttons in derselben Zeile
kompaktere Höhe
```

## Verhalten

Die Logik bleibt unverändert:

```text
Status auf In Produktion
Freigabe fehlt
Warnblock erscheint
Zurücksetzen oder Trotzdem speichern
```

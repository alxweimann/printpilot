# Orders Table No-Wrap Fix

## Ziel

In der Auftragsliste sollen wichtige Kurzwerte nicht umbrechen.

## Problem

Auftragsnummern, Fälligkeitsdatum und Status-Badges konnten in der Tabelle umbrechen.

Beispiele:

```text
AU-2026-
011

2026-05-
17
```

## Lösung

In `OrdersPage.tsx` wurden die betreffenden Tabellenzellen auf `whiteSpace: "nowrap"` gesetzt.

Betroffene Spalten:

```text
Auftragsnummer
Fälligkeitsdatum
Freigabe-Badge
Status-Badge
```

## Bewusst nicht geändert

Kunde und Produkt dürfen weiterhin umbrechen, weil diese Inhalte länger sein können.

## Test

```text
Aufträge öffnen
Alle Aufträge anzeigen
Auftragsnummern prüfen
Fälligkeitsdatum prüfen
Freigabe- und Status-Badges prüfen
```

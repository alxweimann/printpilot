# All Tables No-Wrap Fix

## Ziel

Kurze Schlüsselwerte sollen in allen Tabellenbereichen nicht mehr umbrechen.

## Betroffene Bereiche

```text
Angebote
Aufträge
Kunden
Material
Maschinen
Leistungen / Services
Weiterverarbeitung / Finishing
Vorlagen / Templates
```

## Kein Umbruch mehr bei

```text
Angebotsnummern
Auftragsnummern
Kundennummern
Materialnummern
Maschinennummern
Leistungsnummern
Weiterverarbeitungsnummern
Vorlagennummern
Datumswerten
Fälligkeitswerten
Status-Badges
Freigabe-Badges
kurzen technischen Werten wie Format, Einheit, Preis, Bestand, Preismodell
```

## Bewusst weiterhin mit möglichem Umbruch

```text
Kunde
Produkt
Name
Beschreibung
Betreff
lange Freitextwerte
```

## Umsetzung

Die betroffenen Tabellenzellen verwenden:

```tsx
style={{ whiteSpace: "nowrap" }}
```

## Warum nicht alles auf nowrap?

Lange Inhalte wie Kundenname oder Produktname sollen weiterhin umbrechen dürfen, damit Tabellen nicht zu breit werden.

## Test

```text
npm run build
npm run dev

Alle relevanten Module öffnen
Tabellen prüfen
Nummern / Datum / Status dürfen nicht umbrechen
lange Namen dürfen weiterhin umbrechen
```

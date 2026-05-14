# Status Badge Colors

## Ziel

Alle Statuszustände in PrintPilot sollen einheitlich farblich markiert werden.

## Neue zentrale Datei

```text
src/data/statusBadges.ts
```

## Neue Hilfsfunktion

```ts
getPrintPilotStatusBadgeVariant(status)
```

## Farbgruppen

### Grün / success

```text
Aktiv
Auf Lager
Angenommen
Fertig
Freigabe erteilt
```

### Orange / warning

```text
Offen
Optional
Entwurf
Wartet
Wartung
Knapp
In Produktion
Korrektur angefordert
```

### Rot / danger

```text
Abgelehnt
Bestellen
Freigabe ausstehend
Daten unvollständig
```

### Grau / neutral

```text
Archiv
Inaktiv
Interessent
Nicht erforderlich
sonstige / unbekannte Statuswerte
```

## Umgestellte Bereiche

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

## Warum zentral?

Die Farblogik soll nicht in jeder Seite einzeln gepflegt werden.

Wenn später ein Status ergänzt oder farblich geändert wird, reicht eine Änderung in:

```text
src/data/statusBadges.ts
```

## Test

```text
npm run build
npm run dev

Alle Module öffnen
Tabellen prüfen
Status-Badges prüfen
Status ändern
Speichern
Farbe muss zum neuen Status passen
```

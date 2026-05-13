# PrintPilot Workflow-Stand

## Aufträge

Die Auftragsseite ist aktuell der am weitesten entwickelte Workflow-Bereich.

## Tabs

```text
Alle Aufträge
Neu
In Produktion
Wartet
Fertig
Archiv
```

`Alle Aufträge` zeigt alle Aufträge unabhängig vom Status.

## Felder

### Status

```text
Neu
In Produktion
Wartet
Fertig
Archiv
```

### Freigabe

```text
Freigabe ausstehend
Freigabe erteilt
Korrektur angefordert
Daten unvollständig
Nicht erforderlich
```

### Übergabe

```text
Druckdaten prüfen
Wartet auf Daten
In Druck
In Weiterverarbeitung
Abholbereit
Versendet
Abgeschlossen
```

### Priorität

```text
Niedrig
Normal
Hoch
Express
```

### Maschine

Maschinen werden aus dem Store geladen.

Der Auftrag speichert:

```text
machineId
```

Die Maschinen kommen aus:

```text
data.machines
```

## Freigabe-Logik

Eine Warnung erscheint, wenn ein Auftrag produktionsrelevant ist und keine gültige Freigabe hat.

Produktionsrelevant:

```text
Status = In Produktion
oder Übergabe = In Druck
oder Übergabe = In Weiterverarbeitung
```

Gültige Freigaben:

```text
Freigabe erteilt
Nicht erforderlich
```

Warnung bei:

```text
Freigabe ausstehend
Korrektur angefordert
Daten unvollständig
```

## Automatische Statuslogik

Wenn die Übergabe gesetzt wird auf:

```text
In Druck
In Weiterverarbeitung
```

dann wird der Auftragsstatus automatisch gesetzt auf:

```text
In Produktion
```

## ConfirmDialog

Die Warnung erscheint als modales Popup über:

```text
src/ui/ConfirmDialog.tsx
```

Aktionen:

```text
Abbrechen
Trotzdem speichern
```

Bei `Abbrechen` werden Status, Übergabe und Freigabe auf den zuletzt gespeicherten Stand zurückgesetzt.

Bei `Trotzdem speichern` wird direkt gespeichert.

## Angebote

Die Angebotsseite hat jetzt:

```text
Alle Angebote
Entwurf
Offen
Angenommen
Abgelehnt
```

`Alle Angebote` zeigt alle Angebote unabhängig vom Status.

## Geplanter Workflow: Dokumenten-/Ausgabesystem

Die Auftragstasche wird Teil eines größeren Dokumenten- und Ausgabesystems.

Geplante Dokumenttypen:

```text
Angebot
Kalkulation
Auftragstasche
Lieferschein
Rechnung
Mahnung
Etiketten
Versand-/Kartonaufkleber
Produktionsschein
```

Grundfunktionen:

```text
Vorschau anzeigen
PDF erstellen
drucken
optional per E-Mail senden
```

## Auftragstasche

Die Auftragstasche gehört zu einem konkreten Auftrag und soll später als eigener Ausgabe-/Vorschau-Bereich innerhalb der Auftragsbearbeitung erscheinen.

Geplante Struktur:

```text
Auftragsdaten
Produktion
Auftragstasche
```

Mögliche Empfänger:

```text
Druckvorstufe
Digitaldruck
Großformat
Weiterverarbeitung
Versand / Auslieferung
Büro / Abrechnung
```

## Etiketten / Kartonaufkleber

Etiketten sollen für Kartons, Produktion und Versand genutzt werden.

Typische Inhalte:

```text
Auftragsnummer
Kunde
Produkt
Lieferdatum
Karton 1 von 3
Abteilung / Zielbereich
Priorität
Barcode oder QR-Code
Hinweise wie Eilt / Abholung / Versand / Teillieferung
```

Geplante Funktionen:

```text
Etikettengröße wählen
Anzahl Etiketten eingeben
Kartonanzahl automatisch erzeugen
PDF zum Drucken
Thermoetiketten oder A4-Bogen
```

## Nächster Workflow-Schritt

Empfohlen:

```text
Angebot → Auftrag vorbereiten
```

Danach:

```text
Dokumenten-/Ausgabesystem vorbereiten
Auftragstasche als erste Druckausgabe
Etiketten / Kartonaufkleber
```

Ziel für Angebot → Auftrag:

```text
Angenommenes Angebot auswählen
Aktion "Auftrag erstellen"
Auftragsentwurf erzeugen
Daten übernehmen
in Alle Aufträge sichtbar machen
```

Wichtig:

```text
erst kontrollierte Aktion
keine automatische Magie
ConfirmDialog für Umwandlung verwenden
```

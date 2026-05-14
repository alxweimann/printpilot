# Dokumenten- und Ausgabesystem

## Ziel

PrintPilot soll aus Store-Daten druckbare und versendbare Dokumente erzeugen.

## Geplante Dokumenttypen

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

## Grundfunktionen

```text
Vorlage
Vorschau
Drucken
PDF erstellen
optional per E-Mail senden
```

## Verbindung zu Vorlagen

Grundlage:

```text
Vorlagen / Templates
```

Relevante Felder:

```text
type
area
isDefault
productType
outputLayout
```

## Auftragstasche

Zweck:

```text
interne Produktionsunterlage
Deckblatt für Auftragstasche
Druckunterlage für Abteilungen
```

Mögliche Inhalte:

```text
Auftragsnummer
Kunde
Produkt / Betreff
Liefertermin / Fälligkeit
Maschine
Material
Auflage
Endformat
Farbigkeit
Duplex / Simplex
Weiterverarbeitung
Freigabestatus
Übergabestatus
Priorität
interne Hinweise
Abteilungshinweise
```

## Etiketten / Kartonaufkleber

Zweck:

```text
Kartonkennzeichnung
Produktionskennzeichnung
Versandvorbereitung
interne Zuordnung
```

Typische Inhalte:

```text
Auftragsnummer
Kunde
Produkt
Lieferdatum
Karton 1 von 3
Abteilung / Zielbereich
Priorität
Freigabestatus
Übergabestatus
Barcode oder QR-Code
Hinweise wie Eilt / Abholung / Versand / Teillieferung
```

## Weitere Ausgaben

```text
Lieferschein
Rechnung
Mahnung
Angebots-PDF
interne/externe Kalkulation
```

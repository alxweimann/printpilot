# Dokumenten- und Ausgabesystem

## Ziel

PrintPilot soll später ein zentrales Dokumenten- und Ausgabesystem bekommen.

Dieses System erzeugt aus den vorhandenen Store-Daten druckbare und versendbare Dokumente.

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

## Grundprinzip

Jeder Dokumenttyp soll später haben:

```text
Vorlage
Vorschau
Drucken
PDF erstellen
optional: per E-Mail senden
```

## Verbindung zu Vorlagen

Das Modul `Vorlagen / Templates` ist die Grundlage für das spätere Ausgabesystem.

Geplante Verbindung:

```text
template.type = Angebot / Rechnung / Lieferschein / Auftragstasche / Etikett
template.area = Verkauf / Produktion / Ausgabe / Faktura
template.isDefault = Standardvorlage ja/nein
template.outputLayout = Layoutvariante
```

## Auftragstasche

Die Auftragstasche ist ein geplanter Dokumenttyp für interne Produktion.

Sie soll zu einem konkreten Auftrag gehören und als interne Produktionsunterlage dienen.

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

Geplante Ausgabe:

```text
Vorschau
PDF
Druck
E-Mail an Abteilung
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

Etiketten sind ein eigener wichtiger Dokumenttyp.

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
Paket / Karton 1 von 3
Abteilung / Zielbereich
Priorität
Freigabestatus
Übergabestatus
Barcode oder QR-Code
Hinweise wie Eilt / Abholung / Versand / Teillieferung
```

Mögliche Etikettenarten:

```text
Kartonetikett
Produktionsetikett
Versandetikett
Abhol-Etikett
Abteilungs-Etikett
Paketnummer-Etikett
```

Geplante Funktionen:

```text
Etikettengröße wählen
Anzahl Etiketten eingeben
Kartonanzahl automatisch erzeugen
PDF zum Drucken
Thermoetiketten oder A4-Bogen
Barcode / QR-Code später möglich
```

## Beispiel Kartonetikett

```text
AU-2026-042
Musterkunde GmbH
Broschüre A4
Karton 1/4
Lieferung: 20.05.2026
```

## Beispiel Produktionsetikett

```text
Druckvorstufe → Digitaldruck
Maschine: Xerox Iridesse 1
Priorität: Express
Freigabe: erteilt
```

## Angebotsausgabe

Später soll aus einem Angebot ein druckbares oder versendbares Angebots-PDF erzeugt werden.

Mögliche Ausgabe:

```text
Angebots-PDF
Druckversion
E-Mail-Anhang
```

## Kalkulationsausgabe

Die Kalkulation soll später als interne oder externe Ausgabe erzeugbar sein.

Mögliche Varianten:

```text
interne Kalkulation mit Kosten und Deckungsbeitrag
externe Kalkulation ohne interne Kosten
Kurzansicht für Angebot
```

## Lieferschein

Lieferschein-Ausgabe aus Auftrag.

Mögliche Inhalte:

```text
Kunde
Lieferadresse
Auftragsnummer
Positionen
Mengen
Packstücke
Lieferart
Abhol-/Versandhinweis
```

## Rechnung

Rechnungs-Ausgabe aus Auftrag oder Angebot.

Mögliche Inhalte:

```text
Rechnungsnummer
Kunde
Positionen
Mengen
Einzelpreise
Summen
Zahlungsziel
Steuerhinweise
```

## Mahnung

Mahnung später auf Basis offener Rechnungen.

Mögliche Stufen:

```text
Zahlungserinnerung
1. Mahnung
2. Mahnung
letzte Mahnung
```

## Roadmap-Position

Das Dokumenten-/Ausgabesystem kommt nach:

```text
Angebot → Auftrag
```

Erste konkrete Ausgabe:

```text
Auftragstasche
```

Danach:

```text
Etiketten / Kartonaufkleber
Lieferschein
Rechnung
Mahnung
Angebot
Kalkulation
```

## Wichtig

Erst vorbereiten:

```text
Auftrag enthält genug Produktionsdaten
Material / Maschine / Weiterverarbeitung sind verknüpft
Vorlagenmodul ist nutzbar
```

Dann bauen:

```text
Vorschau
Drucklayout
PDF-Export
E-Mail-Versand
```

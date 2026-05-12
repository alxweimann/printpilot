# PrintPilot Roadmap

## Aktueller Meilenstein abgeschlossen

Die Grundmodule sind persistent an den Store angebunden.

Abgeschlossen:

```text
Angebote
Aufträge
Kunden
Material
Maschinen
Leistungen / Services
Weiterverarbeitung / Finishing
Vorlagen / Templates
Einstellungen
Backup Export
Backup Import "Alles ersetzen"
localStorage Persistenz
```

## Nächster Meilenstein

Modulverknüpfungen.

## Empfohlene Reihenfolge

### 1. Angebot zu Auftrag

Ziel:

```text
Aus einem angenommenen Angebot einen Auftrag vorbereiten.
```

Noch nicht direkt automatisch produktiv, sondern zunächst kontrolliert:

```text
Button / Aktion vorbereiten
Datenübernahme definieren
Auftragsentwurf erzeugen
Store aktualisieren
```

---

### 2. Kunde zu Angebot / Auftrag

Ziel:

```text
Kundendaten zentral für Angebote und Aufträge nutzen.
```

Mögliche Felder:

```text
customerId
customerName
paymentTerm
priceLevel
contact
email
```

---

### 3. Material in Kalkulation

Ziel:

```text
Materialdaten aus dem Store für Kalkulationsgrundlage nutzen.
```

Relevante Felder:

```text
format
grain
pricePerReam
sheetsPerReam
stock
minimumStock
```

---

### 4. Maschinen in Kalkulation

Ziel:

```text
Maschinenkosten und Klickkosten aus dem Store nutzen.
```

Relevante Felder:

```text
hourlyRate
colorClickCost
blackClickCost
duplex
colorMode
```

---

### 5. Leistungen und Weiterverarbeitung in Kalkulation

Ziel:

```text
Zusatzleistungen und Weiterverarbeitung als Kostenbausteine verfügbar machen.
```

Bereiche:

```text
services
finishing
```

---

### 6. Vorlagen in Ausgabe

Ziel:

```text
Angebote, Aufträge, Lieferscheine und Rechnungen über Templates ausgeben.
```

Relevante Felder:

```text
type
area
isDefault
productType
outputLayout
```

## Grundregel

```text
Eine Verknüpfung pro Schritt.
Keine Massenänderungen.
Immer Build testen.
Immer pushen.
```

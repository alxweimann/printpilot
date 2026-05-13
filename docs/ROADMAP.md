# PrintPilot Roadmap

## Aktueller Meilenstein abgeschlossen

Grundmodule und zentrale UI-Standards sind stabilisiert.

Abgeschlossen:

```text
Angebote persistent
Aufträge persistent
Kunden persistent
Material persistent
Maschinen persistent
Leistungen / Services persistent
Weiterverarbeitung / Finishing persistent
Vorlagen / Templates persistent
Einstellungen persistent
Backup Export
Backup Import "Alles ersetzen"
localStorage Persistenz
Alle Angebote Übersicht
Alle Aufträge Übersicht
zentrale Badge-Farblogik
zentrale ConfirmDialog-Komponente
Auftrags-Freigabe-/Produktionslogik
```

## Nächster Meilenstein

Modulverknüpfungen.

## Empfohlene Reihenfolge

### 1. Angebot zu Auftrag

Ziel:

```text
Aus einem angenommenen Angebot einen Auftrag vorbereiten.
```

Vorgehen:

```text
Button / Aktion in Angebote vorbereiten
ConfirmDialog zur Bestätigung
Auftragsentwurf erzeugen
Daten übernehmen
orders aktualisieren
nach Alle Aufträge wechseln
```

Mögliche Datenübernahme:

```text
quoteId
customerId
customerName
subject → product
delivery terms → handoff / Hinweis später
status = Neu
approval = Freigabe ausstehend
priority = Normal
```

---

### 2. Dashboard-Plantafel

Ziel:

```text
Wochenübersicht auf dem Dashboard
```

Grundlage:

```text
orders.dueDate
orders.customerName
orders.product
orders.status
orders.priority
orders.machineId
orders.approval
orders.handoff
```

Erste Version:

```text
Montag bis Freitag / Samstag
Auftragskarten pro Fälligkeitstag
Farben nach Status / Freigabe
```

Später:

```text
Maschinenfilter
Drag & Drop
Überfällig-Markierung
Produktionsdatum
Lieferdatum
Tagesstatus
```

---

### 3. Kunde zu Angebot / Auftrag

Ziel:

```text
Kundendaten zentral nutzen.
```

Relevante Felder:

```text
customerId
customerName
paymentTerm
priceLevel
contact
email
```

---

### 4. Material in Kalkulation

Ziel:

```text
Materialdaten aus Store für Kalkulation nutzen.
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

### 5. Maschinen in Kalkulation

Ziel:

```text
Maschinenkosten aus Store nutzen.
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

### 6. Leistungen und Weiterverarbeitung in Kalkulation

Ziel:

```text
Zusatzleistungen und Weiterverarbeitung als Kostenbausteine verwenden.
```

Bereiche:

```text
services
finishing
```

---

### 7. Vorlagen in Ausgabe

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

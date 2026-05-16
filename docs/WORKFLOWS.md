# PrintPilot Workflows

## Angebot → Auftrag

Status: umgesetzt.

Ablauf:

```text
Angebot auswählen
Auftrag erstellen
ConfirmDialog bestätigen
neuer Auftrag wird erzeugt
Angebot bleibt erhalten
Auftrag erscheint in Alle Aufträge
```

Technik:

```text
addOrder(order)
createPrintPilotOrderFromQuote(quote, existingOrders)
```

Datenübernahme:

```text
quote.id → quoteId
customerId → customerId
customerName → customerName
subject → product
validUntil → dueDate
```

Standardwerte:

```text
status = Neu
priority = Normal
handoff = Druckdaten prüfen
approval = Freigabe ausstehend
machineId = null
```

## Dublettenwarnung

Wenn bereits ein Auftrag aus einem Angebot existiert:

```text
ConfirmDialog "Auftrag existiert bereits"
Abbrechen
Weiteren Auftrag erstellen
```

## Auftragsworkflow

Tabs:

```text
Alle Aufträge
Neu
In Produktion
Wartet
Fertig
Archiv
```

Freigabe:

```text
Freigabe ausstehend
Freigabe erteilt
Korrektur angefordert
Daten unvollständig
Nicht erforderlich
```

Übergabe:

```text
Druckdaten prüfen
Wartet auf Daten
In Druck
In Weiterverarbeitung
Abholbereit
Versendet
Abgeschlossen
```

Warnung erscheint, wenn:

```text
Status = In Produktion
oder Übergabe = In Druck
oder Übergabe = In Weiterverarbeitung
```

und gleichzeitig die Freigabe nicht gültig ist.

Gültig:

```text
Freigabe erteilt
Nicht erforderlich
```

## Geplante Workflows

```text
Dokumenten-/Ausgabesystem
Auftragstasche
Etiketten / Kartonaufkleber
Dashboard-Plantafel
DetailDrawer-Layout
Kalkulationsverknüpfungen
```

## Workflow-Store-Realignment

Die komplette Dokumentkette ist wieder konsistent verdrahtet.

```text
Angebot → Auftrag
Auftrag → Lieferschein
Auftrag → Rechnung
Rechnung → Mahnung
Rechnung Bezahlt → Mahnung Erledigt
```

Die automatische Mahnungserledigung passiert zentral in `PrintPilotStore.tsx` innerhalb von `updateInvoice()`.

## Nummernkreis-Synchronisierung

Beim Laden des Stores prüft PrintPilot die höchsten vorhandenen Dokumentnummern je Prefix.

```text
AU-2026-011 → orderNextNumber mindestens 2026-012
LS-2026-003 → deliveryNoteNextNumber mindestens 2026-004
RE-2026-009 → invoiceNextNumber mindestens 2026-010
MA-2026-008 → reminderNextNumber mindestens 2026-009
```

Dadurch entstehen keine Dubletten, wenn Nummernkreise nachträglich eingeführt oder alte Daten geladen werden.

## Neues Angebot erstellen

Die Angebotsseite erzeugt neue Angebote über den zentralen Store.

Ablauf:

```text
1. Button „Neues Angebot“ klicken
2. Nummer wird aus quotePrefix + quoteNextNumber erzeugt
3. Angebot wird als Entwurf gespeichert
4. quoteNextNumber wird automatisch erhöht
5. neuer Datensatz wird ausgewählt und im Drawer geöffnet
6. Drawer ist direkt bearbeitbar
```

## Angebotsänderung → Folgebelege synchronisieren

Änderungen an einem Angebot werden an verknüpfte Folgebelege weitergereicht.

```text
quote.id = order.quoteId
order.id = deliveryNote.orderId / invoice.orderId
invoice.id = reminder.invoiceId
```

Synchronisiert werden aktuell Kunde, Betreff/Produkt und Auftragsfrist.

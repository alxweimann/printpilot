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

## Auftrag → Rechnung

Der Auftragsdrawer enthält die Aktion `Rechnung erstellen`.

Ablauf:

```text
1. Auftrag auswählen
2. Aktion „Rechnung erstellen“ auslösen
3. System prüft, ob bereits eine Rechnung mit gleicher orderId existiert
4. Wenn keine Rechnung existiert:
   - neue Rechnung wird erzeugt
   - Rechnung erhält orderId und orderNumber des Auftrags
   - Kunde und Produkt werden übernommen
   - Rechnungsstatus = Entwurf
   - Rechnungsdatum = aktuelles Datum
   - Fälligkeit = Rechnungsdatum + 14 Tage
5. Wenn eine Rechnung existiert:
   - keine weitere Rechnung wird erzeugt
   - Hinweis verhindert Dublette
```

Technischer Standard:

```text
order.id → invoice.orderId
order.number → invoice.orderNumber
order.customerId → invoice.customerId
order.customerName → invoice.customerName
order.product → invoice.subject
```

## Workflow-Store-Merge

Die Workflows `Auftrag → Lieferschein` und `Auftrag → Rechnung` teilen sich die gemeinsame Store-Struktur.

```text
orders[]
deliveryNotes[]
invoices[]
```

Die Verknüpfung erfolgt jeweils über `orderId` und `orderNumber`.

## Rechnung → Mahnung

Der Rechnungsdrawer enthält die Aktion `Mahnung erstellen`.

Ablauf:

```text
1. Rechnung auswählen
2. Aktion „Mahnung erstellen“ auslösen
3. System prüft, ob bereits eine Mahnung mit gleicher invoiceId existiert
4. Wenn keine Mahnung existiert:
   - neue Mahnung wird erzeugt
   - Mahnung erhält invoiceId und invoiceNumber der Rechnung
   - Kunde und Betreff werden übernommen
   - Mahnstatus = Entwurf
   - Mahnstufe = 1. Mahnung
   - Frist = 7 Tage
5. Wenn eine Mahnung existiert:
   - keine weitere Mahnung wird erzeugt
   - Hinweis verhindert Dublette
```

Technischer Standard:

```text
invoice.id → reminder.invoiceId
invoice.number → reminder.invoiceNumber
invoice.customerId → reminder.customerId
invoice.customerName → reminder.customerName
invoice.subject → reminder.subject
```

## Hotfix Mahn-Workflow Store

`addReminder` ist Bestandteil des Store-Context-Values und steht damit dem Rechnungsdrawer zur Aktion `Mahnung erstellen` zur Verfügung.

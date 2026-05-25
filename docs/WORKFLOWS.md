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

## Full Workflow Consistency Fix

Die komplette Dokumentkette ist wieder aus einem konsistenten Store-Stand verdrahtet.

```text
Angebot erstellen
Angebot → Auftrag
Auftrag → Lieferschein
Auftrag → Rechnung
Rechnung → Mahnung
Angebot/Auftrag Änderungen → Folgebelege synchronisieren
```

## Workflow-Hinweise

Die ersten Dokumentdrawer enthalten fachliche Hinweise.

```text
Angebot ohne Kunde → Kunde fehlt
Angebot ohne Betreff → Betreff/Produkt fehlt
Angebot ohne Gültigkeit → Gültigkeit fehlt
Auftrag ohne Maschine → Maschine fehlt
Auftrag Freigabe ausstehend → Freigabe prüfen
Auftrag Druckdaten prüfen → Datenprüfung offen
```

## Dashboard Workflow-Kennzahlen

Das Dashboard nutzt Store-Daten für operative Kennzahlen und Schnellzugriffe.

```text
Überfällige Rechnungen → Rechnung prüfen
Offene Mahnungen → Zahlung/Frist prüfen
Aufträge in Produktion → Produktionsstatus prüfen
Versandbereite Lieferscheine → Versand/Abholung vorbereiten
```

## Hotfix Dashboard Datumsformat

Der Dashboard-Stand nutzt ein explizites Datumsformat, damit der Build sauber läuft.

## Dashboard Stand-Anzeige

Das Dashboard zeigt den aktuellen Stand jetzt mit Datum und Uhrzeit im Schnellzugriff-Kopf.

## Dashboard Priorisierung

Der Handlungsbedarf im Dashboard folgt einer festen fachlichen Priorität: überfällige Rechnungen, Mahnungen, Versand, Produktion, wartende Aufträge und offene Angebote.

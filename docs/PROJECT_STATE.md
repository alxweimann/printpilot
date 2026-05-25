# Project State

- Sidebar LED-Anzeige vereinfacht: ohne Systemzeit-Label und ohne äußeren Rahmen, Datum/Uhrzeit gleich breit

- Sidebar LED-Anzeige: Hintergründe/Rahmen vollständig entfernt und Ziffern größer gesetzt

- Sidebar LED-Anzeige: beide Zeilen gleich breit, Schrift größer und Glow reduziert

## Full Workflow Consistency Fix

Store, Datenmodell, Backup und Dokumentseiten wurden als vollständiges Konsistenzpaket zusammengeführt.

Enthalten:

```text
addQuote/addDeliveryNote/addInvoice/addReminder
updateDeliveryNote/updateInvoice/updateReminder
Store-bound DeliveryNotesPage/InvoicesPage/RemindersPage
Neues Angebot erstellen
Nummernkreis-Synchronisierung
Angebot → Folgebelege Kaskade
Auftrag → Folgebelege Normalisierung
```

## Workflow-Hinweise in Drawern

Angebots- und Auftragsdrawer zeigen jetzt fachliche Hinweise/Ampeln.

```text
Angebot: Kunde fehlt, Betreff fehlt, Gültigkeit fehlt, angenommen
Auftrag: Maschine fehlt, Freigabe ausstehend, Druckdaten prüfen, fertig
```

## Ausgabe-Status und Ausgabe-Historie

Ausgabeaktionen setzen den passenden Workflow-Status und erzeugen automatisch einen Historieneintrag am Dokument.

```text
Angebot ausgeben → Status Offen + Historie
Lieferschein ausgeben → Status Versandbereit + Historie
Rechnung ausgeben → Status Offen + Historie
Mahnung ausgeben → Status Versendet + Historie
```

## Historie für Statusänderungen und offener Drawer

Manuelle Statusänderungen werden jetzt beim Speichern in die Historie geschrieben.

Außerdem bleibt der Drawer nach dem Ausgeben von Lieferscheinen, Rechnungen und Mahnungen offen, damit Status und Historieneintrag direkt sichtbar bleiben.

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

## Ausgabe-Historie

Ausgabeaktionen erzeugen Historieneinträge am Dokument.

```text
Zeitpunkt
Aktion
Status danach
```

Die Historie wird im Drawer angezeigt, sobald mindestens ein Eintrag vorhanden ist.

## Statusänderungen in Historie

Wenn ein Dokumentstatus beim normalen Speichern geändert wurde, erzeugt PrintPilot einen Historieneintrag.

```text
Status alt → Status neu
Historie: <Dokument>: Status geändert
Status danach: <neuer Status>
```

Ausgeben-Aktionen lassen den Drawer geöffnet, damit der neue Historieneintrag direkt sichtbar ist.

## Historie Statuswechsel

Manuelle Statusänderungen erzeugen Historieneinträge mit altem und neuem Status.

```text
Lieferschein: Status geändert
Versandbereit → Geliefert

Mahnung: Status geändert
Versendet → Erledigt
```

Neueste Einträge erscheinen oben. Direkt sichtbar sind maximal 5 Einträge.

## Rechnung Speichern vs. Ausgeben

Die Rechnungsseite trennt jetzt zwei fachliche Aktionen:

```text
Änderungen speichern = Status aus dem Formular speichern
Rechnung ausgeben = Status Offen setzen
```

## Angebot Speichern vs. Ausgeben

Die Angebotsseite trennt jetzt zwei fachliche Aktionen:

```text
Änderungen speichern = Status aus dem Formular speichern
Angebot ausgeben = Status Offen setzen
```

## Auftragshistorie

Aufträge erzeugen Historieneinträge bei relevanten Änderungen.

```text
Auftrag: Status geändert
Neu → In Produktion

Auftrag: Freigabe geändert
Freigabe ausstehend → Freigabe erteilt

Auftrag: Übergabe geändert
Druckdaten prüfen → In Druck
```

## Folgebeleg-Erstellung in Historie

Die Erstellung von Folgebelegen wird in der Historie des Ausgangsdokuments protokolliert.

```text
Angebot: Auftrag erstellt
Auftrag: Lieferschein erstellt
Auftrag: Rechnung erstellt
Rechnung: Mahnung erstellt
```

## Verlinkte Folgebeleg-Historie

Die Dokumentkette wird in der Historie mit konkreten Nummern nachvollziehbar.

```text
Angebot → Auftrag erstellt: AU-...
Auftrag → Lieferschein erstellt: LS-...
Auftrag → Rechnung erstellt: RE-...
Rechnung → Mahnung erstellt: MA-...
```

Neue Folgebelege erhalten einen Herkunftseintrag wie `Erstellt aus Auftrag: AU-...`.

## Historie Timeline

Die Historie bleibt fachlich unverändert, wird aber kompakter und besser lesbar als Timeline angezeigt.

Dokumentnummern aus Einträgen wie `Auftrag erstellt: AU-...` werden optisch als Referenz hervorgehoben.

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

## Dashboard Deep-Link

Der Dashboard-Handlungsbedarf speichert beim Klick `pageId` und `itemId` und öffnet nach der Navigation den passenden Datensatz im Master-Detail-Drawer.

## Produktions-Timeline im Dashboard

Die Dashboard-Plantafel zeigt Aufträge der aktuellen Woche als Timeline-Karten mit automatisch berechnetem Fortschritt.

```text
Neu → 10%
Wartet → 20%
Daten/Freigabe fehlen → blockiert
In Druck / In Produktion → 55%
In Weiterverarbeitung → 70%
Abholbereit / Versendet → 90%
Fertig → 100%
```

## Hotfix Plantafel-Typisierung

Die Wochen-Plantafel verwendet für Fälligkeitsgruppen einen expliziten Union-Typ.

## Dashboard Layout

Handlungsbedarf und Produktions-Plantafel stehen jetzt untereinander, damit beide Bereiche über die volle Breite nutzbar sind.

## Kompakte Plantafel

Die Produktions-Plantafel zeigt Auftragskarten jetzt kompakter, damit mehr Wochenplanung ohne Scrollen sichtbar bleibt.

## Plantafel visuelle Verfeinerung

Die Plantafel bleibt fachlich unverändert und wurde nur optisch beruhigt.

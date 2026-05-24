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

## Workflow-Hinweise Rechnungen und Mahnungen

Rechnungen und Mahnungen zeigen im Drawer Statushinweise.

```text
Rechnung Entwurf → Rechnung noch nicht ausgegeben
Rechnung Offen → Zahlungseingang prüfen
Rechnung Überfällig → Mahnung prüfen
Rechnung Bezahlt → Rechnung erledigt
Mahnung Entwurf → Mahnung noch nicht versendet
Mahnung Offen → Zahlungseingang prüfen
Mahnung Versendet → Frist überwachen
Mahnung Erledigt → Mahnung abgeschlossen
```

## Workflow-Hinweise Lieferscheine

Lieferscheine zeigen im Drawer Statushinweise.

```text
Lieferschein Entwurf → Lieferschein noch nicht ausgegeben
Lieferschein Versandbereit → Versand/Abholung vorbereiten
Lieferschein Versendet → Sendung prüfen
Lieferschein Erledigt → Lieferschein abgeschlossen
```

## Hotfix Lieferschein-Hinweise

Ungültige Statusprüfungen wie `Versendet`/`Erledigt` wurden entfernt und durch aktuell erlaubte Lieferschein-Statuswerte ersetzt.

## Hotfix Lieferschein-Hinweise sichtbar

Die Lieferschein-Hinweise werden im Drawer oberhalb des Lieferscheinkopfs gerendert und verwenden die gültigen Statuswerte `Entwurf`, `Versandbereit`, `Geliefert` und `Abgeschlossen`.

## Pflichtfeld-Schutz vor Folgeaktionen

Vor dem Erzeugen von Folgebelegen prüft PrintPilot fachliche Pflichtfelder.

```text
Angebot ohne Kunde → Auftrag blockiert
Angebot ohne Betreff/Produkt → Auftrag blockiert
Angebot ohne Gültigkeit → Auftrag blockiert
Auftrag ohne Kunde → Lieferschein/Rechnung blockiert
Auftrag ohne Produkt → Lieferschein/Rechnung blockiert
```

Die Prüfung läuft sowohl beim Öffnen der Aktion als auch beim finalen Bestätigen.

## Hotfix Pflichtfeld-Schutz Typen

Die Arrays für fehlende Pflichtfelder sind als `string[]` typisiert, damit der Build mit `noImplicitAny` sauber läuft.

## Vorschau-Button sichtbar

`Vorschau prüfen` ist jetzt als echte Footer-Aktion in Angebots- und Auftragsdrawer eingebunden und öffnet `DocumentPreviewDialog`.

## Vorschau-Dialog Layout

Die interne Vorschau wird oberhalb der App mit höherem `z-index` gerendert und bei geöffnetem Drawer optisch nach links versetzt.

## Vorschau-Dialog Vordergrund

Die interne Dokumentvorschau verwendet eine höhere Overlay-Ebene und wird zentral über Drawer und App dargestellt.

## Dokumentvorschau für alle Belegarten

Lieferscheine, Rechnungen und Mahnungen verwenden jetzt ebenfalls `DocumentPreviewDialog`.

```text
Lieferschein → Lieferscheinvorschau
Rechnung → Rechnungsvorschau
Mahnung → Mahnvorschau
```

## Ausgabe-Status

Ausgabe-Aktionen ändern aktuell den Status des Dokuments. Eine echte PDF-Erzeugung folgt später.

```text
Angebot ausgeben = Status Offen
Lieferschein ausgeben = Status Versandbereit
Rechnung ausgeben = Status Offen
Mahnung ausgeben = Status Versendet
```

## Hotfix Ausgabe-Status Lieferschein/Mahnung

Lieferschein- und Mahnungsdrawer trennen jetzt Speichern und Ausgeben.

```text
Speichern → kein erzwungener Statuswechsel
Lieferschein ausgeben → Versandbereit
Mahnung ausgeben → Versendet
```

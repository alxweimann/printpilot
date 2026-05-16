# PrintPilot Projektstand

Stand: 14.05.2026

## Hotfix

DetailDrawer rendert jetzt per React Portal direkt in `document.body`.

Damit öffnet der Drawer zuverlässig rechts über der App und nicht mehr unten im Seitenfluss.

## Workflow-Store-Realignment

Store, Datenmodell, Backup und Workflow-Seiten wurden wieder auf einen konsistenten Stand gebracht.

```text
printPilotStore.ts enthält deliveryNotes, invoices, reminders
PrintPilotStore.tsx enthält add/update für deliveryNotes, invoices, reminders
backup.ts kennt deliveryNotes, invoices, reminders
DeliveryNotesPage liest aus dem Store
InvoicesPage liest aus dem Store und enthält Mahnungs-Statusschutz
RemindersPage liest aus dem Store
```

Die Statusfolge `Rechnung Bezahlt → Mahnung Erledigt` liegt zentral in `updateInvoice()`.

## Nummernkreis-Synchronisierung

Die Nummernkreise werden beim Laden und Ersetzen des Stores mit vorhandenen Dokumentnummern synchronisiert.

Beispiel:

```text
vorhanden: AU-2026-011
Einstellung: AU / 2026-001
synchronisiert: AU / 2026-012
```

Die Synchronisierung erhöht Nummern nur auf den nächsten freien Stand und senkt manuell höhere Werte nicht ab.

## Neues Angebot erstellen

Die Angebotsseite kann jetzt neue Angebote erzeugen.

```text
Button „Neues Angebot“
AG-Nummernkreis aus Einstellungen
neues Angebot im Store speichern
quoteNextNumber automatisch erhöhen
neues Angebot direkt im Drawer öffnen
Drawer direkt entsperrt
```

## Kaskadenlogik: Angebot aktualisiert Folgebelege

Wenn ein Angebot nachträglich geändert wird, werden verknüpfte Folgebelege synchronisiert.

```text
Angebot.customerName → Auftrag.customerName
Angebot.subject → Auftrag.product
Angebot.validUntil → Auftrag.dueDate
verknüpfte Lieferscheine/Rechnungen/Mahnungen werden ebenfalls aktualisiert
```

Damit bleibt ein Auftrag konsistent, wenn ein Angebot zuerst ohne Kundenname erstellt und später korrigiert wird.

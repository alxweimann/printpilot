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

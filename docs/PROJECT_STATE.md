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

## CSS-Import wiederhergestellt

`src/main.tsx` importiert wieder `./styles/globals.css`.

Damit wird das PrintPilot-Layout wieder korrekt geladen und die App fällt nicht mehr auf ungestyltes Browser-HTML zurück.

## CSS-Import Typdeklaration

`src/vite-env.d.ts` wurde ergänzt, damit TypeScript CSS-Side-Effect-Imports wie `import "./styles/globals.css";` akzeptiert.

## Dashboard mit Workflow-Kennzahlen

Die Startseite zeigt jetzt echte Kennzahlen aus dem Store.

```text
Offene Angebote
Aufträge in Produktion
Versandbereite Lieferscheine
Offene Rechnungen
Überfällige Rechnungen
Offene Mahnungen
Materialhinweise
```

Zusätzlich zeigt das Dashboard eine dynamische Liste mit Vorgängen, bei denen Handlungsbedarf besteht.

## Hotfix Dashboard Datumsformat

Der Dashboard-Zeitstempel nutzt jetzt `formatPrintPilotDateString` mit explizitem Formatargument.

## Dashboard Karten und Stand-Anzeige

Die Dashboard-Kennzahlen wurden optisch kräftiger und gleichmäßiger gestaltet. Die Stand-Anzeige sitzt jetzt als Pill im Schnellzugriff-Kopf und zeigt Datum plus Uhrzeit.

## Dashboard Handlungsbedarf priorisiert

Die Dashboard-Liste `Handlungsbedarf` wird jetzt fachlich priorisiert.

Reihenfolge:

```text
1. Überfällige Rechnungen
2. Offene/versendete Mahnungen
3. Versandbereite Lieferscheine
4. Aufträge in Produktion
5. Wartende Aufträge
6. Offene Angebote
```

Jede Zeile zeigt zusätzlich Priorität und konkreten Handlungshinweis.

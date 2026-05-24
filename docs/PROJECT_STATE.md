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

## Workflow-Hinweise für Rechnungen und Mahnungen

Rechnungs- und Mahnungsdrawer zeigen jetzt fachliche Statushinweise.

```text
Rechnung: Entwurf, Offen, Überfällig, Bezahlt
Mahnung: Entwurf, Offen, Versendet, Erledigt
```

## Workflow-Hinweise für Lieferscheine

Der Lieferschein-Drawer zeigt jetzt fachliche Statushinweise.

```text
Entwurf → Lieferschein noch nicht ausgegeben
Versandbereit → Versand/Abholung vorbereiten
Versendet → Sendung prüfen
Erledigt → Lieferschein abgeschlossen
```

## Hotfix Lieferschein-Hinweise

Die Workflow-Hinweise für Lieferscheine verwenden jetzt nur Statuswerte, die im aktuellen `PrintPilotDeliveryNoteStatus` erlaubt sind.

## Hotfix Lieferschein-Hinweise sichtbar

Die Workflow-Hinweise im Lieferscheindrawer werden jetzt tatsächlich im Drawer gerendert und decken die gültigen Status `Entwurf`, `Versandbereit`, `Geliefert` und `Abgeschlossen` ab.

## Pflichtfeld-Schutz vor Folgeaktionen

Folgebelege werden blockiert, wenn fachliche Pflichtangaben fehlen.

```text
Angebot → Auftrag: Kunde, Betreff/Produkt, Gültigkeit erforderlich
Auftrag → Lieferschein: Kunde und Produkt erforderlich
Auftrag → Rechnung: Kunde und Produkt erforderlich
```

Statt fehlerhafter Folgebelege erscheint ein Hinweisdialog mit den fehlenden Angaben.

## Hotfix Pflichtfeld-Schutz Typen

Die Pflichtfeld-Issue-Arrays in Angebots- und Auftragsseite sind jetzt explizit als `string[]` typisiert.

## Vorschau-Button sichtbar im Footer

Die Buttons `Vorschau prüfen` werden jetzt direkt in den Footern von Angebots- und Auftragsdrawer gerendert.

## Vorschau-Dialog Layout-Fix

Die interne Dokumentvorschau wird jetzt kleiner und weiter links vom geöffneten Detaildrawer positioniert. Dadurch liegt sie nicht mehr ungünstig hinter dem Drawer.

## Vorschau-Dialog im Vordergrund

Die Dokumentvorschau liegt jetzt über dem Drawer und dimmt die gesamte App. Der Drawer bleibt nicht mehr im Vordergrund.

## Dokumentvorschau für Lieferscheine, Rechnungen und Mahnungen

Die Buttons `Vorschau prüfen` in Lieferschein-, Rechnungs- und Mahnungsdrawer öffnen jetzt interne Vorschau-Dialoge.

Damit nutzen alle Belegarten denselben Vorschau-Workflow.

## Ausgabe-Status für Belege

Die Ausgeben-Buttons setzen jetzt fachliche Statuswerte.

```text
Angebot ausgeben → Offen
Lieferschein ausgeben → Versandbereit
Rechnung ausgeben → Offen
Mahnung ausgeben → Versendet
```

Dies ist die Vorstufe zur späteren echten PDF-/Druckausgabe.

## Hotfix Ausgabe-Status Lieferschein/Mahnung

Lieferschein und Mahnung besitzen jetzt getrennte Aktionen:

```text
Änderungen speichern = speichert ohne Statuswechsel
Lieferschein ausgeben = setzt Status Versandbereit
Mahnung ausgeben = setzt Status Versendet
```

Die Ausgeben-Funktion nutzt den aktuellen Draft oder fallbackweise den ausgewählten Datensatz.

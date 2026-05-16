# PrintPilot Projektstand

Stand: 14.05.2026

## Aktueller stabiler Stand

Der aktuelle Stand ist gepushed.

## Umgesetzt

### Tabellen / Sortierung

Die globale Sortierung ist im Kern umgesetzt.

Sortierbar sind:

- Aufträge
- Angebote
- Rechnungen
- Lieferscheine
- Mahnungen
- Kunden
- Material
- Maschinen
- Weiterverarbeitung
- Leistungen
- Vorlagen

Der gemeinsame Sortierstandard liegt in:

```txt
src/ui/useSortableTable.ts
src/ui/SortableTableHeader.tsx
```

### Tabellen-Ausrichtung

Der finale Tabellenstandard ist:

```txt
Header linksbündig
Zellinhalte linksbündig
Sortierpfeile sichtbar
Sortierpfeil rechts neben dem Header-Text
keine verschachtelten th-Strukturen
kein Button-Look bei Sortierköpfen
kein Textcursor bei Sortierköpfen
```

Wichtig:

```tsx
<SortableTableHeader ... />
```

muss direkt im `<tr>` stehen.

Nicht erlaubt:

```tsx
<th>
  <SortableTableHeader ... />
</th>
```

### Master-Detail-Drawer

Bereits umgesetzt:

- Angebote
- Aufträge
- Rechnungen
- Lieferscheine

Standard:

```txt
Tabelle bleibt volle Hauptansicht
Klick auf Tabellenzeile öffnet DetailDrawer rechts
Details liegen im Drawer
Footer-Aktionen liegen im Drawer
ConfirmDialog liegt über dem Drawer
Speichern schließt den Drawer, wenn fachlich sinnvoll
```

### Dialog-Layer

`ConfirmDialog` liegt über geöffneten Drawern.

## Letzter Feinschliff

Die verschachtelten Sortierheader wurden in Angeboten, Rechnungen und Aufträgen entfernt. Damit ist die Tabellenkopf-Struktur jetzt über die Kernseiten vereinheitlicht.

## Rechnungs-Workflow

Der nächste Fachlogik-Workflow ist angebunden:

```text
Auftrag → Rechnung erzeugen
Dubletten-Schutz über orderId
Rechnung wird mit orderId und orderNumber verknüpft
Rechnung übernimmt Kunde und Produkt aus Auftrag
```

## Workflow-Store-Merge

Lieferschein- und Rechnungs-Workflows sind gemeinsam im Store angebunden.

```text
Auftrag → Lieferschein
Auftrag → Rechnung
beide mit Dubletten-Schutz über orderId
Store enthält deliveryNotes und invoices
```

## Mahn-Workflow

Der nächste Fachlogik-Workflow ist angebunden:

```text
Rechnung → Mahnung erzeugen
Dubletten-Schutz über invoiceId
Mahnung wird mit invoiceId und invoiceNumber verknüpft
Mahnung übernimmt Kunde und Betreff aus Rechnung
Mahnstufe startet mit 1. Mahnung
```

- Hotfix: addReminder wird im PrintPilotStoreContext-Value mitgegeben

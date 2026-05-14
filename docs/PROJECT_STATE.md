# PrintPilot Projektstand

## Aktueller Stand

PrintPilot ist ein stabiler UI-/Store-/Workflow-Zwischenstand.

## Persistente Store-Bereiche

```text
Angebote
Aufträge
Kunden
Material
Maschinen
Leistungen / Services
Weiterverarbeitung / Finishing
Vorlagen / Templates
Einstellungen
```

## Umgesetzt

```text
App-weiter Store
localStorage-Persistenz
Backup-Export
Backup-Import "Alles ersetzen"
Sicherheitsbackup vor Import
localStorage-Migrationen
ConfirmDialog-Standard
Status-Badge-Farblogik
einzeilige Tabellenzellen
Alle Angebote Übersicht
Alle Aufträge Übersicht
Angebot → Auftrag
Dublettenwarnung bei Angebot → Auftrag
Freigabe-/Produktionslogik bei Aufträgen
Maschine im Auftrag als Dropdown aus Maschinen-Store
Dokumenten-/Ausgabesystem geplant
Master-Detail-Drawer für Angebote und Aufträge umgesetzt
ConfirmDialog liegt jetzt über geöffneten Detail-Drawern und bleibt mittig bedienbar
```

## Aktuelle Workflows

### Angebote

```text
Alle Angebote
Entwurf
Offen
Angenommen
Abgelehnt
```

Funktionen:

```text
Angebot bearbeiten
Status ändern
Auftrag erstellen
Dublettenwarnung, wenn bereits Auftrag aus Angebot existiert
```

### Aufträge

```text
Alle Aufträge
Neu
In Produktion
Wartet
Fertig
Archiv
```

Funktionen:

```text
Auftrag bearbeiten
Status ändern
Freigabe ändern
Übergabe ändern
Maschine auswählen
Warnung bei Produktion / Druck ohne gültige Freigabe
```

## Noch nicht umgesetzt

```text
echte Datenbank
API
Mehrplatzbetrieb
echte Kalkulationslogik
produktive Rechnung / Lieferschein / Mahnung
PDF-Erzeugung
E-Mail-Versand
Dashboard-Plantafel
Auftragstasche
Etiketten / Kartonaufkleber
```

- Aufträge: Speichern aus dem DetailDrawer schließt den Drawer nach erfolgreichem Speichern

- Auftrags-Drawer: Feldreihenfolge in Produktion auf Freigabe links und Übergabe rechts angepasst

- Auftragsstatus-Badges werden jetzt fest nach Status gemappt, damit gleiche Statuswerte gleich aussehen

- Aufträge: Tabellen sind in allen Tabs per Spaltenkopf nach Auftrag, Kunde, Produkt, Fällig, Freigabe und Status sortierbar

- Build-Baseline stabilisiert: Store-Typen, Tab-State-Typisierung, Maschinenfeld und CSS-Modul-Imports korrigiert.

- Globale Sortier-Utilities eingeführt und Auftragsliste darauf umgestellt

## Stabilisierung Drawer-Standard

Der Drawer-Standard wurde zentral nachgezogen:

```text
DetailDrawer rendert per React Portal an document.body
Kunden, Material, Maschinen, Weiterverarbeitung, Leistungen, Vorlagen und Mahnungen nutzen den Portal-Drawer
alte untere Editorbereiche wurden auf diesen Seiten entfernt
SortableTableHeader steht direkt im tr, ohne verschachtelte th-Struktur
```

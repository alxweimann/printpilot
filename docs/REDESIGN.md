# PrintPilot Redesign Dokumentation

## Ziel

PrintPilot wird als moderne Druckerei-Software neu aufgebaut.

Der Fokus liegt zuerst auf:

- Designsystem
- Grundlayout
- Navigation
- kompakte technische Eingabemasken
- klare Modulstruktur
- einheitliche Arbeitsmasken
- statische Designzustände
- keine Fachlogik, solange das Designsystem noch nicht stabil ist

## Grundprinzipien

- Dunkle Sidebar links
- Arbeitsbereich rechts
- klare Tabs
- wenig Karten
- keine Ausklappbereiche
- kompakte Eingabemasken wie klassische Kalkulationssoftware
- moderne Optik mit technischem Charakter
- erst Design festlegen, dann Module bauen
- Änderungen klein halten: Datei austauschen, testen, builden, committen, pushen

## Branch

Aktueller Arbeitsbranch:

```text
restart-designsystem
```

## Arbeitsweise

Nach dem Recovery wurde die Arbeitsweise angepasst:

```text
1. einzelne Datei als Download
2. Datei lokal ersetzen
3. npm run build
4. npm run dev
5. visuell prüfen
6. committen
7. pushen
8. erst dann nächster Schritt
```

Große ZIP-Pakete werden vermieden, außer sie werden ausdrücklich gewünscht.

Die Dokumentation wird nicht nach jedem Mini-Step aktualisiert, sondern gesammelt nach mehreren kleinen Änderungen oder bei größeren Design-/Architekturentscheidungen.

---

# Architekturstand

## App-Struktur

```text
src/main.tsx

src/app/App.tsx
src/app/AppRouter.tsx
src/app/moduleConfig.ts
src/app/navigation.ts

src/layout/AppShell.tsx
src/layout/Sidebar.tsx
src/layout/PageHeader.tsx
src/layout/PageTabs.tsx

src/pages/
src/styles/globals.css
src/ui/
```

## Aufgabenverteilung

```text
App.tsx              hält activePage und reicht Navigation weiter
AppRouter.tsx        rendert die aktive Seite
moduleConfig.ts      Titel, Beschreibung, Tabs, Buttontexte, Modulfarben
navigation.ts        Navigation aus Modulkonfiguration
AppShell.tsx         Sidebar + Arbeitsbereich
Sidebar.tsx          Hauptnavigation
PageTabs.tsx         Tab-Leiste mit optionalem onTabChange
```

## UI-Komponenten

Wiederverwendbare Komponenten:

```text
src/ui/Button.tsx
src/ui/Input.tsx
src/ui/Select.tsx
src/ui/Field.tsx
src/ui/FieldGrid.tsx
src/ui/SectionHeader.tsx
src/ui/Badge.tsx
src/ui/Table.tsx
src/ui/WorkspaceHeader.tsx
```

Diese Komponenten bilden die Grundlage für kompakte technische Eingabemasken und ein einheitliches Oberflächendesign.

---

# Designsystem

## Modulfarben

Jedes Hauptmodul erhält eine eigene Akzentfarbe.

Die Modulfarbe steuert:

- aktiven Strich in der Sidebar
- Hover-Farbe in der Sidebar
- aktiven Tab-Unterstrich
- Primärbutton
- Input-Fokus
- WorkspaceHeader-Akzent
- Dashboard-Akzente

Verwendete CSS-Variablen:

```css
--module-accent
--item-accent
```

## Modulfarben Übersicht

```text
Dashboard              Grau
Kalkulation            Cyan
Angebote               Grün
Aufträge               Violett
Rechnungen             Blau
Lieferscheine          Orange
Mahnungen              Rot
Kunden                 Türkis
Material               Ocker
Maschinen              Stahlblau
Weiterverarbeitung     Magenta
Leistungen             Lila
Vorlagen               Grau
Einstellungen          Hellgrau
```

---

# Master-Detail-Refactoring

## Ausgangspunkt

Die zweigeteilte Arbeitsansicht wurde zuerst in der Angebotsseite entwickelt und hieß deshalb technisch:

```text
quotes-layout
quotes-list-panel
quotes-editor-panel
quotes-position-table
```

Diese Klassen wurden später in vielen Modulen verwendet.

## Refactoring-Entscheidung

Da die Klassen nicht mehr nur für Angebote verwendet wurden, wurden sie neutralisiert.

Neue Klassen:

```text
master-detail-layout
master-list-panel
master-editor-panel
master-position-table
```

Die alten `quotes-*` CSS-Aliase wurden zuerst parallel unterstützt und danach entfernt.

## Ergebnis

Alle Arbeitsseiten verwenden jetzt neutrale Master-Detail-Klassen.

Vorteile:

- klarere Benennung
- weniger Angebotsbezug im globalen CSS
- bessere Wartbarkeit
- einheitliches Layoutsystem für alle Module

---

# Tab-System

## Ziel

Die Tabs der Module sollen nicht nur optische Dekoration sein, sondern bereits als echte statische Designzustände funktionieren.

Wichtig:

```text
Keine echte Datenlogik
Keine Speicherung
Keine Filterlogik im Backend
Keine Persistenz
```

Die Tabs ändern aktuell nur statisch:

- sichtbare Tabellenzeilen
- WorkspaceHeader-Titel
- WorkspaceHeader-Status
- teilweise ein Dropdown in der rechten Maske

## PageTabs

Datei:

```text
src/layout/PageTabs.tsx
```

`PageTabs` unterstützt jetzt optional:

```ts
onTabChange?: (tab: string) => void
```

Dadurch bleiben bestehende Seiten kompatibel, aber einzelne Module können Tabs lokal steuern.

## Umgesetzte statische Tab-Zustände

### Angebote

Datei:

```text
src/pages/QuotesPage.tsx
```

Tabs:

```text
Entwurf
Offen
Angenommen
Abgelehnt
```

Verhalten:

- Tabelle wechselt je nach Angebotsstatus
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status wechselt
- Status-Dropdown rechts wechselt den Tab mit

### Aufträge

Datei:

```text
src/pages/OrdersPage.tsx
```

Tabs:

```text
Liste
Vorbereitung
Produktion
Abgeschlossen
```

Verhalten:

- Tabelle wechselt je nach Auftragsstatus
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status wechselt
- Produktionsstatus-Dropdown rechts wechselt den Tab mit

### Rechnungen

Datei:

```text
src/pages/InvoicesPage.tsx
```

Tabs:

```text
Liste
Entwurf
Offen
Bezahlt
Überfällig
```

Verhalten:

- Tabelle wechselt je nach Rechnungsstatus
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status wechselt
- Status-Dropdown rechts wechselt den Tab mit

### Lieferscheine

Datei:

```text
src/pages/DeliveryNotesPage.tsx
```

Tabs:

```text
Liste
Entwurf
Versandbereit
Geliefert
Abgeschlossen
```

Verhalten:

- Tabelle wechselt je nach Lieferscheinstatus
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status wechselt
- Status-Dropdown rechts wechselt den Tab mit

### Mahnungen

Datei:

```text
src/pages/RemindersPage.tsx
```

Tabs:

```text
Liste
Entwurf
Offen
Versendet
Erledigt
```

Verhalten:

- Tabelle wechselt je nach Mahnstatus
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status wechselt
- Status-Dropdown rechts wechselt den Tab mit

### Kunden

Datei:

```text
src/pages/CustomersPage.tsx
```

Tabs:

```text
Liste
Aktiv
Entwurf
Gesperrt
```

Verhalten:

- Tabelle wechselt je nach Kundenstatus
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status wechselt
- Status-Dropdown rechts wechselt den Tab mit

### Material

Datei:

```text
src/pages/MaterialPage.tsx
```

Tabs:

```text
Liste
Papier
Verpackung
Verbrauchsmaterial
Gesperrt
```

Verhalten:

- Tabelle wechselt je nach Materialtyp
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status wechselt
- Materialtyp-Dropdown rechts wechselt den Tab mit
- Status-Dropdown kann auf Gesperrt wechseln

### Maschinen

Datei:

```text
src/pages/MachinesPage.tsx
```

Tabs:

```text
Liste
Digitaldruck Farbe
Digitaldruck Schwarz
Großformat
Wartung
```

Verhalten:

- Tabelle wechselt je nach Maschinentyp
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status wechselt
- Maschinentyp-Dropdown rechts wechselt den Tab mit
- Status-Dropdown kann auf Wartung wechseln

### Weiterverarbeitung

Datei:

```text
src/pages/FinishingPage.tsx
```

Tabs:

```text
Liste
Standard
Falzen
Bindung
Veredelung
Handarbeit
```

Verhalten:

- Tabelle wechselt je nach Prozesskategorie
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status bleibt Aktiv
- Kategorie-Dropdown rechts wechselt den Tab mit

### Leistungen

Datei:

```text
src/pages/ServicesPage.tsx
```

Tabs:

```text
Liste
Vorstufe
Satz / Layout
Produktion
Zuschlag
Sonstiges
```

Verhalten:

- Tabelle wechselt je nach Leistungsgruppe
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status bleibt Aktiv
- Leistungsgruppe-Dropdown rechts wechselt den Tab mit

### Vorlagen

Datei:

```text
src/pages/TemplatesPage.tsx
```

Tabs:

```text
Produkte
Dokumente
Textbausteine
Layouts
Entwurf
```

Verhalten:

- Tabelle wechselt je nach Vorlagentyp
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status wechselt
- Vorlagentyp-Dropdown rechts wechselt den Tab mit
- Status-Dropdown kann auf Entwurf wechseln

### Einstellungen

Datei:

```text
src/pages/SettingsPage.tsx
```

Tabs:

```text
Allgemein
Nummernkreise
Firma
Design
System
```

Verhalten:

- Tabs sind klickbar
- linke Bereichsliste wechselt synchron mit
- rechte Maske zeigt nur den aktiven Bereich
- WorkspaceHeader-Titel wechselt
- WorkspaceHeader-Status bleibt Lokal

---

# Dashboard

Datei:

```text
src/pages/DashboardPage.tsx
```

Aktueller Zustand:

- echte Startseite statt Empty-State
- Kennzahlen-Kacheln
- aktuelle Arbeiten
- Schnellzugriffe
- Modulfarben als Akzente
- Kennzahlen sind anklickbar
- aktuelle Arbeiten sind anklickbar
- Schnellzugriffe sind anklickbar

Aktuelle Navigation im Dashboard:

```text
Offene Angebote      → Angebote
Aktive Aufträge      → Aufträge
Offene Rechnungen    → Rechnungen
Materialhinweise     → Material

Angebot   AG-2026-001 → Angebote
Auftrag   AU-2026-002 → Aufträge
Rechnung  RE-2026-003 → Rechnungen

Kalkulation starten  → Kalkulation
Angebot erstellen    → Angebote
Kunde anlegen        → Kunden
Material prüfen      → Material
```

Wichtig:

- Werte sind aktuell statische Designwerte
- keine Datenlogik
- keine echte Auswertung
- keine Persistenz

---

# Routing-Stand

Aktiv im Router:

```text
dashboard
calculation
quotes
orders
invoices
delivery-notes
reminders
customers
material
machines
finishing
services
templates
settings
```

Datei:

```text
src/app/AppRouter.tsx
```

---

# Aktueller Designstand der Module

## Kalkulation

Datei:

```text
src/pages/CalculationPage.tsx
```

Aktueller Zustand:

- technische Eingabemaske
- WorkspaceHeader
- Tabs
- Kunde
- Produkt
- Format & Umfang
- Papier
- Druck
- Weiterverarbeitung
- Verpackung & Versand
- Footer mit „Entwurf speichern“ und „Angebot erstellen“

Wichtig:

- keine Berechnungslogik
- keine Speicherung
- keine Angebotserzeugung

Vorbereiteter späterer Prozess:

```text
Kalkulation erstellen
↓
Kalkulation prüfen
↓
Angebot erstellen
↓
Angebot wird im Modul Angebote abgelegt
```

## Angebote

Datei:

```text
src/pages/QuotesPage.tsx
```

Aktueller Zustand:

- Angebotsliste links
- Angebotsmaske rechts
- WorkspaceHeader
- Angebotskopf
- Positionen
- Zwischensumme netto als Designplatzhalter
- Konditionen & Ausgabe
- Footer mit Entwurf speichern, Vorschau prüfen, Angebot ausgeben
- statische Tab-Zustände

## Aufträge

Datei:

```text
src/pages/OrdersPage.tsx
```

Aktueller Zustand:

- Auftragsliste links
- Auftragsmaske rechts
- WorkspaceHeader
- Auftragskopf
- Produktion
- Übergabe
- Footer mit Entwurf speichern und Auftrag vorbereiten
- statische Tab-Zustände

## Rechnungen

Datei:

```text
src/pages/InvoicesPage.tsx
```

Aktueller Zustand:

- Rechnungsliste links
- Rechnungsmaske rechts
- WorkspaceHeader
- Rechnungskopf
- Positionen
- Rechnungssumme netto als Designplatzhalter
- Zahlung & Ausgabe
- Footer mit Entwurf speichern, Vorschau prüfen, Rechnung ausgeben
- statische Tab-Zustände

## Lieferscheine

Datei:

```text
src/pages/DeliveryNotesPage.tsx
```

Aktueller Zustand:

- Lieferscheinliste links
- Lieferscheinmaske rechts
- WorkspaceHeader
- Lieferscheinkopf
- Lieferadresse
- Positionen
- Ausgabe
- Footer mit Entwurf speichern, Vorschau prüfen, Lieferschein ausgeben
- statische Tab-Zustände

## Mahnungen

Datei:

```text
src/pages/RemindersPage.tsx
```

Aktueller Zustand:

- Mahnungsliste links
- Mahnmaske rechts
- WorkspaceHeader
- Mahnkopf
- Mahninformationen
- Ausgabe
- Footer mit Entwurf speichern, Vorschau prüfen, Mahnung ausgeben
- statische Tab-Zustände

## Kunden

Datei:

```text
src/pages/CustomersPage.tsx
```

Aktueller Zustand:

- Kundenliste links
- Kundendatenmaske rechts
- WorkspaceHeader
- Kundendaten
- Kontakt
- Konditionen
- Footer mit Änderungen verwerfen und Kunde speichern
- statische Tab-Zustände

## Material

Datei:

```text
src/pages/MaterialPage.tsx
```

Aktueller Zustand:

- Materialliste links
- Materialmaske rechts
- WorkspaceHeader
- Materialdaten
- Preise
- Lager
- Footer mit Änderungen verwerfen und Material speichern
- statische Tab-Zustände

## Maschinen

Datei:

```text
src/pages/MachinesPage.tsx
```

Aktueller Zustand:

- Maschinenliste links
- Maschinenmaske rechts
- WorkspaceHeader
- Maschinendaten
- Kostenparameter
- Hinweise
- Footer mit Änderungen verwerfen und Maschine speichern
- statische Tab-Zustände

## Weiterverarbeitung

Datei:

```text
src/pages/FinishingPage.tsx
```

Aktueller Zustand:

- Prozessliste links
- Prozessmaske rechts
- WorkspaceHeader
- Prozessdaten
- Kostenparameter
- Hinweise
- Footer mit Änderungen verwerfen und Prozess speichern
- statische Tab-Zustände

## Leistungen

Datei:

```text
src/pages/ServicesPage.tsx
```

Aktueller Zustand:

- Leistungsliste links
- Leistungsmaske rechts
- WorkspaceHeader
- Leistungsdaten
- Preise
- Beschreibung
- Footer mit Änderungen verwerfen und Leistung speichern
- statische Tab-Zustände

## Vorlagen

Datei:

```text
src/pages/TemplatesPage.tsx
```

Aktueller Zustand:

- Vorlagenliste links
- Vorlagenmaske rechts
- WorkspaceHeader
- Vorlagendaten
- Produktparameter
- Ausgabe
- Footer mit Änderungen verwerfen und Vorlage speichern
- statische Tab-Zustände

## Einstellungen

Datei:

```text
src/pages/SettingsPage.tsx
```

Aktueller Zustand:

- Einstellungsbereiche links
- Einstellungsmaske rechts
- WorkspaceHeader
- Bereichsabhängige Inhalte
- Footer mit Änderungen verwerfen und Einstellungen speichern
- statische Tab-Zustände

---

# Layout- und CSS-Stand

Wichtige CSS-Klassen:

```text
app-shell
sidebar
sidebar-item
page
page-header
page-tabs
page-tab
workspace-panel
calculation-sheet
calculation-sheet-header
field-grid
field
input
select
calculation-footer
master-detail-layout
master-list-panel
master-editor-panel
master-position-table
dashboard-grid
dashboard-metric-card
dashboard-panel-header
dashboard-action-list
dashboard-action-item
data-table
data-table-summary-row
badge
settings-nav-list
settings-nav-item
empty-state
```

---

# Aktuelle Kern-Dateien

```text
src/main.tsx

src/app/App.tsx
src/app/AppRouter.tsx
src/app/moduleConfig.ts
src/app/navigation.ts

src/layout/AppShell.tsx
src/layout/Sidebar.tsx
src/layout/PageHeader.tsx
src/layout/PageTabs.tsx

src/pages/DashboardPage.tsx
src/pages/CalculationPage.tsx
src/pages/QuotesPage.tsx
src/pages/OrdersPage.tsx
src/pages/InvoicesPage.tsx
src/pages/DeliveryNotesPage.tsx
src/pages/RemindersPage.tsx
src/pages/CustomersPage.tsx
src/pages/MaterialPage.tsx
src/pages/MachinesPage.tsx
src/pages/FinishingPage.tsx
src/pages/ServicesPage.tsx
src/pages/TemplatesPage.tsx
src/pages/SettingsPage.tsx
src/pages/PlaceholderPage.tsx

src/styles/globals.css

src/ui/Button.tsx
src/ui/Input.tsx
src/ui/Select.tsx
src/ui/Field.tsx
src/ui/FieldGrid.tsx
src/ui/SectionHeader.tsx
src/ui/Badge.tsx
src/ui/Table.tsx
src/ui/WorkspaceHeader.tsx
```

---

# Nächste sinnvolle Schritte

## Kurzfristig

1. Tab-System visuell final prüfen
2. Tabellen-/Listenkomponenten verbessern
3. gemeinsame Master-Detail-Komponente prüfen
4. Status-Badges farblich differenzieren
5. Tabellenzeilen anklickbar vorbereiten

## Danach

1. Designsystem weiter stabilisieren
2. erste echte Datenstruktur planen
3. lokale Speicherung planen
4. Kalkulationslogik fachlich schrittweise vorbereiten
5. Prozess Kalkulation → Angebot technisch planen

Weiterhin gilt:

```text
Keine Fachlogik, bevor das Designsystem stabil ist.
```

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
- einheitliche Tabellen- und Statusdarstellung
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
Badge.tsx            semantische Status-Badges
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
- Tabellen-Hover
- ausgewählte Tabellenzeile

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

# Master-Detail-Layout

Die zweigeteilte Arbeitsansicht verwendet jetzt neutrale Klassen:

```text
master-detail-layout
master-list-panel
master-editor-panel
master-position-table
```

Die alten `quotes-*` CSS-Aliase wurden entfernt.

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

`PageTabs` unterstützt optional:

```ts
onTabChange?: (tab: string) => void
```

Dadurch bleiben bestehende Seiten kompatibel, aber einzelne Module können Tabs lokal steuern.

## Umgesetzte statische Tab-Zustände

```text
Angebote
Aufträge
Rechnungen
Lieferscheine
Mahnungen
Kunden
Material
Maschinen
Weiterverarbeitung
Leistungen
Vorlagen
Einstellungen
```

---

# Status-Badges

## Ziel

Status-Badges sollen über das gesamte System automatisch semantisch farbig wirken.

Dateien:

```text
src/ui/Badge.tsx
src/styles/globals.css
```

## Automatische Status-Erkennung

`Badge.tsx` erkennt den Statustext und ordnet automatisch eine Variante zu.

Beispiele:

```text
Entwurf / Vorbereitung / Prüfung  → grau
Aktiv / Bezahlt / Erledigt        → grün
Offen / Lokal                     → blau
Produktion / Weiterverarbeitung   → violett
Versandbereit / Wartung / Stufe   → orange
Abgelehnt / Überfällig / Gesperrt → rot
```

## Badge-Klassen

```text
badge
badge-muted
badge-success
badge-info
badge-warning
badge-danger
badge-purple
```

Vorteil:

- Statusfarben müssen nicht auf jeder Seite einzeln gepflegt werden
- vorhandene Badges profitieren automatisch
- spätere Statuslogik kann zentral erweitert werden

---

# Tabellen-Design

## Ziel

Tabellen sollen stärker wie klickbare Arbeitslisten wirken.

Datei:

```text
src/styles/globals.css
```

## Umgesetzte Tabellen-Verbesserungen

```text
stärkerer Tabellen-Hover
linker Modulfarb-Akzent beim Hover
dezenter Active-Zustand
cursor: pointer für Tabellenzeilen
mehr Abstand in der ersten Spalte
sauberer Abstand zwischen Farbbalken und Text
```

## Ausgewählte Tabellenzeile

Vorbereitete Klasse:

```text
data-table-row-selected
```

Wirkung:

- dezenter Hintergrund in Modulfarbe
- linker Farbakzent
- etwas stärkere Schrift
- erster Spalteninhalt mit sauberem Abstand

## Statische Selected Rows

Die erste sichtbare Zeile ist aktuell statisch als ausgewählt markiert in:

```text
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
```

Wichtig:

```text
Noch keine echte Auswahl-Logik
Noch keine Datenbindung
Noch keine Detailübernahme
Nur Design-Vorbereitung
```

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
- statisch ausgewählte erste Tabellenzeile

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
- statisch ausgewählte erste Tabellenzeile

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
- statisch ausgewählte erste Tabellenzeile

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
- statisch ausgewählte erste Tabellenzeile

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
- statisch ausgewählte erste Tabellenzeile

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
- statisch ausgewählte erste Tabellenzeile

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
- statisch ausgewählte erste Tabellenzeile

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
- statisch ausgewählte erste Tabellenzeile

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
- statisch ausgewählte erste Tabellenzeile

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
- statisch ausgewählte erste Tabellenzeile

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
- statisch ausgewählte erste Tabellenzeile

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
data-table-row-selected
badge
badge-muted
badge-success
badge-info
badge-warning
badge-danger
badge-purple
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

1. Detailmasken mit statisch ausgewählter Tabellenzeile synchronisieren
2. gemeinsame Master-Detail-Komponente prüfen
3. echte Auswahl-Logik planen
4. Tabellen-/Listenkomponenten weiter verbessern
5. leere Listen-Zustände vorbereiten

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

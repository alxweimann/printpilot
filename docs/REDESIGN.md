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
- Master-Detail-Darstellung mit echter lokaler Auswahl
- keine Fachlogik, solange das Designsystem noch nicht stabil ist

## Branch

Aktueller Arbeitsbranch:

```text
restart-designsystem
```

## Arbeitsweise

Nach dem Recovery wurde die Arbeitsweise angepasst:

```text
1. komplette betroffene Dateien als Download
2. Datei lokal ersetzen
3. npm run build
4. npm run dev
5. visuell prüfen
6. committen
7. pushen
8. erst dann nächster Schritt
```

Wichtige Änderungen werden nach erfolgreichem Test immer committed und gepusht.

---

# Architekturstand

## App-Struktur

```text
src/main.tsx
src/app/App.tsx
src/app/AppRouter.tsx
src/app/moduleConfig.ts
src/app/navigation.ts
src/hooks/useMasterDetailSelection.ts
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
App.tsx hält activePage und reicht Navigation weiter
AppRouter.tsx rendert die aktive Seite
moduleConfig.ts Titel, Beschreibung, Tabs, Buttontexte, Modulfarben
navigation.ts Navigation aus Modulkonfiguration
useMasterDetailSelection.ts zentrale lokale Auswahl-Logik für Master-Detail-Seiten
AppShell.tsx Sidebar + Arbeitsbereich
Sidebar.tsx Hauptnavigation
PageTabs.tsx Tab-Leiste mit optionalem onTabChange
Badge.tsx semantische Status-Badges
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
Dashboard Grau
Kalkulation Cyan
Angebote Grün
Aufträge Violett
Rechnungen Blau
Lieferscheine Orange
Mahnungen Rot
Kunden Türkis
Material Ocker
Maschinen Stahlblau
Weiterverarbeitung Magenta
Leistungen Lila
Vorlagen Grau
Einstellungen Hellgrau
```

---

# Master-Detail-Layout

Die zweigeteilte Arbeitsansicht verwendet neutrale Klassen:

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

# Zentrale lokale Auswahl-Logik

## Ziel

Master-Detail-Seiten sollen nicht mehr statisch immer die erste Tabellenzeile anzeigen. Jede relevante Seite nutzt jetzt eine echte lokale Auswahl über `selectedId`.

Zentrale Datei:

```text
src/hooks/useMasterDetailSelection.ts
```

Der Hook verwaltet:

- aktiven Tab
- `selectedId`
- sichtbare Zeilen des aktiven Tabs
- ausgewählten Datensatz
- Reset der Auswahl beim Tabwechsel
- Auswahl per Tabellenzeilen-Klick

## Grundprinzip

```ts
const {
  activeTab,
  rows,
  selectedItem,
  setActiveTab,
  selectItem,
} = useMasterDetailSelection({
  rowsByTab,
  initialTab,
});
```

Beim Tabwechsel wird automatisch der erste Datensatz des neuen Tabs ausgewählt. Beim Klick auf eine Tabellenzeile wird deren `id` als lokale Auswahl gesetzt.

## Umgestellte Seiten

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

## Wichtig

Die Auswahl ist aktuell bewusst lokal und statisch:

```text
keine Speicherung
keine Datenbank
keine Backend-Logik
keine echte Formularpersistenz
```

Der nächste Architektur-Schritt kann später sein:

```text
lokale Mockdaten aus Seiten auslagern
Datenmodelle pro Modul definieren
Store oder lokale Persistenz planen
Formularfelder editierbar machen
```

---

# Tab-System

## Ziel

Die Tabs der Module sind echte lokale Designzustände. Sie ändern:

- sichtbare Tabellenzeilen
- WorkspaceHeader-Titel
- WorkspaceHeader-Status
- ausgewählten Datensatz
- sichtbare Beispielwerte in der Detailmaske

`PageTabs` unterstützt weiterhin optional:

```ts
onTabChange?: (tab: string) => void
```

Dadurch bleiben bestehende Seiten kompatibel, aber einzelne Module können Tabs lokal steuern.

## Umgesetzte Tab-Zustände

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

Status-Badges wirken über das gesamte System automatisch semantisch farbig.

Dateien:

```text
src/ui/Badge.tsx
src/styles/globals.css
```

Beispiele:

```text
Entwurf / Vorbereitung / Prüfung → grau
Aktiv / Bezahlt / Erledigt → grün
Offen / Lokal → blau
Produktion / Weiterverarbeitung → violett
Versandbereit / Wartung / Stufe → orange
Abgelehnt / Überfällig / Gesperrt → rot
```

Badge-Klassen:

```text
badge
badge-muted
badge-success
badge-info
badge-warning
badge-danger
badge-purple
```

---

# Tabellen-Design

## Ziel

Tabellen sollen wie klickbare Arbeitslisten wirken.

Datei:

```text
src/styles/globals.css
```

Umgesetzte Tabellen-Verbesserungen:

```text
stärkerer Tabellen-Hover
linker Modulfarb-Akzent beim Hover
dezenter Active-Zustand
cursor: pointer für Tabellenzeilen
mehr Abstand in der ersten Spalte
sauberer Abstand zwischen Farbbalken und Text
```

## Ausgewählte Tabellenzeile

Klasse:

```text
data-table-row-selected
```

Wirkung:

- dezenter Hintergrund in Modulfarbe
- linker Farbakzent
- etwas stärkere Schrift
- erster Spalteninhalt mit sauberem Abstand

Die Klasse hängt jetzt an der echten lokalen Auswahl statt an `index === 0`.

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

## Master-Detail-Module

Diese Module haben jetzt lokale Auswahl per Hook:

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
```

Aktueller Zustand:

- linke Arbeitsliste
- rechte Detailmaske
- lokale `selectedId`-Auswahl
- Tabwechsel setzt erste passende Zeile
- Klick auf Tabellenzeile synchronisiert Detailbereich
- statische Beispieldaten
- keine Persistenz

## Einstellungen

Datei:

```text
src/pages/SettingsPage.tsx
```

Aktueller Zustand:

- Einstellungsbereiche links
- Einstellungsmaske rechts
- WorkspaceHeader
- bereichsabhängige Inhalte
- Footer mit Änderungen verwerfen und Einstellungen speichern
- statische Tab-Zustände

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

# Aktuelle Kern-Dateien

```text
src/main.tsx
src/app/App.tsx
src/app/AppRouter.tsx
src/app/moduleConfig.ts
src/app/navigation.ts
src/hooks/useMasterDetailSelection.ts
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

1. Build nach Hook-Migration prüfen
2. leere Listen-Zustände vorbereiten
3. Formularfelder zwischen `readOnly` und editierbar sauber unterscheiden
4. gemeinsame Master-Detail-Komponente prüfen
5. Mockdaten aus Seiten in Datenmodule auslagern

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

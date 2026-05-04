# PrintPilot Redesign Dokumentation

## Ziel

PrintPilot wird als moderne Druckerei-Software neu aufgebaut.

Der Fokus liegt zuerst ausschließlich auf:

- Designsystem
- Grundlayout
- Navigation
- kompakte technische Eingabemasken
- klare Modulstruktur
- keine Fachlogik

## Grundprinzipien

- Dunkle Sidebar links
- Arbeitsbereich rechts
- klare Tabs
- wenig Karten
- keine Ausklappbereiche
- kompakte Eingabemasken wie klassische Kalkulationssoftware
- moderne Optik mit technischem Charakter
- erst Design festlegen, dann Module bauen

## Branch

Aktueller Arbeitsbranch:

```text
restart-designsystem
```

## Bisherige Schritte

### 1. Neue Projektstruktur angelegt

Angelegt wurden:

```text
src/app/
src/design-system/
src/layout/
src/pages/
src/styles/
src/ui/
```

Zusätzlich wurde `_OLD_/` in `.gitignore` aufgenommen, damit alte Sicherungsdaten nicht versehentlich ins Repository gelangen.

### 2. Grundlayout erstellt

Umgesetzt:

- AppShell
- dunkle Sidebar
- rechter Arbeitsbereich
- PageHeader
- PageTabs
- Dummy-Seiten
- erste Kalkulations-Eingabemaske ohne Fachlogik
- Kunden-Liste als Layoutbeispiel

### 3. Modulfarben eingeführt

Jedes Hauptmodul erhält eine eigene Akzentfarbe.

Die Modulfarbe steuert:

- aktiven Strich in der Sidebar
- aktiven Tab-Unterstrich
- Primärbutton
- Input-Fokus

Verwendete CSS-Variable:

```css
--module-accent
```

## Modulfarben

```text
Dashboard        Grau
Kalkulation      Cyan
Angebote         Grün
Aufträge         Violett
Rechnungen       Blau
Lieferscheine    Orange
Mahnungen        Rot
Kunden           Türkis
Material         Ocker
Maschinen        Stahlblau
Weiterverarbeitung Magenta
Leistungen       Lila
Vorlagen         Grau
Einstellungen    Hellgrau
```

## Aktuelle Kern-Dateien

```text
src/main.tsx
src/app/App.tsx
src/app/navigation.ts
src/layout/AppShell.tsx
src/layout/Sidebar.tsx
src/layout/PageHeader.tsx
src/layout/PageTabs.tsx
src/pages/DashboardPage.tsx
src/pages/CalculationPage.tsx
src/pages/CustomersPage.tsx
src/pages/PlaceholderPage.tsx
src/styles/globals.css
```

## Dokumentationsregel ab jetzt

Bei relevanten Änderungen wird diese Dokumentation mitgeführt.

Jeder größere Schritt bekommt:

- kurze Beschreibung
- betroffene Dateien
- Designentscheidung
- Commit-Hinweis

## Nächster geplanter Schritt

Designsystem-Komponenten sauber auslagern:

```text
src/design-system/tokens.ts
src/ui/Button.tsx
src/ui/Input.tsx
src/ui/Select.tsx
src/ui/Field.tsx
src/ui/FieldGrid.tsx
src/ui/SectionHeader.tsx
src/ui/Badge.tsx
src/ui/Table.tsx
```

Danach werden die hart geschriebenen HTML-Elemente in den Seiten durch eigene UI-Komponenten ersetzt.

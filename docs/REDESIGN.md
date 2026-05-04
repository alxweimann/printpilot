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

# Bisherige Schritte

## 1. Neue Projektstruktur angelegt

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

## 2. Grundlayout erstellt

Umgesetzt:

- AppShell
- dunkle Sidebar
- rechter Arbeitsbereich
- PageHeader
- PageTabs
- Dummy-Seiten
- erste Kalkulations-Eingabemaske ohne Fachlogik
- Kunden-Liste als Layoutbeispiel

## 3. Modulfarben eingeführt

Jedes Hauptmodul erhält eine eigene Akzentfarbe.

Die Modulfarbe steuert:

- aktiven Strich in der Sidebar
- Hover-Farbe in der Sidebar
- aktiven Tab-Unterstrich
- Primärbutton
- Input-Fokus
- WorkspaceHeader-Akzent

Verwendete CSS-Variablen:

```css
--module-accent
--item-accent
```

## Modulfarben

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

## 4. App-Struktur verschlankt

Die App wurde modularisiert, damit `App.tsx` klein bleibt.

Aufgabenverteilung:

```text
App.tsx              Startpunkt, aktive Seite, AppShell
AppRouter.tsx        entscheidet, welche Page gerendert wird
moduleConfig.ts      Titel, Beschreibung, Tabs, Buttontexte, Modulfarben
navigation.ts        Navigation aus Modulkonfiguration
```

Vorteil:

- weniger Code in `App.tsx`
- Änderungen pro Modul leichter möglich
- Fehler lassen sich gezielter eingrenzen
- bessere Basis für spätere Fachmodule

## 5. UI-Komponenten ausgelagert

Die wiederverwendbaren UI-Komponenten wurden eingeführt:

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

## 6. Recovery-Baseline erstellt

Nach Problemen mit einer zu großen Änderung wurde ein stabiler Baseline-Stand hergestellt.

Wichtig:

- die alte große `src/App.tsx` wurde entfernt
- alte Daten-/Logikdateien wurden entfernt
- die App läuft über die neue Struktur unter `src/app/App.tsx`
- die CSS-Datei wird über `index.html` geladen
- die weitere Arbeit erfolgt in kleinen Einzeldatei-Schritten

Commit:

```text
Restore stable redesign baseline
```

---

# Aktueller Designstand der Module

## Dashboard

Aktueller Zustand:

- einfache Startseite
- PageHeader
- WorkspacePanel
- Empty-State

Geplanter Ausbau:

- Kennzahlenkarten
- offene Vorgänge
- Schnellzugriffe
- Produktions-/Verkaufsübersicht

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

Wichtig:

- keine Angebotslogik
- keine Speicherung
- keine PDF-Ausgabe
- keine Berechnung

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

Wichtig:

- keine Auftragslogik
- keine Übergabe aus Angebot
- keine Produktionssteuerung

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

Wichtig:

- keine Rechnungslogik
- keine Zahlungserfassung
- keine PDF-Ausgabe

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

Wichtig:

- keine Lieferlogik
- keine Auftragsübernahme
- keine Ausgabe

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

Wichtig:

- keine Mahnlogik
- keine Rechnungsauswertung
- keine Fristenberechnung
- keine Ausgabe

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

Wichtig:

- keine Speicherung
- keine Kundendatenbank
- keine Kontaktlogik

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

Wichtig:

- keine Lagerlogik
- keine Preisberechnung
- keine Materialdatenbank

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

Wichtig:

- keine Maschinenlogik
- keine Klickpreisberechnung
- keine Produktionsdaten

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

Wichtig:

- keine Preislogik
- keine Prozessberechnung
- keine Kalkulationsintegration

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

Wichtig:

- keine Leistungslogik
- keine Preisberechnung
- keine Angebotsintegration

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

Wichtig:

- keine Vorlagenlogik
- keine Dokumenterzeugung
- keine Produktübernahme

## Einstellungen

Datei:

```text
src/pages/SettingsPage.tsx
```

Aktueller Zustand:

- Einstellungsbereiche links
- Einstellungsmaske rechts
- WorkspaceHeader
- Allgemein
- Nummernkreise
- Firma
- Design
- Footer mit Änderungen verwerfen und Einstellungen speichern

Wichtig:

- keine Speicherung
- keine Systemlogik
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

# Layout- und CSS-Stand

Wichtige CSS-Klassen:

```text
app-shell
sidebar
sidebar-item
page
page-header
page-tabs
workspace-panel
calculation-sheet
calculation-sheet-header
field-grid
field
input
select
calculation-footer
quotes-layout
quotes-list-panel
quotes-editor-panel
quotes-position-table
data-table
data-table-summary-row
badge
empty-state
```

Die Klasse `quotes-layout` wird aktuell nicht nur für Angebote verwendet, sondern allgemein als zweigeteiltes Arbeitslayout für Listen links und Masken rechts.

Später kann diese Klasse umbenannt werden, z. B. in:

```text
split-workspace
master-detail-layout
```

Das wäre ein sinnvoller Refactoring-Schritt.

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

1. `quotes-layout` zu allgemeiner Layout-Klasse umbenennen
2. Dashboard optisch ausbauen
3. gemeinsame Master-Detail-Komponente prüfen
4. Dokumentation nachziehen, sobald der nächste Block abgeschlossen ist

## Danach

1. Designsystem weiter stabilisieren
2. Tabellen-/Listenkomponenten verbessern
3. Tabs als echte Designzustände vorbereiten
4. erst danach erste kleine Fachlogik planen

Weiterhin gilt:

```text
Keine Fachlogik, bevor das Designsystem stabil ist.
```

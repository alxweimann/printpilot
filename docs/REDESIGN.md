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

## Arbeitsweise ab jetzt

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

### 4. App-Struktur verschlankt

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

### 5. UI-Komponenten ausgelagert

Die ersten wiederverwendbaren UI-Komponenten wurden eingeführt:

```text
src/ui/Button.tsx
src/ui/Input.tsx
src/ui/Select.tsx
src/ui/Field.tsx
src/ui/FieldGrid.tsx
src/ui/SectionHeader.tsx
src/ui/Badge.tsx
src/ui/Table.tsx
```

Diese Komponenten bilden die Grundlage für kompakte technische Eingabemasken und ein einheitliches Oberflächendesign.

### 6. Kalkulationsmaske als Designmaske verfeinert

Die Kalkulationsseite wurde als reine technische Eingabemaske ausgebaut.

Wichtig: Es wurde weiterhin keine Fachlogik eingebaut.

Die Maske ist gegliedert in:

```text
Kunde
Produkt
Format & Umfang
Papier
Druck
Weiterverarbeitung
Verpackung & Versand
```

Designentscheidungen:

- kompakte 3-Spalten-Eingabe
- klare Abschnittszeilen
- mehr Select-Felder für typische Kalkulationsauswahl
- deaktivierte Platzhalterfelder für spätere automatische Werte
- Footer mit Entwurf speichern und Weiter zur Übersicht
- optischer Kopfbereich für die Eingabemaske
- Modulfarbe bleibt als Akzentfarbe erhalten

### 7. Recovery-Baseline erstellt

Nach Problemen mit einer zu großen Änderung wurde ein stabiler Baseline-Stand hergestellt.

Wichtig:

- die alte große `src/App.tsx` wurde entfernt
- alte Daten-/Logikdateien wurden entfernt
- die App läuft wieder über die neue Struktur unter `src/app/App.tsx`
- die CSS-Datei wird über `index.html` geladen
- die Angebotsseite wurde wieder minimal und kontrolliert aufgebaut

Commit:

```text
Restore stable redesign baseline
```

### 8. Angebotsseite minimal angelegt und geroutet

Die Angebotsseite wurde zunächst nur als einfache eigene Page angelegt.

Danach wurde sie separat über `AppRouter.tsx` eingebunden.

Dateien:

```text
src/pages/QuotesPage.tsx
src/app/AppRouter.tsx
```

Wichtig:

- keine Angebotslogik
- keine Speicherung
- keine PDF-Erzeugung
- nur Seitenbasis mit Header, Tabs und Empty-State

### 9. Sidebar-Hover mit Modulfarben

Die Sidebar zeigt jetzt beim Mouseover die jeweilige Modulfarbe.

Umgesetzt:

- jedes Navigationselement erhält `--item-accent`
- Hover-Hintergrund nutzt die jeweilige Modulfarbe
- der kleine aktive/hover Strich nutzt ebenfalls die Modulfarbe

Betroffene Dateien:

```text
src/layout/Sidebar.tsx
src/styles/globals.css
```

Designentscheidung:

```text
Aktive Seite = Modulfarbe sichtbar
Mouseover = Modulfarbe als Vorschau sichtbar
```

Dadurch erkennt man bereits beim Überfahren der Navigation, welcher Bereich welche Prozessfarbe hat.

## Aktuelle Kern-Dateien

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
src/pages/CustomersPage.tsx
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
```

## Dokumentationsregel

Bei relevanten Änderungen wird diese Dokumentation mitgeführt.

Jeder größere Schritt bekommt:

- kurze Beschreibung
- betroffene Dateien
- Designentscheidung
- Commit-Hinweis

## Nächster geplanter Schritt

Die Angebotsseite wird weiter in kleinen Schritten aufgebaut.

Reihenfolge:

```text
1. Angebotsliste ergänzen
2. build testen
3. dev testen
4. committen
5. Angebotsmaske rechts ergänzen
6. wieder testen und committen
```

Weiterhin gilt:

```text
Keine Fachlogik, bevor das Designsystem stabil ist.
```

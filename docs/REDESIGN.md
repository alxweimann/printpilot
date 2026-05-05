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
- kontrollierte Formular-Drafts ohne Persistenz
- kompakter Edit-Mode über ein einzelnes randloses Schloss in der Button-Leiste

Es gilt weiterhin:

```text
Keine Fachlogik, bevor das Designsystem stabil ist.
```

## Branch

Aktueller Arbeitsbranch:

```text
restart-designsystem
```

## Arbeitsweise

```text
1. vollständige betroffene Dateien als Download
2. Datei lokal ersetzen
3. npm run build
4. npm run dev
5. visuell prüfen
6. committen
7. pushen
8. erst dann nächster Schritt
```

## Architekturstand

```text
src/main.tsx
src/app/App.tsx
src/app/AppRouter.tsx
src/app/moduleConfig.ts
src/app/navigation.ts
src/hooks/useMasterDetailSelection.ts
src/hooks/useEditableDraft.ts
src/layout/AppShell.tsx
src/layout/Sidebar.tsx
src/layout/PageHeader.tsx
src/layout/PageTabs.tsx
src/pages/
src/styles/globals.css
src/ui/
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

## Master-Detail-Auswahl

Die Master-Detail-Seiten verwenden eine zentrale lokale Auswahl-Logik.

Datei:

```text
src/hooks/useMasterDetailSelection.ts
```

Zweck:

- aktiver Tab
- sichtbare Zeilen des Tabs
- `selectedId`
- ausgewählter Datensatz
- Auswahl per Tabellenklick
- automatischer Auswahl-Reset beim Tabwechsel

Beispielprinzip:

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

## Bearbeitbare Formular-Drafts

Die Master-Detail-Seiten verwenden kontrollierte lokale Drafts.

Datei:

```text
src/hooks/useEditableDraft.ts
```

Zweck:

- ausgewählten Datensatz in einen lokalen Draft übernehmen
- Formularfelder kontrolliert editierbar machen
- Änderungen lokal halten
- bei Auswahlwechsel automatisch neuen Draft setzen
- Änderungen verwerfen über `resetDraft`
- keine Speicherung
- keine Persistenz
- keine API
- keine echte Datenbank

Beispielprinzip:

```ts
const { draft, updateDraftField, resetDraft } =
  useEditableDraft(selectedItem);
```

## Edit-Mode über einzelnes randloses Schloss

Alle relevanten Master-Detail-Seiten verwenden jetzt dasselbe kompakte Edit-Mode-Prinzip.

Prinzip:

- Standardzustand: Bearbeitung ist gesperrt
- unten in der Button-Leiste gibt es nur ein Schloss-Icon
- das Schloss hat keine Umrandung und keine Button-Fläche
- geschlossenes Schloss öffnet die Bearbeitung
- offenes Schloss sperrt die Bearbeitung wieder
- kein zusätzlicher Text am Schloss
- das Schloss ist visuell mittig zur Höhe der danebenliegenden Buttons ausgerichtet
- das Schloss nutzt denselben Abstand wie die übrigen Buttons
- keine Schloss-Hinweise direkt an den Feldern
- Auswahlwechsel sperrt die Felder automatisch wieder
- Tabwechsel sperrt die Felder automatisch wieder
- `Änderungen verwerfen` setzt den Draft zurück und sperrt die Felder

## Seiten mit Draft + Edit-Mode

Diese Seiten haben lokale editierbare Draft-Felder und den kompakten Schloss-Edit-Mode:

```text
src/pages/QuotesPage.tsx
src/pages/CustomersPage.tsx
src/pages/OrdersPage.tsx
src/pages/MaterialPage.tsx
src/pages/MachinesPage.tsx
src/pages/DeliveryNotesPage.tsx
src/pages/InvoicesPage.tsx
src/pages/RemindersPage.tsx
src/pages/FinishingPage.tsx
src/pages/ServicesPage.tsx
src/pages/TemplatesPage.tsx
```

## Aktueller Stand

Umgesetzt:

- zentrale Auswahl über `useMasterDetailSelection`
- lokaler Bearbeitungs-Draft über `useEditableDraft`
- editierbare Stammdatenfelder pro Modul
- readOnly-Felder für Nummern, Kundenreferenzen oder systemische Referenzen
- Änderungen verwerfen setzt den Draft auf den ausgewählten Datensatz zurück
- Auswahlwechsel setzt automatisch einen neuen Draft und sperrt die Bearbeitung
- Tabwechsel setzt automatisch die erste passende Zeile, deren Draft und sperrt die Bearbeitung
- kompakter Edit-Mode über einzelnes randloses Schloss-Icon unten

Wichtig:

```text
Die Änderungen sind noch nicht gespeichert.
Der Draft ist nur lokale UI-Vorbereitung.
```

## Nächste sinnvolle Schritte

1. Schloss später als wiederverwendbare UI-Komponente auslagern
2. Dirty-State vorbereiten
3. Speichern-Button optisch auf geänderte Drafts reagieren lassen
4. geänderte Felder visuell markieren
5. lokale Datenstruktur planen
6. später Persistenz / Store / API planen

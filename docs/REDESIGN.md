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

Als nächster Schritt wurde ein lokaler Formular-Draft vorbereitet.

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

## Aktueller Stand: Angebote

Datei:

```text
src/pages/QuotesPage.tsx
```

Umgesetzt:

- zentrale Auswahl über `useMasterDetailSelection`
- lokaler Bearbeitungs-Draft über `useEditableDraft`
- Angebotsdatum editierbar
- Betreff editierbar
- Gültig-bis-Datum editierbar
- Zahlungsbedingungen editierbar
- Lieferbedingungen editierbar
- Angebotsvorlage editierbar
- Angebotsnummer und Kunde bleiben readOnly
- Änderungen verwerfen setzt den Draft auf den ausgewählten Datensatz zurück

Wichtig:

```text
Die Änderungen sind noch nicht gespeichert.
Der Draft ist nur lokale UI-Vorbereitung.
```

## Nächste sinnvolle Schritte

1. `useEditableDraft` nach erfolgreichem Test auf weitere Master-Detail-Seiten übertragen
2. einheitliche Unterscheidung zwischen readOnly-Stammdaten und editierbaren Formularfeldern festlegen
3. Dirty-State vorbereiten
4. Speichern-Button optisch auf geänderte Drafts reagieren lassen
5. lokale Datenstruktur planen
6. später Persistenz / Store / API planen

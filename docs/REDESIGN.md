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
- Dirty-State für lokale Entwürfe auf allen relevanten Seiten
- wiederverwendbare UI-Komponenten für Edit-State, Dirty-State und Hauptaktion

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
src/ui/EditLockToggle.tsx
src/ui/DirtyStateNotice.tsx
src/ui/SaveActionButton.tsx
```

## Bearbeitbare Formular-Drafts

Die Master-Detail-Seiten und die Einstellungen verwenden kontrollierte lokale Drafts.

Datei:

```text
src/hooks/useEditableDraft.ts
```

Zweck:

- ausgewählten Datensatz oder Einstellungszustand in einen lokalen Draft übernehmen
- Formularfelder kontrolliert editierbar machen
- Änderungen lokal halten
- Änderungen verwerfen über `resetDraft`
- Dirty-State über `isDirty`
- keine Speicherung
- keine Persistenz
- keine API
- keine echte Datenbank

Beispielprinzip:

```ts
const { draft, isDirty, updateDraftField, resetDraft } =
  useEditableDraft(selectedItem);
```

## Dirty-State

Der Hook `useEditableDraft` erkennt, ob der lokale Draft vom Ursprungsdatensatz abweicht.

Die Anzeige liegt zentral in:

```text
src/ui/DirtyStateNotice.tsx
```

## Hauptaktion / Speichern-Button

Die Hauptaktion in der Footer-Leiste liegt zentral in:

```text
src/ui/SaveActionButton.tsx
```

Prinzip:

```ts
<SaveActionButton
  isDirty={isDirty}
  defaultLabel="Angebot ausgeben"
/>
```

Verhalten:

```text
isDirty = false
- zeigt die normale Modulaktion, z. B. "Angebot ausgeben"

isDirty = true
- zeigt "Änderungen speichern"
```

Wichtig:

```text
Das Schloss speichert nicht automatisch.
Speichern bleibt eine bewusste Aktion.
Der Button speichert noch nicht echt.
Er ist aktuell eine UI-/State-Vorbereitung.
```

## Edit-Mode über einzelnes randloses Schloss

Alle relevanten Master-Detail-Seiten und die Einstellungen verwenden dasselbe kompakte Edit-Mode-Prinzip.

Die Schloss-Komponente liegt zentral in:

```text
src/ui/EditLockToggle.tsx
```

## Seiten mit Draft + Edit-Mode + Dirty-State

Diese Seiten haben lokale editierbare Draft-Felder, den kompakten Schloss-Edit-Mode und Dirty-State:

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
src/pages/SettingsPage.tsx
```

## Aktueller Stand

Umgesetzt:

- zentrale Auswahl über `useMasterDetailSelection`
- lokaler Bearbeitungs-Draft über `useEditableDraft`
- Dirty-State im Draft-Hook
- Dirty-State auf allen relevanten Draft-Seiten sichtbar
- `DirtyStateNotice` als zentrale UI-Komponente
- `EditLockToggle` als zentrale UI-Komponente
- `SaveActionButton` als zentrale UI-Komponente
- editierbare Stammdatenfelder pro Modul
- Einstellungen mit lokalem Draft
- readOnly-Felder für Nummern, Kundenreferenzen oder systemische Referenzen
- Änderungen verwerfen setzt den Draft auf den ausgewählten Datensatz oder die Einstellungen zurück
- Auswahlwechsel setzt automatisch einen neuen Draft und sperrt die Bearbeitung
- Tabwechsel setzt automatisch die erste passende Zeile, deren Draft und sperrt die Bearbeitung
- kompakter Edit-Mode über einzelnes randloses Schloss-Icon unten

Wichtig:

```text
Die Änderungen sind noch nicht gespeichert.
Der Draft ist nur lokale UI-Vorbereitung.
```

## Nächste sinnvolle Schritte

1. geänderte Felder visuell markieren
2. lokale Datenstruktur planen
3. später Persistenz / Store / API planen

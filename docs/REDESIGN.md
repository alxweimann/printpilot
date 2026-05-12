# PrintPilot Redesign Dokumentation

## Aktueller Stand

PrintPilot befindet sich auf dem Branch:

```text
restart-designsystem
```

Der aktuelle Stand ist ein stabiler Store-/Persistenz-Zwischenstand.

Alle wichtigen Grundbereiche sind inzwischen an den App-weiten Store angebunden und werden lokal im Browser persistiert.

Persistente Bereiche:

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

Zusätzlich umgesetzt:

```text
Backup-Export aus aktuellem Store
Backup-Import "Alles ersetzen"
Sicherheitsbackup vor Import
localStorage-Persistenz
Store-Migrationen für nachträglich ergänzte Datenbereiche
```

Wichtig:

```text
Noch keine echte Datenbank.
Noch keine API.
Noch kein Mehrplatzbetrieb.
Noch keine echte Kalkulationslogik.
```

---

## Arbeitsweise

Für Änderungen gilt weiterhin:

```text
1. vollständige betroffene Dateien als Einzeldownload bereitstellen
2. Gesamtpaket-ZIP immer zuletzt anbieten
3. Datei lokal ersetzen
4. npm run build
5. npm run dev
6. visuell und fachlich prüfen
7. committen
8. pushen
9. erst dann nächster Schritt
```

Wichtig für Dateiantworten:

```text
Einzeldateien zuerst.
Gesamtpaket immer ganz zuletzt.
```

---

## App-Struktur

Der StoreProvider sitzt in:

```text
src/main.tsx
```

Prinzip:

```tsx
<React.StrictMode>
  <PrintPilotStoreProvider>
    <App />
  </PrintPilotStoreProvider>
</React.StrictMode>
```

Wichtig:

```text
App.tsx bleibt für Shell, Navigation und Routing zuständig.
App.tsx nicht vereinfachen.
AppShell nicht entfernen.
```

---

## Zentraler Store

Datei:

```text
src/store/PrintPilotStore.tsx
```

Der Store enthält aktuell:

```text
PrintPilotStoreProvider
usePrintPilotStore()

data

customers
quotes
orders
materials
machines
services
finishing
templates
settings

updateCustomer()
updateQuote()
updateOrder()
updateMaterial()
updateMachine()
updateService()
updateFinishingProcess()
updateTemplate()
updateSettings()

replaceStoreData()
resetStoreData()
getBackupData()
```

Persistenz-Key:

```text
localStorage["printpilot-store-v1"]
```

---

## Zentrale Datenstruktur

Datei:

```text
src/data/printPilotStore.ts
```

Zentrale Hauptstruktur:

```ts
PrintPilotStoreData
```

Enthält:

```text
customers
quotes
orders
materials
machines
services
finishing
templates
settings
```

Aktuelle Initialdaten:

```text
initialPrintPilotCustomers
initialPrintPilotQuotes
initialPrintPilotOrders
initialPrintPilotMaterials
initialPrintPilotMachines
initialPrintPilotServices
initialPrintPilotFinishing
initialPrintPilotTemplates
initialPrintPilotSettings
```

Aktuelle Gruppierungsfunktionen:

```text
groupPrintPilotCustomersByStatus()
groupPrintPilotQuotesByStatus()
groupPrintPilotOrdersByStatus()
groupPrintPilotMaterialsByStatus()
groupPrintPilotMachinesByStatus()
groupPrintPilotServicesByStatus()
groupPrintPilotFinishingByStatus()
groupPrintPilotTemplatesByStatus()
```

---

## localStorage-Migration

Die Funktion:

```ts
createPrintPilotStoreSnapshot()
```

füllt nachträglich ergänzte Datenbereiche automatisch mit Initialdaten, wenn im bestehenden localStorage alte leere Bereiche vorhanden sind.

Beispiel:

```text
Alter Store enthält keine machines
→ initialPrintPilotMachines werden ergänzt
```

Das Prinzip gilt für:

```text
customers
quotes
orders
materials
machines
services
finishing
templates
settings
```

Wichtig:

```text
Bestehende gespeicherte Daten sollen erhalten bleiben.
Neue Bereiche werden ergänzt.
```

---

## Edit- und Save-Workflow

Alle angebundenen Seiten folgen demselben Prinzip:

```text
1. Datensatz auswählen
2. Schloss öffnen
3. Felder bearbeiten
4. Änderungen speichern
5. updateX() schreibt in Store
6. saveDraft() setzt Dirty-State zurück
7. Store wird automatisch in localStorage geschrieben
```

Beispiel:

```ts
updateQuote(savedQuote);
saveDraft(savedQuote);
```

Oder:

```ts
updateCustomer(savedCustomer);
saveDraft(savedCustomer);
```

---

## SaveActionButton

Datei:

```text
src/ui/SaveActionButton.tsx
```

Wichtig:

```text
Der Button muss onClick ausführen.
```

Prinzip:

```tsx
<Button variant="primary" onClick={onClick}>
  {isDirty ? dirtyLabel : defaultLabel}
</Button>
```

Ohne `onClick` werden Änderungen nicht gespeichert.

---

## EditLockToggle

Datei:

```text
src/ui/EditLockToggle.tsx
```

Das Schloss öffnet/sperrt den Bearbeitungsmodus.

Aktueller robuster Stand:

```text
Icons über Unicode-Escapes
aria/title ohne problematische Umlaute
```

Grund:

```text
Windows-Encoding hatte Emoji/Umlaute beschädigt.
```

---

## Angebundene Seiten

### Angebote

Datei:

```text
src/pages/QuotesPage.tsx
```

Store:

```ts
const { quotes, updateQuote } = usePrintPilotStore();
```

Backup-Bereich:

```text
data.quotes
```

---

### Aufträge

Datei:

```text
src/pages/OrdersPage.tsx
```

Store:

```ts
const { orders, updateOrder } = usePrintPilotStore();
```

Backup-Bereich:

```text
data.orders
```

---

### Kunden

Datei:

```text
src/pages/CustomersPage.tsx
```

Store:

```ts
const { customers, updateCustomer } = usePrintPilotStore();
```

Backup-Bereich:

```text
data.customers
```

---

### Material

Datei:

```text
src/pages/MaterialPage.tsx
```

Store:

```ts
const { materials, updateMaterial } = usePrintPilotStore();
```

Backup-Bereich:

```text
data.materials
```

---

### Maschinen

Datei:

```text
src/pages/MachinesPage.tsx
```

Store:

```ts
const { machines, updateMachine } = usePrintPilotStore();
```

Backup-Bereich:

```text
data.machines
```

---

### Leistungen / Services

Datei:

```text
src/pages/ServicesPage.tsx
```

Store:

```ts
const { services, updateService } = usePrintPilotStore();
```

Backup-Bereich:

```text
data.services
```

---

### Weiterverarbeitung / Finishing

Datei:

```text
src/pages/FinishingPage.tsx
```

Store:

```ts
const { finishing, updateFinishingProcess } = usePrintPilotStore();
```

Backup-Bereich:

```text
data.finishing
```

---

### Vorlagen / Templates

Datei:

```text
src/pages/TemplatesPage.tsx
```

Store:

```ts
const { templates, updateTemplate } = usePrintPilotStore();
```

Backup-Bereich:

```text
data.templates
```

---

### Einstellungen

Datei:

```text
src/pages/SettingsPage.tsx
```

Store:

```ts
const { settings, updateSettings, getBackupData, replaceStoreData } =
  usePrintPilotStore();
```

Backup-Bereich:

```text
data.settings
```

---

## Backup

Datei:

```text
src/data/backup.ts
```

Backup-Datenstruktur:

```ts
PrintPilotBackupData = PrintPilotStoreData
```

Backup-Export nutzt:

```ts
getBackupData()
```

Backup-Import nutzt:

```ts
replaceStoreData(selectedBackup.data)
```

Ablauf Import:

```text
Backup auswählen
Backup prüfen
Alles ersetzen vorbereiten
Import jetzt ausführen
Sicherheitsbackup wird heruntergeladen
Browser-Bestätigung
Store wird ersetzt
localStorage wird aktualisiert
```

---

## Nicht aktiv

Die visuelle Einzelfeld-Markierung ist weiterhin bewusst nicht aktiv.

Nicht aktiv:

```text
DirtyFieldMarker
```

Grund:

```text
Früherer Rollout hat JSX-Verschachtelungsfehler erzeugt.
```

Wiedereinführung später nur kontrolliert:

```text
eine Seite
ein Feldblock
Build-Test
dann weiter
```

---

## Aktuell stabile Grundlage

Aktuell stabil:

```text
AppShell und Navigation
Tabs
StoreProvider
localStorage-Persistenz
Backup-Export
Backup-Import "Alles ersetzen"
Edit-Lock
Dirty-State
SaveActionButton
alle Grundmodule im Store
```

---

## Nächste sinnvolle Schritte

Jetzt kann mit Modulverknüpfungen begonnen werden.

Empfohlene Reihenfolge:

```text
1. Doku final prüfen
2. Angebot → Auftrag vorbereiten
3. Kunde → Angebot/Auftrag verknüpfen
4. Material → Kalkulation vorbereiten
5. Maschinen → Kalkulation vorbereiten
6. Leistungen → Angebot/Kalkulation vorbereiten
7. Weiterverarbeitung → Kalkulation vorbereiten
8. Vorlagen → Angebotsausgabe vorbereiten
```

Wichtig:

```text
Keine Massenänderungen.
Immer nur eine Verknüpfung.
Immer Build testen.
Immer pushen.
```

# PrintPilot Redesign Dokumentation

## Aktueller Stand

PrintPilot befindet sich auf dem Branch:

```text
restart-designsystem
```

Der aktuelle Stand ist ein stabiler Store-, Persistenz-, UI- und Workflow-Zwischenstand.

Alle wichtigen Grundbereiche sind an den App-weiten Store angebunden und werden lokal im Browser persistiert.

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
zentrale Status-Farblogik
zentrale ConfirmDialog-Komponente
Übersichtstab "Alle Angebote"
Übersichtstab "Alle Aufträge"
Auftragslogik für Freigabe / Produktion / Übergabe
```

Noch nicht umgesetzt:

```text
echte Datenbank
API
Mehrplatzbetrieb
echte Kalkulationslogik
Angebot → Auftrag als produktiver Workflow
Dashboard-Plantafel
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

## Übersichtstabs

### Angebote

Die Angebotsseite hat jetzt:

```text
Alle Angebote
Entwurf
Offen
Angenommen
Abgelehnt
```

`Alle Angebote` zeigt alle Angebote unabhängig vom Status.

Nach Statusänderungen wird wieder auf:

```text
Alle Angebote
```

gewechselt, damit der Datensatz sichtbar bleibt.

---

### Aufträge

Die Auftragsseite hat jetzt:

```text
Alle Aufträge
Neu
In Produktion
Wartet
Fertig
Archiv
```

`Alle Aufträge` zeigt alle Aufträge unabhängig vom Status.

Nach Statusänderungen bleibt die Übersicht stabil und der Datensatz bleibt sichtbar.

---

## ConfirmDialog-Standard

Neue zentrale Komponente:

```text
src/ui/ConfirmDialog.tsx
```

Ziel:

```text
alle Warnungen und kritischen Bestätigungen einheitlich als modales Popup
keine Browser-Popups
keine uneinheitlichen Inline-Warnungen
```

Unterstützte Varianten:

```text
default
warning
danger
```

Aktuell eingesetzt bei:

```text
Aufträge: Produktion / Druck ohne gültige Freigabe
Einstellungen: Backup-Import "Alles ersetzen"
```

Zukünftig verwenden für:

```text
Änderungen verwerfen
lokalen Store zurücksetzen
Auftrag löschen
Angebot in Auftrag umwandeln
Materialbestand kritisch
kritische Kalkulationswarnungen
```

---

## Status-Badge-Farblogik

Neue zentrale Datei:

```text
src/data/statusBadges.ts
```

Neue Hilfsfunktion:

```ts
getPrintPilotStatusBadgeVariant(status)
```

Die Badge-Komponente unterstützt:

```text
success
warning
danger
neutral
```

Farbgruppen:

```text
Grün / success:
Aktiv
Auf Lager
Angenommen
Fertig
Freigabe erteilt

Orange / warning:
Offen
Optional
Entwurf
Wartet
Wartung
Knapp
In Produktion
Korrektur angefordert

Rot / danger:
Abgelehnt
Bestellen
Freigabe ausstehend
Daten unvollständig

Grau / neutral:
Archiv
Inaktiv
Interessent
Nicht erforderlich
unbekannte Statuswerte
```

Umgestellt:

```text
Angebote
Aufträge
Kunden
Material
Maschinen
Leistungen / Services
Weiterverarbeitung / Finishing
Vorlagen / Templates
```

---

## Auftragslogik

### Ziel

Aufträge sollen fachlich sauberer geführt werden.

Umgesetzt:

```text
Maschine als Dropdown aus Maschinen-Store
Freigabe als Dropdown
Übergabe als Dropdown
Priorität als Dropdown
Status als Dropdown
Freigabe-Badge farblich
ConfirmDialog bei kritischer Produktionslogik
```

### Freigabe

Optionen:

```text
Freigabe ausstehend
Freigabe erteilt
Korrektur angefordert
Daten unvollständig
Nicht erforderlich
```

Gültig ohne Warnung:

```text
Freigabe erteilt
Nicht erforderlich
```

Blockierend:

```text
Freigabe ausstehend
Korrektur angefordert
Daten unvollständig
```

### Übergabe

Optionen:

```text
Druckdaten prüfen
Wartet auf Daten
In Druck
In Weiterverarbeitung
Abholbereit
Versendet
Abgeschlossen
```

### Produktionsrelevante Zustände

Eine Warnung erscheint, wenn:

```text
Status = In Produktion
oder Übergabe = In Druck
oder Übergabe = In Weiterverarbeitung
```

und gleichzeitig:

```text
Freigabe ist nicht gültig
```

Wenn `Übergabe` auf `In Druck` oder `In Weiterverarbeitung` gesetzt wird, wird der Auftragsstatus automatisch auf:

```text
In Produktion
```

gesetzt.

---

## Backup

Backup bleibt Store-basiert.

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

Der Import "Alles ersetzen" nutzt jetzt `ConfirmDialog`.

---

## localStorage-Migration

Die Funktion:

```ts
createPrintPilotStoreSnapshot()
```

füllt nachträglich ergänzte Datenbereiche automatisch mit Initialdaten, wenn im bestehenden localStorage alte leere Bereiche vorhanden sind.

Bestehende gespeicherte Daten sollen erhalten bleiben.

Neue Bereiche werden ergänzt.

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

## Nächste sinnvolle Schritte

Empfohlene Reihenfolge:

```text
1. Doku prüfen und pushen
2. Auftragslogik weiter stabilisieren, falls nötig
3. Angebot → Auftrag vorbereiten
4. Dashboard-Plantafel aus orders vorbereiten
5. Material / Maschinen / Leistungen für Kalkulation verknüpfen
6. Vorlagen für Angebotsausgabe vorbereiten
```

Grundregel:

```text
Eine Verknüpfung pro Schritt.
Keine Massenänderungen.
Immer Build testen.
Immer pushen.
```

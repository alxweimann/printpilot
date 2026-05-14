# Orders Workflow Fields

## Ziel

Die Auftragsmaske wurde fachlich erweitert.

## Betroffene Dateien

```text
src/data/printPilotStore.ts
src/pages/OrdersPage.tsx
src/ui/Badge.tsx
docs/ORDERS_WORKFLOW_FIELDS.md
```

## Änderungen

### Freigabe

Freigabe ist jetzt ein fester Dropdown-Status:

```text
Freigabe ausstehend
Freigabe erteilt
Korrektur angefordert
Daten unvollständig
Nicht erforderlich
```

Zusätzlich wird die Freigabe in der Tabelle farbig als Badge angezeigt:

```text
Freigabe erteilt      → success / grün
Freigabe ausstehend   → danger / rot
Daten unvollständig   → danger / rot
Korrektur angefordert → warning / orange
Nicht erforderlich    → neutral / grau
```

### Übergabe

Übergabe ist jetzt ein Dropdown:

```text
Druckdaten prüfen
Wartet auf Daten
In Druck
In Weiterverarbeitung
Abholbereit
Versendet
Abgeschlossen
```

### Maschine

Maschine ist jetzt kein Freitext mehr.

Die Auftragsmaske liest Maschinen aus dem Store:

```ts
const { machines, orders, updateOrder } = usePrintPilotStore();
```

Der Auftrag speichert:

```ts
machineId
```

Dadurch kann später sauber auf Maschinenkosten, Klickkosten, Duplex und Farbmodus zugegriffen werden.

## Migration

Bestehende alte Aufträge aus localStorage werden normalisiert:

```text
machine → machineId
Freigegeben → Freigabe erteilt
Freigabe offen → Freigabe ausstehend
Kundenfreigabe fehlt → Freigabe ausstehend
```

## Badge

`Badge.tsx` unterstützt jetzt:

```text
success
warning
danger
neutral
```

## Test

```text
Aufträge öffnen
Schloss öffnen
Freigabe ändern
Übergabe ändern
Maschine ändern
Änderungen speichern
Tab wechseln
Browser neu laden
Backup erstellen
data.orders prüfen
```

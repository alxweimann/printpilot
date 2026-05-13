# PrintPilot UI Standards

## Ziel

Dieses Dokument hält zentrale UI-Standards fest, die ab jetzt projektweit gelten.

## ConfirmDialog

### Datei

```text
src/ui/ConfirmDialog.tsx
```

### Zweck

Kritische Aktionen und Warnungen werden als modale Popups angezeigt.

Nicht mehr verwenden:

```text
window.alert()
window.confirm()
uneinheitliche Inline-Warnblöcke
```

### Varianten

```text
default
warning
danger
```

### Beispiel

```tsx
<ConfirmDialog
  open={isDialogOpen}
  title="Auftrag ohne gültige Freigabe"
  description={
    <>
      Dieser Auftrag soll trotz fehlender Freigabe in Produktion gesetzt werden.
    </>
  }
  details={
    <>
      <span>Auftrag: AU-2026-001</span>
      <span>Produkt: Broschüre A4</span>
    </>
  }
  variant="danger"
  cancelLabel="Abbrechen"
  confirmLabel="Trotzdem speichern"
  onCancel={handleCancel}
  onConfirm={handleConfirm}
/>
```

### Aktuelle Einsätze

```text
Aufträge:
Produktion / Druck ohne gültige Freigabe

Einstellungen:
Backup-Import "Alles ersetzen"
```

### Zukünftige Einsätze

```text
Änderungen verwerfen
lokalen Store zurücksetzen
Auftrag löschen
Angebot in Auftrag umwandeln
Materialbestand kritisch
kritische Kalkulationshinweise
```

---

## Badge

### Datei

```text
src/ui/Badge.tsx
```

### Varianten

```text
success
warning
danger
neutral
```

### Status-Farblogik

Die Farblogik liegt zentral in:

```text
src/data/statusBadges.ts
```

Funktion:

```ts
getPrintPilotStatusBadgeVariant(status)
```

### Farbgruppen

```text
success:
Aktiv
Auf Lager
Angenommen
Fertig
Freigabe erteilt

warning:
Offen
Optional
Entwurf
Wartet
Wartung
Knapp
In Produktion
Korrektur angefordert

danger:
Abgelehnt
Bestellen
Freigabe ausstehend
Daten unvollständig

neutral:
Archiv
Inaktiv
Interessent
Nicht erforderlich
sonstige Werte
```

### Regel

Statusfarben nicht mehr lokal in Seiten definieren.

Immer:

```tsx
<Badge variant={getPrintPilotStatusBadgeVariant(item.status)}>
  {item.status}
</Badge>
```

---

## Übersichtstabs

Für Module mit Statusfiltern wird ein erster Übersichtstab verwendet.

Beispiele:

```text
Alle Angebote
Alle Aufträge
```

Vorteil:

```text
Datensätze verschwinden nach Statuswechsel nicht plötzlich.
```

Nach Statuswechseln bevorzugt zurück zur Übersicht wechseln.

---

## Tabellen

Tabellen sollen Statuswerte möglichst als Badge anzeigen.

Tabellenstatus nicht als reinen Text anzeigen, wenn der Status fachlich relevant ist.

---

## Warnungen

Warnungen sollen:

```text
konkret
kurz
handlungsorientiert
modal
mit klarer Bestätigungs- und Abbruchaktion
```

sein.

Beispiel:

```text
Abbrechen
Trotzdem speichern
```

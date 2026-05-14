# Confirm Dialog Standard

## Ziel

Warnungen und kritische Bestätigungen sollen in PrintPilot einheitlich als modale Popups dargestellt werden.

## Neue Komponente

```text
src/ui/ConfirmDialog.tsx
```

## Unterstützte Varianten

```text
default
warning
danger
```

## Erste umgestellte Bereiche

```text
Aufträge:
- Produktion ohne gültige Freigabe

Einstellungen / Datensicherung:
- Backup-Import "Alles ersetzen"
```

## Warum

```text
kein window.confirm
kein window.alert
keine uneinheitlichen Inline-Warnungen
professionellere Bedienung
besser wiederverwendbar
```

## Beispiel

```tsx
<ConfirmDialog
  open={isOpen}
  title="Auftrag ohne gültige Freigabe"
  description="Dieser Auftrag soll trotz fehlender Freigabe in Produktion gesetzt werden."
  details={<span>Auftrag: AU-2026-001</span>}
  variant="danger"
  cancelLabel="Abbrechen"
  confirmLabel="Trotzdem speichern"
  onCancel={handleCancel}
  onConfirm={handleConfirm}
/>
```

## Nächste Einsätze

```text
Änderungen verwerfen
lokalen Store zurücksetzen
Auftrag löschen
Angebot in Auftrag umwandeln
Materialbestand unterschritten
kritische Kalkulationswarnungen
```

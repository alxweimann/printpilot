# Orders Modal Syntax Fix

## Ziel

`OrdersPage.tsx` wurde vollständig neu und sauber verschachtelt aufgebaut, weil die vorherige Modal-Integration JSX-Tags beschädigt hatte.

## Betroffene Datei

```text
src/pages/OrdersPage.tsx
```

## Enthalten

```text
Alle Aufträge Tab
Status-Tabs
Maschinen-Dropdown aus Store
Freigabe-Dropdown
Übergabe-Dropdown
Priorität-Dropdown
Freigabe-Badges
Modal bei Produktion ohne gültige Freigabe
direktes Speichern über "Trotzdem speichern"
```

## Verhalten

```text
Auftrag mit Freigabe ausstehend
Status auf In Produktion setzen
Modal erscheint
Abbrechen setzt Status zurück
Trotzdem speichern speichert direkt
Ansicht bleibt / wechselt zu Alle Aufträge
```

## Test

```text
npm run build
npm run dev

Aufträge öffnen
Schloss öffnen
Status auf In Produktion setzen
Modal prüfen
Abbrechen prüfen
erneut In Produktion
Trotzdem speichern prüfen
Browser reload prüfen
```

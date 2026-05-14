# Orders Approval Change Syntax Fix

## Ziel

Die JSX-Struktur in `OrdersPage.tsx` wurde repariert.

## Problem

Die vorherige Datei hatte am Ende des Modal-Bereichs eine beschädigte JSX-Klammerung.

Fehler:

```text
Unexpected token
```

## Lösung

`OrdersPage.tsx` wurde vollständig sauber neu aufgebaut und nutzt jetzt ausschließlich die zentrale Komponente:

```text
src/ui/ConfirmDialog.tsx
```

Dadurch gibt es kein manuell verschachteltes Modal-JSX mehr in der Seite.

## Enthalten

```text
Alle Aufträge
Status-Tabs
Maschinen-Dropdown
Freigabe-Dropdown
Freigabe-Badges
ConfirmDialog bei Produktion ohne gültige Freigabe
Warnung bei Statusänderung
Warnung bei Freigabeänderung
```

## Test

```text
npm run build
npm run dev

Aufträge öffnen
Schloss öffnen
Status auf In Produktion setzen
ConfirmDialog prüfen

oder:
Auftrag ist In Produktion
Freigabe auf ausstehend ändern
ConfirmDialog prüfen
```

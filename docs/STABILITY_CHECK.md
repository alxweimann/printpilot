# Stabilitätsprüfung Drawer/Tabellen

Stand: 14.05.2026

## Gefundene Abweichungen im hochgeladenen Stand

```text
CustomersPage: alte master-detail-layout-Struktur und verschachtelte Sortierheader
MaterialPage: alte master-detail-layout-Struktur und verschachtelte Sortierheader
MachinesPage: alte master-detail-layout-Struktur und verschachtelte Sortierheader
FinishingPage: alte master-detail-layout-Struktur und verschachtelte Sortierheader
ServicesPage: alte master-detail-layout-Struktur und verschachtelte Sortierheader
TemplatesPage: alte master-detail-layout-Struktur und verschachtelte Sortierheader
RemindersPage: alte master-detail-layout-Struktur
DetailDrawer: kein Portal-Drawer im hochgeladenen Stand
```

## Fix

Dieses Paket zieht die betroffenen Seiten wieder auf den finalen Standard:

```text
Portal-Drawer rechts
keine unteren Editorbereiche
keine verschachtelten th/SortableTableHeader-Strukturen
Sortierung bleibt erhalten
Speichern schließt den Drawer
```

# PrintPilot Roadmap

## Kurzfristig

### 1. DetailDrawer-Komponente bauen ✅

```text
Tabelle über volle Breite
Details rechts als Drawer
```

### 2. Aufträge auf Drawer-Layout umstellen ✅

Bestehende Logik muss erhalten bleiben:

```text
Alle Aufträge
Status-Tabs
Freigabe-Warnung
Übergabe-Warnung
Maschinen-Dropdown
Speichern
Änderungen verwerfen
ConfirmDialog
```

### 3. Angebote auf Drawer-Layout umstellen ✅

Bestehende Logik muss erhalten bleiben:

```text
Alle Angebote
Status-Tabs
Auftrag erstellen
Dublettenwarnung
ConfirmDialog
```

## Mittelfristig

### 4. Dokumenten-/Ausgabesystem vorbereiten

```text
Auftragstasche
Etiketten / Kartonaufkleber
Lieferschein
Rechnung
Mahnung
Angebot
Kalkulation
```

### 5. Auftragstasche als erste Druckausgabe

```text
Vorschau
Drucklayout
PDF später
```

### 6. Etiketten / Kartonaufkleber

```text
Kartonetiketten aus Auftragsdaten
Karton 1 von X
PDF/Druck
```

### 7. Dashboard-Plantafel

```text
Wochenübersicht über fällige Aufträge
```

## Langfristig

```text
Kalkulationsverknüpfungen
Angebotsausgabe / PDF
Rechnungen
Lieferscheine
Mahnungen
Datenbank
Mehrplatzbetrieb
API
```

## Grundregeln

```text
ein Modul pro Schritt
keine Massenänderungen
immer build testen
immer pushen
Doku aktuell halten
```

## UI-Layer Standard

```text
Erledigt: ConfirmDialog über DetailDrawer gelegt
```
- Erledigt: Auftrags-Drawer schließt nach erfolgreichem Speichern inklusive Freigabe-Warnbestätigung
- Erledigt: Auftrags-Drawer Feldreihenfolge Freigabe/Übergabe fachlich korrigiert
- Erledigt: Auftragsstatus-Badges vereinheitlicht
- Erledigt: Auftragsliste in allen Tabs sortierbar gemacht

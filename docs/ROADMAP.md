# PrintPilot Roadmap

Stand: 14.05.2026

## Erledigt

### UI-Standardisierung

- Tabellen optisch vereinheitlicht
- Globale Sortierlogik eingeführt
- Sortierbare Header ohne Button-Look umgesetzt
- Sortierpfeile sichtbar und sauber neben dem Header-Text positioniert
- Tabellenköpfe und Tabellenzellen linksbündig standardisiert
- Verschachtelte `th`-Strukturen entfernt

### Master-Detail-Drawer

Umgesetzt:

- Angebote
- Aufträge
- Rechnungen
- Lieferscheine

### Build / Stabilität

- CSS-Side-Effect-Import-Probleme bereinigt
- Store-/Typ-Probleme für aktuellen Buildstand bereinigt
- ConfirmDialog-Layer über Drawer gelegt

## Nächste Schritte

### 1. Drawer-Rollout fortsetzen

Als Nächstes:

```txt
Mahnungen
Kunden
Material
Maschinen
Weiterverarbeitung
Leistungen
Vorlagen
```

### 2. Detailinhalte fachlich ausbauen

Nach dem Drawer-Rollout:

```txt
Positionstabellen
Statuslogik
Druck-/Produktionsdaten
PDF-/Ausgabeaktionen
Verknüpfungen zwischen Angebot → Auftrag → Rechnung → Lieferschein → Mahnung
```

### 3. Doku schlank halten

Keine neuen Mini-Doku-Dateien pro Hotfix.

Änderungen werden bevorzugt in diesen Dateien gepflegt:

```txt
docs/PROJECT_STATE.md
docs/ROADMAP.md
docs/UI_STANDARDS.md
docs/MASTER_DETAIL_DRAWER.md
docs/WORKFLOWS.md
docs/ARCHITECTURE.md
```

# Doku-Aufräumplan

## Neue aktive Hauptdoku

Behalten:

```text
README.md
PROJECT_STATE.md
ARCHITECTURE.md
UI_STANDARDS.md
WORKFLOWS.md
OUTPUT_SYSTEM.md
BACKUP.md
ROADMAP.md
DOCS_CLEANUP.md
```

Optional zusätzlich behalten:

```text
MASTER_DETAIL_DRAWER.md
```

## Alte Detaildateien archivieren

Nicht sofort löschen, sondern nach `docs/archive/` verschieben.

## Windows-Befehle

Im Projektordner:

```bat
mkdir docs\archive
```

Dann historische Dateien verschieben:

```bat
move docs\ALL_TABLES_NOWRAP_FIX.md docs\archive\
move docs\APPROVAL_BADGE_EXPORT_FIX.md docs\archive\
move docs\BACKUP_IMPORT.md docs\archive\
move docs\CONFIRM_DIALOG_STANDARD.md docs\archive\
move docs\CUSTOMERS_EDIT_FIX.md docs\archive\
move docs\CUSTOMERS_STORE.md docs\archive\
move docs\EDIT_LOCK_ENCODING_FIX.md docs\archive\
move docs\FINISHING_STORE.md docs\archive\
move docs\MACHINES_STORE.md docs\archive\
move docs\MATERIAL_STORE.md docs\archive\
move docs\ORDERS_*.md docs\archive\
move docs\QUOTE_*.md docs\archive\
move docs\QUOTES_ALL_TAB.md docs\archive\
move docs\SERVICES_STORE.md docs\archive\
move docs\SETTINGS_STORE.md docs\archive\
move docs\STATUS_BADGE_COLORS.md docs\archive\
move docs\STORE.md docs\archive\
move docs\TABLE_*.md docs\archive\
move docs\TEMPLATES_STORE.md docs\archive\
move docs\WORKFLOW_STATE.md docs\archive\
```

Wichtig: Erst ausführen, wenn die neuen Hauptdateien vorhanden sind.

## Danach committen

```bat
git status
git add docs
git commit -m "Consolidate project documentation"
git push
```

## Neuer Chat

Für einen neuen Chat bereitstellen:

```text
docs/README.md
docs/PROJECT_STATE.md
docs/ROADMAP.md
docs/ARCHITECTURE.md
docs/UI_STANDARDS.md
docs/WORKFLOWS.md
docs/OUTPUT_SYSTEM.md
```

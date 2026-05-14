# Doku-Cleanup

Stand: 14.05.2026

## Ziel

Die Doku wird konsolidiert. Kleine Hotfix-Dokumente werden nicht dauerhaft behalten.

## Behalten

```txt
docs/README.md
docs/ARCHITECTURE.md
docs/PROJECT_STATE.md
docs/ROADMAP.md
docs/UI_STANDARDS.md
docs/MASTER_DETAIL_DRAWER.md
docs/WORKFLOWS.md
docs/OUTPUT_SYSTEM.md
docs/BACKUP.md
docs/REDESIGN.md
docs/DOCS_CLEANUP.md
```

## Entfernen

Einmalige Hotfix-/Zwischendateien werden entfernt, z. B.:

```txt
docs/BUILD_BASELINE_CSS_DECLARATION_FIX.md
docs/BUILD_BASELINE_CSS_HOTFIX.md
docs/DRAWER_CLOSE_BUTTON_RIGHT.md
docs/DRAWER_SLOWER_ANIMATION.md
docs/MASTER_DETAIL_DRAWER_COMPONENT.md
docs/QUOTES_DRAWER_VISUAL_FIX.md
docs/QUOTES_MASTER_DETAIL_DRAWER.md
docs/TABLE_UI_HOTFIX_CHILDREN_SUPPORT.md
docs/TABLE_UI_HOTFIX_DATATABLE.md
docs/TABLE_UI_HOTFIX_ROBUST_DATATABLE.md
docs/TABLE_UI_HOTFIX_TOOLBAR.md
docs/TABLE_UI_STANDARD.md
docs/archive
```

## Projektdateien entfernen

Unnötige lokale Arbeitsdateien:

```txt
printpilot-current-ui.zip
printpilot-current-baseline.zip
printpilot-current-full.zip
```

Ungenutzte CSS-Platzhalter:

```txt
src/ui/detailDrawer.css
src/ui/table.css
```

Diese werden nicht mehr direkt importiert.

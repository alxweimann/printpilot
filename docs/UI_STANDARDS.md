# PrintPilot UI Standards

## ConfirmDialog

Datei:

```text
src/ui/ConfirmDialog.tsx
```

Verwendung für:

```text
Warnungen
kritische Bestätigungen
gefährliche Aktionen
Workflow-Entscheidungen
```

Nicht mehr verwenden:

```text
window.alert()
window.confirm()
uneinheitliche Inline-Warnungen
```

Varianten:

```text
default
warning
danger
```

## Badge-Farben

Dateien:

```text
src/ui/Badge.tsx
src/data/statusBadges.ts
```

Varianten:

```text
success
warning
danger
neutral
```

Farbgruppen:

```text
success: Aktiv, Auf Lager, Angenommen, Fertig, Freigabe erteilt
warning: Offen, Optional, Entwurf, Wartet, Wartung, Knapp, In Produktion, Korrektur angefordert
danger: Abgelehnt, Bestellen, Freigabe ausstehend, Daten unvollständig
neutral: Archiv, Inaktiv, Interessent, Nicht erforderlich, sonstige Werte
```

## Tabellen

Dateien:

```text
src/ui/Table.tsx
src/ui/table.css
```

Standard:

```text
Tabellenzellen bleiben einzeilig
lange Inhalte werden mit … gekürzt
Tabellen dürfen horizontal scrollen
Zeilenhöhen bleiben ruhig
```

## Edit-Modus

```text
Schloss geschlossen = Felder gesperrt
Schloss offen = Bearbeitung aktiv
Speichern schreibt in Store
Änderungen verwerfen setzt Draft zurück
```

## Geplanter DetailDrawer-Standard

```text
Tabelle = Hauptarbeitsfläche
Drawer = Details / Bearbeitung / Aktionen
```

Perspektivisch für:

```text
Angebote
Aufträge
Rechnungen
Lieferscheine
Mahnungen
Kunden
Material
Maschinen
Leistungen
Weiterverarbeitung
Vorlagen
```

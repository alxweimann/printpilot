# Ui Standards

## Sortierpfeil-Abstand

Sortierpfeile dürfen nicht direkt an der Spaltenbeschriftung kleben.

Standard:

```text
inaktive Spalten: kein sichtbares Sortierzeichen
aktive Spalte: Pfeil mit ruhigem Abstand rechts neben dem Text
kein Unterstrich, kein Balken, kein Browser-Button-Look
```

## Sortierkopf ohne natives Button-Rendering

Sortierbare Tabellenköpfe verwenden kein natives `<button>`-Element mehr, weil globale Browser-/Button-Styles sonst sichtbare Rahmen oder kleine Balken erzeugen können.

Standard:

```text
klickbarer Tabellenkopf über neutrales Element
Tastaturbedienung über Enter/Leertaste bleibt erhalten
kein Buttonrahmen
kein Buttonhintergrund
kein Unterstrich/Balken
```

## Abstand Spaltentitel zu Sortierpfeil

Der Sortierpfeil steht mit deutlichem Abstand rechts neben dem Spaltentitel.

Aktueller Standard:

```text
Spaltentitel → 20 px Abstand → Sortierpfeil
```

Damit wirkt der Pfeil nicht wie ein Satzzeichen direkt am Wort.

## Sortierkopf Cursor und Unterstrich

Sortierbare Tabellenköpfe müssen sich wie klickbare UI-Elemente verhalten, dürfen aber nicht wie Browser-Buttons oder Textlinks aussehen.

Standard:

```text
Cursor: pointer
Textauswahl deaktiviert
keine Unterstreichung
keine Border/Shadow-Linie am Label
Pfeil mit deutlichem Abstand zum Text
```

## Sortierkopf ohne Wrapper-Unterstreichung

Der Klickbereich sortierbarer Tabellenköpfe liegt direkt auf der Tabellenzelle (`th`).

Damit greifen keine nativen Button-, Link- oder Role-Styles mehr, die kleine Unterstriche oder Balken unter der Beschriftung erzeugen können.

Standard:

```text
Klick direkt auf th
kein button
kein role="button" Wrapper
keine Textauswahl
Cursor pointer
aria-sort auf aktiver Spalte
```

## Sichtbarkeit und Abstand der Sortierpfeile

Sortierbare Tabellenköpfe zeigen den Sortierindikator immer an.

Standard:

```text
inaktive Spalte: dezentes ↕
aktive Spalte aufsteigend: ↑
aktive Spalte absteigend: ↓
Abstand Text zu Pfeil: großzügig, nicht direkt am Wort
```

Der Klickbereich bleibt die gesamte Tabellenkopf-Zelle (`th`). Es gibt keinen Buttonrahmen, keine Unterstreichung und keinen Textcursor.\n\n## Stabiler Sortierpfeil-Abstand\n\nDer Abstand zwischen Spaltenbeschriftung und Sortierpfeil wird im `SortableTableHeader` inline gesetzt, damit globale Tabellen- oder Button-Styles ihn nicht überschreiben.\n\nAktueller Standard:\n\n```text\nmargin-left: 10px\nPfeilbreite: 16px\nPfeile immer sichtbar\nkein Textcursor\nkein Buttonrahmen\nkeine Unterstreichung\n```\n

## Finaler Sortierpfeil-Abstand

Der Abstand zwischen Spaltenbeschriftung und Sortierpfeil ist auf einen ausgewogenen Mittelwert gesetzt.

Aktueller Standard:

```text
margin-left: 10px
Pfeilbreite: 16px
Pfeile immer sichtbar
kein Textcursor
kein Buttonrahmen
keine Unterstreichung
```

## Finaler Sortierpfeil-Abstand 10px

Der Abstand zwischen Spaltenbeschriftung und Sortierpfeil ist final auf 10px gesetzt.

Aktueller Standard:

```text
margin-left: 10px
Pfeilbreite: 16px
Pfeile immer sichtbar
kein Textcursor
kein Buttonrahmen
keine Unterstreichung
```

## Bündigkeit sortierbarer Tabellenköpfe

Sortierbare Tabellenköpfe müssen mit den darunterliegenden Zellinhalten bündig beginnen.

Standard:

```text
Header linksbündig zur Spalte
kein optischer Versatz durch Pfeil/Wrapper
Pfeil steht rechts neben dem Label mit 10px Abstand
Klickbereich bleibt die Tabellenkopf-Zelle
```

## Textausrichtung in sortierbaren Tabellenköpfen

Sortierbare Tabellenköpfe setzen die Textausrichtung direkt auf der `th`-Zelle.

Grund: Browser setzen `th` häufig standardmäßig auf `text-align: center`. Dadurch kann ein Header optisch mittig stehen, obwohl der innere Inhalt linksbündig definiert ist.

Standard:

```text
align="left"   → th text-align: left
align="center" → th text-align: center
align="right"  → th text-align: right
```

## Sortierpfeil ohne optischen Versatz

Der Sortierpfeil wird absolut rechts neben dem Spaltenlabel positioniert.

Dadurch bleibt die Beschriftung selbst exakt an der gewünschten Spaltenausrichtung und wird nicht durch die Pfeilbreite verschoben.

Standard:

```text
Label bestimmt die optische Ausrichtung
Pfeil steht rechts neben dem Label
Pfeil-Abstand: 10px
Pfeil beeinflusst Label-Breite nicht
```

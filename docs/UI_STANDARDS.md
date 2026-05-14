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

Der Klickbereich bleibt die gesamte Tabellenkopf-Zelle (`th`). Es gibt keinen Buttonrahmen, keine Unterstreichung und keinen Textcursor.

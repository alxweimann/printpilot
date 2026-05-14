# Orders Derived Approval Warning

## Ziel

Die Warnung vor Produktion ohne Freigabe ist jetzt direkt aus dem Draft abgeleitet.

## Warum

Vorher hing die Warnung an einem zusätzlichen Zwischenzustand. Wenn dieser nicht sauber gesetzt wurde, wirkte die Maske so, als würde nichts passieren.

## Neue Logik

Der Status wird beim Dropdown-Wechsel immer direkt in den Draft geschrieben:

```ts
updateDraftField("status", nextStatus);
```

Die Warnung wird danach automatisch berechnet aus:

```text
draft.status
draft.approval
productionOverrideConfirmed
```

## Verhalten

```text
Status auf In Produktion setzen
Status wechselt sichtbar
Wenn Freigabe nicht gültig ist:
Warnblock erscheint automatisch
Speichern bleibt blockiert
```

Erst nach Klick auf:

```text
Warnung bestätigen
```

kann gespeichert werden.

## Abbrechen

Bei Klick auf:

```text
Abbrechen
```

wird der Status zurück auf den aktuellen Tab gesetzt.

## Technischer Hinweis

Das Status-Select nutzt jetzt zusätzlich zu `onChange` auch `onInput`, damit die Änderung in der lokalen Umgebung zuverlässig ankommt.

## Test

```text
Aufträge öffnen
Schloss öffnen
Auftrag mit Freigabe ausstehend wählen
Status auf In Produktion setzen
Status muss sichtbar wechseln
Warnblock muss erscheinen
Speichern darf vor Bestätigung nicht speichern
Warnung bestätigen
Änderungen speichern
Auftrag wandert in Tab In Produktion
```

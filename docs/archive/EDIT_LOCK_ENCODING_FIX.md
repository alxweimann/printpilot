# EditLockToggle Encoding Fix

## Problem

In `src/ui/EditLockToggle.tsx` waren Umlaute und Schloss-Icons durch Encoding beschädigt.

Beispiele:

```text
Bearbeitung ├Âffnen
­ƒöô
­ƒöÆ
```

Dadurch war der Edit-Schalter optisch nicht zuverlässig erkennbar.

## Lösung

Die sichtbaren Schloss-Icons werden jetzt über Unicode-Escape-Sequenzen gesetzt:

```tsx
{isEditing ? "\uD83D\uDD13" : "\uD83D\uDD12"}
```

Außerdem wurde der aria/title-Text auf `oeffnen` ohne Umlaut geändert, damit Windows-Encoding keine Zeichen zerstört.

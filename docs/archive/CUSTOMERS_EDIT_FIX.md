# Customers Edit Fix

## Problem

In der Kundenmaske konnten Name und Telefonnummer trotz Store-Anbindung nicht zuverlässig bearbeitet werden.

## Fix

`CustomersPage.tsx` nutzt jetzt einen klaren Bearbeitungszustand:

```ts
const canEdit = isEditing && Boolean(draft);
```

Alle editierbaren Felder verwenden:

```tsx
readOnly={!canEdit}
```

bei Inputs und:

```tsx
disabled={!canEdit}
```

bei Selects.

## Erwartetes Verhalten

```text
Kunden öffnen
Schloss öffnen
Name ändern
Telefon ändern
Änderungen speichern
Tab wechseln
zurückwechseln
Änderung bleibt
Browser neu laden
Änderung bleibt
```

## Betroffene Datei

```text
src/pages/CustomersPage.tsx
```

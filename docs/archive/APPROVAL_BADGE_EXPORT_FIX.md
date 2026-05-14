# Approval Badge Export Fix

## Problem

`OrdersPage.tsx` importiert:

```ts
getPrintPilotApprovalBadgeVariant
```

Die Funktion fehlte aber in:

```text
src/data/printPilotStore.ts
```

Dadurch entstand eine weiße Seite mit dem Browser-Fehler:

```text
does not provide an export named 'getPrintPilotApprovalBadgeVariant'
```

## Lösung

Der fehlende Export wurde wieder ergänzt.

## Test

```text
npm run build
npm run dev
Browser hart neu laden
```

# PrintPilot Redesign Dokumentation

## Fix: AppShell nach StoreProvider-Einbau erhalten

Datei:

```text
src/app/App.tsx
```

## Problem

Beim Einbau des App-weiten Stores wurde `App.tsx` zu stark vereinfacht. Dadurch wurde die bestehende Shell-Struktur nicht mehr gerendert.

Auswirkung:

```text
Sidebar fehlt
Top-/Shell-Layout fehlt
Dashboard wirkt roh
```

## Lösung

`PrintPilotStoreProvider` umschließt die bestehende App-Struktur, aber `AppShell` bleibt erhalten:

```tsx
<PrintPilotStoreProvider>
  <AppShell>
    <AppRouter />
  </AppShell>
</PrintPilotStoreProvider>
```

## Wichtig

Der Store ist jetzt eingebunden, ohne das bestehende PrintPilot-Layout zu entfernen.

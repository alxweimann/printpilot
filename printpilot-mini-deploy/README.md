# PrintPilot Mini 1.1 — Cloudflare Worker

Isolierte Test-App unter `printpilot-mini/index.html`.

## Aktueller Stand
- Browserbasierte Produktionsplanung, lokale Speicherung per localStorage.
- Keine zentrale Datenbank, keine Authentifizierung, keine gemeinsame PC/iPhone-Synchronisierung.
- Diese Entwicklung liegt nur im Feature-Branch; die produktive PrintPilot-App auf `main` wird nicht verändert.

## Cloudflare-Deployment
Ziel-Worker: `red-king-5309` (bestehende workers.dev-Adresse).
Konfiguration: `wrangler.json` in diesem Ordner, statische Assets aus `../printpilot-mini`.

Der Workflow benoetigt als GitHub Actions Secrets:
- `CLOUDFLARE_API_TOKEN` mit den noetigen Worker-Berechtigungen
- `CLOUDFLARE_ACCOUNT_ID`

Erst bei autorisierter Ausfuehrung den Workflow starten. Vor einer Produktivveroeffentlichung bestehende Worker-Einstellungen und Datennutzung pruefen.

**Nicht mit echten Kundendaten testen:** Weboberflaeche ist derzeit nicht durch ein Login geschuetzt. Eingetragene Daten liegen zwar browserlokal, aber auf gemeinsam genutzten Geraeten koennen sie dort eingesehen werden.

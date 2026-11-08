# PrintPilot Mini 2.0 – isoliertes Backend (Entwicklungsstand)

**Nicht produktiv.** Dieser Ordner liegt nur in `feature/printpilot-mini-v2-secure-backend`.
Die laufende PrintPilot-Mini-1.12-Oberfläche, ihre bestehende Cloudflare-URL und ihre `localStorage`-Daten bleiben unverändert.

## Sicherheitskonzept

- Cloudflare Access **vor dem Worker** aktivieren: nur diesen *neuen* Staging-Worker schützen, nicht pauschal alle Projekte.
- Im Worker wird jede Anfrage ohne `ctx.access` abgewiesen. Angemeldete Benutzer brauchen zusätzlich einen aktiven Eintrag in `users`.
- Rollen: `admin` (alles), `production` (Aufträge erstellen und ändern; kein endgültiges Löschen), `display` (nur lesen).
- Schreiboperationen benötigen `X-Requested-With: PrintPilotMini` und JSON (zusätzlicher Cross-Site-Schutz). Berechtigung und Optimistic Locking gelten **serverseitig**.
- Kein öffentlicher Bootstrap-Admin und keine hartcodierten E-Mail-Adressen oder Tokens. Benutzer werden kontrolliert durch den Administrator angelegt.
- Jede Änderung wird in `audit_log` dokumentiert, D1-Batch für Datenänderung + Audit.

## Staging-Einrichtung (nach Cloudflare-Access-Konfiguration)

1. In Cloudflare eine **neue** D1-Datenbank `printpilot-mini-v2-staging` erstellen. Produktive Datenbank nicht wiederverwenden.
2. `wrangler.example.jsonc` als `wrangler.jsonc` kopieren; `database_id` einsetzen.
3. `npx wrangler d1 migrations apply printpilot-mini-v2-staging --remote` im Ordner `printpilot-mini-v2` ausführen.
4. Erste Administratoradresse gezielt eintragen, *nur* nachdem Access für dieselbe Person aktiviert wurde:
   `npx wrangler d1 execute printpilot-mini-v2-staging --remote --command="INSERT INTO users(email,role) VALUES ('ADMIN_EMAIL_HIER','admin')"`
5. Den *Staging*-Worker bereitstellen und unter Workers & Pages → Staging-Worker → Access → **Protect this Worker behind Access** schützen. Zugriff auf Produktion **und** Preview absichern; ausschließlich freigegebene Adressen zulassen. Ohne aktive Access-Policy ist der Worker weiterhin fail-closed.
6. API und Rechte mit drei unterschiedlichen Cloudflare-Access-Konten testen. Erst anschließend Frontend und Migration der v1-Browserdaten separat planen.

## Endpunkte

- `GET /api/v2/me`: angemeldete Identität und Rolle
- `GET /api/v2/jobs`: aktive + archivierte Aufträge (maximal 5000)
- `POST /api/v2/jobs`: Auftrag anlegen, Admin/Produktion
- `PUT /api/v2/jobs/:id`: vollständig aktualisieren, `revision` verpflichtend
- `POST /api/v2/jobs/:id/archive`: erledigten Auftrag ablegen, Admin/Produktion
- `POST /api/v2/jobs/:id/restore`: zurückholen, Admin/Produktion
- `DELETE /api/v2/jobs/:id`: endgültig löschen, nur Admin, `revision` verpflichtend
- `GET /api/v2/machines`: Maschinen
- `GET /api/v2/audit`: letzte 100 Änderungen, nur Admin

Der neue Worker stellt unter `/` eine **geschützte Testoberfläche** bereit (`src/dashboard.js`). Diese liest D1-Aufträge, zeigt fünf Wochentage und aktualisiert alle 15 Sekunden. Angemeldete Benutzer mit Rolle `admin` oder `production` können neue Testaufträge anlegen, bearbeiten und fertige Aufträge archivieren; `display` bleibt strikt schreibgeschützt. Sie enthält keine Kundendaten, solange D1 nicht gezielt befüllt wurde. Die bekannte Version-1.12.1-Oberfläche bleibt unverändert. `src/api-client.js` stellt die später benötigten, versionsgesicherten API-Aufrufe bereit. `src/migration.js` bereitet den Altbestandsimport nur lesend vor und blockiert ihn bei fehlerhaften oder doppelten Datensätzen.

## Vor Produktivbetrieb offen

End-to-End-Tests mit D1 und echten Access-Identitäten, insbesondere Konflikt- und Speicherverhalten; vollständige Integration der bewährten UI (einschließlich Schloss, Tagesansicht, Auftragsarchiv und Drag-and-drop), Konfliktdialog, kontrollierter Altbestandsimport mit Vorschau und Prüfsummen, Benutzerverwaltung, Wiederherstellungstest, Backup-Richtlinie und Prüfung des bisherigen Lösch-/Bearbeiten-Verhaltens.

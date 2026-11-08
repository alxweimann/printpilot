# PrintPilot Mini 2.0 – isoliertes Backend (Entwicklungsstand)

**Nicht produktiv.** Dieser Ordner liegt nur in `feature/printpilot-mini-v2-secure-backend`.
Die laufende PrintPilot-Mini-1.12.1-Oberfläche, ihre bestehende Cloudflare-URL und ihre `localStorage`-Daten bleiben unverändert.

## Sicherheitskonzept

- Cloudflare Access **vor dem Worker** aktivieren: nur diesen *neuen* Staging-Worker schützen, nicht pauschal alle Projekte.
- Im Worker wird jede Anfrage ohne `ctx.access` abgewiesen. Angemeldete Benutzer brauchen zusätzlich einen aktiven Eintrag in `users`.
- Rollen: `admin` (alles), `production` (Aufträge erstellen und ändern; kein endgültiges Löschen), `display` (nur lesen).
- Schreiboperationen benötigen `X-Requested-With: PrintPilotMini` und JSON (zusätzlicher Cross-Site-Schutz). Berechtigung und Optimistic Locking gelten **serverseitig**. Fixtermine dürfen nur mit ausdrücklicher Bestätigung verschoben werden.
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
- `POST /api/v2/jobs/:id/move`: Auftragsdatum und Position versionsgesichert ändern; bei Fixterminverschiebung nur mit Bestätigung
- `POST /api/v2/jobs/:id/archive`: erledigten Auftrag ablegen, Admin/Produktion
- `POST /api/v2/jobs/:id/restore`: zurückholen, Admin/Produktion
- `DELETE /api/v2/jobs/:id`: endgültig löschen, nur Admin, `revision` verpflichtend
- `GET /api/v2/machines`: Maschinen
- `GET /api/v2/audit`: letzte 100 Änderungen, nur Admin

Der neue Worker stellt unter `/` eine **geschützte Testoberfläche** bereit (`src/dashboard.js`). Diese liest D1-Aufträge, zeigt fünf Wochentage oder einen einzelnen vergrößerten Tag, bietet ein aufklappbares Archiv mit Wiederherstellung und aktualisiert alle 15 Sekunden. Verschieben ist in der Testoberfläche standardmäßig durch ein Schloss gesperrt und kann nach Entsperren über Tagesauswahl sowie Aufwärts-/Abwärts-Tasten erfolgen. Drag-and-drop bleibt eine noch offene Erweiterung. Angemeldete Benutzer mit Rolle `admin` oder `production` können neue Testaufträge anlegen, bearbeiten, fertige Aufträge archivieren und aus dem Archiv wiederherstellen. Nur `admin` darf archivierte Aufträge endgültig löschen. `display` bleibt strikt schreibgeschützt. Sie enthält keine Kundendaten, solange D1 nicht gezielt befüllt wurde. Die bekannte Version-1.12.1-Oberfläche bleibt unverändert. `src/api-client.js` stellt die später benötigten, versionsgesicherten API-Aufrufe bereit. `src/migration.js` bereitet den Altbestandsimport nur lesend vor und blockiert ihn bei fehlerhaften oder doppelten Datensätzen. Die Testoberfläche hat eine **rein lokale JSON-Prüfvorschau** („Altbestand prüfen“), die keine Daten hochlädt; die endgültige Übernahme bleibt gesperrt.

## Vor Produktivbetrieb offen

End-to-End-Tests mit D1 und echten Access-Identitäten, insbesondere Konflikt- und Speicherverhalten; vollständige Übernahme des bewährten 1.12.1-Designs (insbesondere Drag-and-drop und alle Layoutdetails; Tagesansicht und Archiv sind bereits in einer einfacheren Staging-Version vorhanden), Konfliktdialog, kontrollierter Altbestandsimport mit Vorschau und Prüfsummen, Benutzerverwaltung, Wiederherstellungstest, Backup-Richtlinie und Prüfung des bisherigen Lösch-/Bearbeiten-Verhaltens.

## Derzeitiger Integrationsstatus (08.11.2026)

- **Fertig in GitHub:** Authentifizierungsprüfung, Rollensystem, D1-Schema, API für Auftragsverwaltung, einfache Staging-Bedienung, Tagesansicht, Archiv/Wiederherstellung, Fixtermin-Sperre, Status „Daten fehlen“ und „Auftragstasche fehlt“, Notizen, Browserdaten-Prüfvorschau und GitHub-Actions-Testkonfiguration.
- **Noch nicht ausgeführt:** Cloudflare-D1-Erstellung, echte Access-Policy, Bereitstellung des separaten Workers, echte D1-Transaktionstests, produktive Multi-Device-Synchronisierung und Import von Browserdaten.
- **Kein Live-Ersatz:** Die neue Staging-Oberfläche ist weiterhin nicht die vollständige bekannte 1.12.1-Oberfläche; die bisherige URL darf vor Abschluss der Tests nicht umgestellt werden.

- **Neue Staging-Funktionen:** API-Auftragsverschiebung mit Versions- und Fixterminprüfung, standardmäßig gesperrte Bewegungsbedienung, reine lokale Prüfvorschau einer JSON-Sicherung (max. 5 MB). Keine automatische Datenübernahme oder Veröffentlichung.

## Integritätsstand – Konflikte und vorhandene Zusatzfelder

- Bei gleichzeitig geänderten Aufträgen zeigt die Staging-Bearbeitung die abweichenden Felder aus den **eigenen, ungespeicherten Eingaben** und dem **aktuellen Serverstand** nebeneinander. Der Benutzer kann die aktuelle Serverversion nur durch einen separaten, bestätigten Schritt übernehmen. Es gibt **keinen automatischen Merge und keinen stillen Retry**.
- Bei einem normalen `PUT` bleiben bislang gespeicherte Zusatzfelder, die der aktuelle Editor nicht kennt (z. B. ältere Datenreferenzen), erhalten. Unbekannte, vom Client neu eingeschleuste Felder werden hingegen nicht ungeprüft übernommen.
- Regressionstests für beide Anforderungen befinden sich in `test/staging.test.mjs`. Diese Tests werden durch den GitHub-Actions-Workflow ausgeführt; ein aktueller erfolgreicher Workflow-Lauf wurde hier noch nicht bestätigt.

## Zusätzliche Schutzprüfungen bei Terminwechseln

- Ein normaler Formular-Edit mit verändertem Termin setzt die Auftragsposition ans Ende der Ziel-Tagesliste. Bisherige Zusatzfelder bleiben erhalten. Das gilt unabhängig von der separaten `/move`-Funktion.
- Der Abruf zentraler Aufträge prüft einen zusätzlichen Datensatz (`LIMIT 5001`). Bei mehr als 5.000 Aufträgen wird ein Fehler gemeldet statt einer scheinbar vollständigen, aber abgeschnittenen Liste. Vor realem Betrieb mit dieser Größenordnung sind Pagination und ein angepasster Datenladeprozess erforderlich.
- Beide Fälle sind als Regressionstests in `test/staging.test.mjs` ergänzt. Die laufende Version 1.12.1 und der Cloudflare-Produktivworker wurden nicht verändert.

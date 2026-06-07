import type { ReactNode } from 'react'
import { Panel } from '../../components/ui/Panel'
import printPilotLogo from '../../assets/logo/printpilot-logo-transparent.png'
import { StatusPill } from '../../components/ui/StatusPill'

const productRows = [
  ['Auflage', '3.000 Stück'],
  ['Format (Endformat)', '210 × 99 mm'],
  ['Seiten', '2-seitig (Vorder- & Rückseite)'],
  ['Farbigkeit', '4/4-farbig (CMYK)'],
  ['Papier', 'Bilderdruck matt 135 g'],
  ['Rohformat', 'SRA3'],
  ['Nutzen', '8 Nutzen'],
  ['Beschnitt', '3 mm'],
  ['Ausschuss', 'ca. 50 Bogen'],
  ['Gewicht gesamt', 'ca. 48,6 kg'],
]

const printRows = [
  ['Maschine', 'Xerox® Iridesse 1'],
  ['Druckverfahren', 'Digitaldruck'],
  ['Duplex', 'Ja (Längswende)'],
  ['Sonderfarben', 'Keine'],
  ['Farbmodus', 'CMYK'],
  ['Profil', 'Coated FOGRA39'],
  ['Auflösung', '2400 × 2400 dpi'],
  ['Klicks (Schätz.)', '6.100'],
  ['Papierbedarf', '425 Bogen SRA3'],
  ['Druckzeit (Schätz.)', '00:35 Std.'],
  ['Operator', 'Noch nicht zugewiesen'],
]

const timelineRows = [
  ['green', 'Auftrag erfasst', '30.05.2026', '10:15'],
  ['green', 'Datenprüfung', '30.05.2026', '11:30'],
  ['green', 'Kundenfreigabe', '30.05.2026', '14:20'],
  ['orange', 'Produktionsstart', '02.06.2026', ''],
  ['gray', 'Produktionsende', '02.06.2026', ''],
  ['gray', 'Weiterverarbeitung', '02.06.2026', ''],
  ['gray', 'Versand / Abholung', '03.06.2026', ''],
]

const files = [
  ['PDF', 'flyer_druck.pdf', '30.05.2026', '10:10', '8,2 MB'],
  ['PDF', 'flyer_freigabe.pdf', '30.05.2026', '14:20', '1,3 MB'],
  ['JPG', 'flyer_ansicht.jpg', '30.05.2026', '10:10', '2,1 MB'],
  ['PDF', 'nutzenplan.pdf', '30.05.2026', '10:12', '0,6 MB'],
]

function DataRows({ rows }: { rows: string[][] }) {
  return (
    <div className="pp-data-rows">
      {rows.map(([label, value]) => (
        <div className="pp-data-row" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  )
}

function CheckItem({ checked, label }: { checked?: boolean; label: string }) {
  return (
    <label className="pp-check-item">
      <span className={checked ? 'is-checked' : ''}>{checked ? '✓' : ''}</span>
      {label}
    </label>
  )
}

function TopInfoCard({ icon, label, title, children }: { icon: string; label: string; title: string; children: ReactNode }) {
  return (
    <article className="pp-top-info-card">
      <span className="pp-top-info-card__icon">{icon}</span>
      <div>
        <div className="pp-eyebrow">{label}</div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </article>
  )
}

export function OrderPocketPage() {
  return (
    <div className="pp-order-pocket">
      <header className="pp-master-header">
        <div className="pp-header-brand">
          <img className="pp-brand-logo" src={printPilotLogo} alt="PrintPilot" />
        </div>

        <div className="pp-header-title-shape">
          <h1>AUFTRAGSTASCHE</h1>
          <p>Produktionsauftrag</p>
        </div>

        <strong className="pp-header-order">PP-2026-00481</strong>

        <div className="pp-header-qr">
          <div className="pp-qr-code" aria-label="QR-Code"></div>
          <span>QR-Code scannen<br />für Auftrag in<br />PrintPilot öffnen</span>
        </div>
      </header>

      <section className="pp-top-info-panel">
        <TopInfoCard icon="▦" label="Kunde" title="Muster GmbH">
          Industriestraße 12<br />69151 Neckargemünd<br /><a>Kundendetails anzeigen →</a>
        </TopInfoCard>
        <TopInfoCard icon="●" label="Ansprechpartner" title="Max Mustermann">
          06222 / 123456<br />max@muster.de
        </TopInfoCard>
        <TopInfoCard icon="▣" label="Auftragsdatum" title="30.05.2026">
          &nbsp;
        </TopInfoCard>
        <TopInfoCard icon="▣" label="Liefertermin" title="03.06.2026">
          KW 23 / Mittwoch
        </TopInfoCard>
        <article className="pp-status-overview">
          <div className="pp-eyebrow">Status Übersicht</div>
          <div className="pp-status-flow">
            <StatusPill tone="green">Daten geprüft</StatusPill><b>›</b>
            <StatusPill tone="green">Freigabe erteilt</StatusPill><b>›</b>
            <StatusPill tone="orange">Produktion</StatusPill><b>›</b>
            <StatusPill>Weiterverarbeitung</StatusPill><b>›</b>
            <StatusPill>Versand</StatusPill>
          </div>
        </article>
      </section>

      <div className="pp-pocket-grid">
        <Panel title="Produkt" icon="▤" className="pp-product-panel">
          <h3>Flyer DIN Lang</h3>
          <div className="pp-product-content">
            <div className="pp-flyer-stack" aria-label="Produktvorschau">
              <div className="pp-flyer pp-flyer--back"></div>
              <div className="pp-flyer pp-flyer--front">
                <span>Gesund<br />Genießen</span>
                <i></i>
              </div>
            </div>
            <DataRows rows={productRows} />
          </div>
        </Panel>

        <Panel title="Druckdaten" icon="▣">
          <DataRows rows={printRows} />
        </Panel>

        <Panel title="Termine" icon="▦">
          <div className="pp-timeline">
            {timelineRows.map(([tone, label, date, time]) => (
              <div className="pp-timeline-row" key={label}>
                <span className={`pp-dot pp-dot--${tone}`}></span>
                <b>{label}</b>
                <strong>{date}</strong>
                <em>{time}</em>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Produktions-Checkliste" icon="▣" className="pp-checklist-panel">
          <h4>Druck</h4>
          <CheckItem checked label="Datei geprüft" />
          <CheckItem checked label="Preflight OK" />
          <CheckItem checked label="Farben geprüft" />
          <CheckItem label="Ausschießung geprüft" />
          <CheckItem label="Papier eingelegt" />
          <CheckItem label="Testdruck OK" />
          <CheckItem label="Druck fertig" />
          <hr />
          <h4>Weiterverarbeitung</h4>
          <CheckItem label="Schneiden" />
          <CheckItem label="Falzen" />
          <CheckItem label="Rillen" />
          <CheckItem label="Heften" />
          <CheckItem label="Verpacken" />
          <hr />
          <h4>Versand</h4>
          <CheckItem label="Auflage geprüft" />
          <CheckItem label="Verpackung OK" />
          <CheckItem label="Versendet / Abgeholt" />
          <hr />
          <div className="pp-signature"><b>Geprüft von / am</b><span>Unterschrift</span></div>
        </Panel>

        <Panel title="Nutzenplan" icon="▦">
          <p className="pp-panel-note">8 Nutzen auf SRA3</p>
          <div className="pp-imposition-grid">
            {Array.from({ length: 8 }, (_, index) => <span key={index}>{index + 1}</span>)}
          </div>
          <div className="pp-plan-meta"><span>Endformat: 210 × 99 mm</span><i></i><span>Beschnitt: 3 mm</span></div>
        </Panel>

        <Panel title="Vorschau" icon="●">
          <div className="pp-preview-sheet"><span></span><strong></strong></div>
          <p className="pp-file-name">Dateiname: flyer_druck.pdf</p>
        </Panel>

        <Panel title="Weiterverarbeitung" icon="⚙">
          <div className="pp-finishing-list">
            {['Schneiden', 'Falzen', 'Rillen', 'Heften', 'Verpacken'].map((item, index) => (
              <div key={item}><b>{item}</b><StatusPill tone={index === 0 || index === 4 ? 'orange' : 'gray'}>{index === 0 || index === 4 ? 'Geplant' : 'Nicht notwendig'}</StatusPill></div>
            ))}
          </div>
        </Panel>

        <Panel title="Dateien" icon="⌁">
          <div className="pp-files-list">
            {files.map(([type, name, date, time, size]) => (
              <div key={name}>
                <span>{type}</span><b>{name}</b><em>{date}</em><em>{time}</em><strong>{size}</strong>
              </div>
            ))}
          </div>
          <a className="pp-card-link">Alle Dateien im Auftrag anzeigen →</a>
        </Panel>

        <Panel title="Notizen" icon="▤">
          <p className="pp-note-text">Kunde wünscht Lieferung bis spätestens Mittwoch.</p>
          <p className="pp-note-text">Kartons mit Aufkleber „Messeaktion Juni“ kennzeichnen.</p>
          <p className="pp-note-text">Rückfragen an Max Mustermann.</p>
          <small>Letzte Notiz: 30.05.2026 14:22 von Admin</small>
        </Panel>

        <Panel title="Maschine" icon="▣">
          <div className="pp-machine-card">
            <div className="pp-machine-visual"></div>
            <div><b>Xerox® Iridesse 1</b><StatusPill tone="green">Verfügbar</StatusPill><p>Standort: Halle 1</p><small>Letzter Service: 12.05.2026</small></div>
          </div>
          <a className="pp-card-link">Maschinendetails anzeigen →</a>
        </Panel>

        <Panel title="Kommentare / Verlauf" icon="○">
          <div className="pp-history-list">
            <div><span>30.05.2026&nbsp;&nbsp;14:20</span><b>Kundenfreigabe erteilt</b><em>Max M.</em></div>
            <div><span>30.05.2026&nbsp;&nbsp;11:30</span><b>Datenprüfung abgeschlossen</b><em>Sarah K.</em></div>
            <div><span>30.05.2026&nbsp;&nbsp;10:15</span><b>Auftrag angelegt</b><em>Admin</em></div>
          </div>
          <a className="pp-card-link">Gesamten Verlauf anzeigen →</a>
        </Panel>
      </div>
    </div>
  )
}

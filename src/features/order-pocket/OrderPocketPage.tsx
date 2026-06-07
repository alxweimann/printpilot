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

type PocketIconName =
  | 'customer'
  | 'contact'
  | 'date'
  | 'delivery'
  | 'product'
  | 'print-data'
  | 'timeline'
  | 'checklist'
  | 'imposition'
  | 'preview'
  | 'finishing'
  | 'files'
  | 'notes'
  | 'machine'
  | 'history'

function PocketIcon({ name }: { name: PocketIconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
    className: 'pp-pocket-icon',
  }

  switch (name) {
    case 'customer':
      return <svg {...common}><path d="M6 18.5V7.2L12 4l6 3.2v11.3" /><path d="M9 18.5v-5h6v5" /><path d="M9 9h.01M12 9h.01M15 9h.01" /></svg>
    case 'contact':
      return <svg {...common}><path d="M12 12.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z" /><path d="M5.5 19.2c.9-3.1 3.2-4.7 6.5-4.7s5.6 1.6 6.5 4.7" /></svg>
    case 'date':
      return <svg {...common}><path d="M6.5 5.5h11A1.5 1.5 0 0 1 19 7v10.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5V7a1.5 1.5 0 0 1 1.5-1.5Z" /><path d="M8 4v3M16 4v3M5 9h14" /><path d="M8.5 12.5h3v3h-3z" /></svg>
    case 'delivery':
      return <svg {...common}><path d="M4.8 7h10.7v9.5H4.8z" /><path d="M15.5 10h2.6l1.1 2v4.5h-3.7" /><path d="M7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM16.8 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /></svg>
    case 'product':
      return <svg {...common}><path d="M6.2 5.2h8.2l3.4 3.4v10.2H6.2z" /><path d="M14.4 5.2v3.4h3.4" /><path d="M8.8 12.2h6.4M8.8 15h4.9" /></svg>
    case 'print-data':
      return <svg {...common}><path d="M7 8V4.8h10V8" /><path d="M6.2 16.2H5a1.4 1.4 0 0 1-1.4-1.4v-4.2A1.6 1.6 0 0 1 5.2 9h13.6a1.6 1.6 0 0 1 1.6 1.6v4.2a1.4 1.4 0 0 1-1.4 1.4h-1.2" /><path d="M7.3 13.8h9.4v5.4H7.3z" /><path d="M17.2 11.6h.01" /></svg>
    case 'timeline':
      return <svg {...common}><path d="M7 5.5h11" /><path d="M7 12h11" /><path d="M7 18.5h11" /><path d="M4 5.5h.01M4 12h.01M4 18.5h.01" /></svg>
    case 'checklist':
      return <svg {...common}><path d="M6.5 5h11A1.5 1.5 0 0 1 19 6.5v11A1.5 1.5 0 0 1 17.5 19h-11A1.5 1.5 0 0 1 5 17.5v-11A1.5 1.5 0 0 1 6.5 5Z" /><path d="m8.5 12 2 2 5-5" /></svg>
    case 'imposition':
      return <svg {...common}><path d="M4.8 6h14.4v12H4.8z" /><path d="M9.6 6v12M14.4 6v12M4.8 12h14.4" /></svg>
    case 'preview':
      return <svg {...common}><path d="M4 12s2.7-5 8-5 8 5 8 5-2.7 5-8 5-8-5-8-5Z" /><path d="M12 14.7a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z" /></svg>
    case 'finishing':
      return <svg {...common}><path d="M5 6.5h14" /><path d="M7 6.5v10.2A1.3 1.3 0 0 0 8.3 18h7.4a1.3 1.3 0 0 0 1.3-1.3V6.5" /><path d="M9.2 10.2h5.6M9.2 13h5.6" /></svg>
    case 'files':
      return <svg {...common}><path d="M6 4.8h8l4 4v10.4H6z" /><path d="M14 4.8v4h4" /><path d="M8.8 12.2h6.4M8.8 15h5" /></svg>
    case 'notes':
      return <svg {...common}><path d="M6.2 5h11.6v14H6.2z" /><path d="M9 8.5h6M9 12h6M9 15.5h3.8" /></svg>
    case 'machine':
      return <svg {...common}><path d="M5 8h14v9H5z" /><path d="M8 5h8v3H8z" /><path d="M8 17v2M16 17v2" /><path d="M8.5 12h7" /></svg>
    case 'history':
      return <svg {...common}><path d="M6.2 7.7A7.5 7.5 0 1 1 5 12" /><path d="M6.2 4.8v2.9H9" /><path d="M12 8v4.2l3 1.8" /></svg>
    default:
      return null
  }
}

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

function TopInfoCard({ icon, label, title, children }: { icon: ReactNode; label: string; title: string; children: ReactNode }) {
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
        <TopInfoCard icon={<PocketIcon name="customer" />} label="Kunde" title="Muster GmbH">
          Industriestraße 12<br />69151 Neckargemünd<br /><a>Kundendetails anzeigen →</a>
        </TopInfoCard>
        <TopInfoCard icon={<PocketIcon name="contact" />} label="Ansprechpartner" title="Max Mustermann">
          06222 / 123456<br />max@muster.de
        </TopInfoCard>
        <TopInfoCard icon={<PocketIcon name="date" />} label="Auftragsdatum" title="30.05.2026">
          &nbsp;
        </TopInfoCard>
        <TopInfoCard icon={<PocketIcon name="delivery" />} label="Liefertermin" title="03.06.2026">
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
        <Panel title="Produkt" icon={<PocketIcon name="product" />} className="pp-product-panel">
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

        <Panel title="Druckdaten" icon={<PocketIcon name="print-data" />}>
          <DataRows rows={printRows} />
        </Panel>

        <Panel title="Termine" icon={<PocketIcon name="timeline" />}>
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

        <Panel title="Produktions-Checkliste" icon={<PocketIcon name="checklist" />} className="pp-checklist-panel">
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

        <Panel title="Nutzenplan" icon={<PocketIcon name="imposition" />}>
          <p className="pp-panel-note">8 Nutzen auf SRA3</p>
          <div className="pp-imposition-grid">
            {Array.from({ length: 8 }, (_, index) => <span key={index}>{index + 1}</span>)}
          </div>
          <div className="pp-plan-meta"><span>Endformat: 210 × 99 mm</span><i></i><span>Beschnitt: 3 mm</span></div>
        </Panel>

        <Panel title="Vorschau" icon={<PocketIcon name="preview" />}>
          <div className="pp-preview-sheet"><span></span><strong></strong></div>
          <p className="pp-file-name">Dateiname: flyer_druck.pdf</p>
        </Panel>

        <Panel title="Weiterverarbeitung" icon={<PocketIcon name="finishing" />}>
          <div className="pp-finishing-list">
            {['Schneiden', 'Falzen', 'Rillen', 'Heften', 'Verpacken'].map((item, index) => (
              <div key={item}><b>{item}</b><StatusPill tone={index === 0 || index === 4 ? 'orange' : 'gray'}>{index === 0 || index === 4 ? 'Geplant' : 'Nicht notwendig'}</StatusPill></div>
            ))}
          </div>
        </Panel>

        <Panel title="Dateien" icon={<PocketIcon name="files" />}>
          <div className="pp-files-list">
            {files.map(([type, name, date, time, size]) => (
              <div key={name}>
                <span>{type}</span><b>{name}</b><em>{date}</em><em>{time}</em><strong>{size}</strong>
              </div>
            ))}
          </div>
          <a className="pp-card-link">Alle Dateien im Auftrag anzeigen →</a>
        </Panel>

        <Panel title="Notizen" icon={<PocketIcon name="notes" />}>
          <p className="pp-note-text">Kunde wünscht Lieferung bis spätestens Mittwoch.</p>
          <p className="pp-note-text">Kartons mit Aufkleber „Messeaktion Juni“ kennzeichnen.</p>
          <p className="pp-note-text">Rückfragen an Max Mustermann.</p>
          <small>Letzte Notiz: 30.05.2026 14:22 von Admin</small>
        </Panel>

        <Panel title="Maschine" icon={<PocketIcon name="machine" />}>
          <div className="pp-machine-card">
            <div className="pp-machine-visual"></div>
            <div><b>Xerox® Iridesse 1</b><StatusPill tone="green">Verfügbar</StatusPill><p>Standort: Halle 1</p><small>Letzter Service: 12.05.2026</small></div>
          </div>
          <a className="pp-card-link">Maschinendetails anzeigen →</a>
        </Panel>

        <Panel title="Kommentare / Verlauf" icon={<PocketIcon name="history" />}>
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

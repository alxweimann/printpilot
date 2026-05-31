import { AppCard } from "../../components/ui/AppCard"
import { AppMetricCard } from "../../components/ui/AppMetricCard"
import { AppPageHeader } from "../../components/ui/AppPageHeader"
import { AppStatusBadge } from "../../components/ui/AppStatusBadge"

const orderCards = [
  {
    title: "Broschüre A4",
    customer: "Muster GmbH",
    status: "Produktion läuft",
    tone: "warning" as const,
    machine: "Xerox Iridesse 1",
    due: "Heute 15:30",
    steps: ["Druck", "Schneiden", "Heften"],
  },
  {
    title: "Flyer DIN Lang",
    customer: "ABC Fitness",
    status: "Freigabe erteilt",
    tone: "success" as const,
    machine: "Xerox Iridesse 2",
    due: "Morgen Versand",
    steps: ["Druck", "Schneiden"],
  },
  {
    title: "Schaufensterfolie",
    customer: "Kanzlei Berg",
    status: "Handlungsbedarf",
    tone: "danger" as const,
    machine: "Roland VG3-540",
    due: "Daten fehlen",
    steps: ["Proof", "Druck", "Laminat"],
  },
]

export function DashboardPage() {
  return (
    <div id="dashboard" className="space-y-8">
      <AppPageHeader
        eyebrow="Produktionszentrale"
        title="PrintPilot Next UI"
        description="Das neue Design startet bewusst mit großen Karten, klaren Statussignalen und einer Oberfläche, die wie das Auftragstaschen-Mockup wirkt."
        actions={
          <>
            <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-950/15">Neuer Auftrag</button>
            <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700">Auftragstasche</button>
          </>
        }
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AppMetricCard label="Offene Aufträge" value="18" helper="+4 heute" badge="Live" tone="info" />
        <AppMetricCard label="Produktion" value="7" helper="3 Maschinen" badge="Aktiv" tone="warning" />
        <AppMetricCard label="Versand heute" value="5" helper="bis 16:00" badge="Plan" tone="success" />
        <AppMetricCard label="Handlungsbedarf" value="2" helper="Daten/Freigabe" badge="Prüfen" tone="danger" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AppCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Auftragskarten</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.05em]">Heute im Fokus</h2>
            </div>
            <AppStatusBadge label="Mockup-Layout" tone="dark" dot={false} />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {orderCards.map((order) => (
              <article key={order.title} className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-5">
                <div className="h-32 rounded-[22px] border border-slate-200 bg-white p-4 shadow-inner">
                  <div className="h-full rounded-2xl bg-gradient-to-br from-cyan-100 via-white to-amber-100 p-4">
                    <div className="h-4 w-20 rounded-full bg-slate-950/80" />
                    <div className="mt-4 h-3 w-32 rounded-full bg-slate-400/70" />
                    <div className="mt-2 h-3 w-24 rounded-full bg-slate-300" />
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black tracking-[-0.04em]">{order.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{order.customer}</p>
                  </div>
                  <AppStatusBadge label={order.status} tone={order.tone} />
                </div>
                <div className="mt-5 space-y-2 text-sm font-semibold text-slate-600">
                  <p>🖨 {order.machine}</p>
                  <p>📅 {order.due}</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {order.steps.map((step) => (
                    <span key={step} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-sm">{step}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </AppCard>

        <AppCard>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Auftragstasche</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.05em]">Nächster Meilenstein</h2>
          <div className="mt-6 rounded-[26px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-950">AU-2026-001</p>
                <p className="text-sm font-semibold text-slate-500">Digitale Auftragstasche</p>
              </div>
              <AppStatusBadge label="Konzept" tone="info" />
            </div>
            <div className="mt-6 space-y-3 text-sm font-semibold text-slate-600">
              <p>✓ Produktvorschau prominent</p>
              <p>✓ Status zuerst sichtbar</p>
              <p>✓ Maschine, Material, Termine</p>
              <p>✓ Weiterverarbeitung als Checkliste</p>
              <p>✓ Später PDF-Ausgabe mit QR-Code</p>
            </div>
          </div>
        </AppCard>
      </section>
    </div>
  )
}

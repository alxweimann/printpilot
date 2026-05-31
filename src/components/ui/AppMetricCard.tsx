import type { StatusTone } from "../../styles/design-tokens"
import { AppStatusBadge } from "./AppStatusBadge"

type AppMetricCardProps = {
  label: string
  value: string
  helper: string
  badge: string
  tone: StatusTone
}

export function AppMetricCard({ label, value, helper, badge, tone }: AppMetricCardProps) {
  return (
    <article className="group rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.11)]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{label}</p>
        <AppStatusBadge label={badge} tone={tone} dot={false} />
      </div>
      <div className="mt-7 flex items-end justify-between gap-4">
        <strong className="text-5xl font-black tracking-[-0.08em] text-slate-950">{value}</strong>
        <span className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500">{helper}</span>
      </div>
    </article>
  )
}

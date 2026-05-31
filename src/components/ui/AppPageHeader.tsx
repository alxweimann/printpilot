import type { ReactNode } from "react"

type AppPageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}

export function AppPageHeader({ eyebrow, title, description, actions }: AppPageHeaderProps) {
  return (
    <header className="rounded-[32px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-600">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-slate-950 md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  )
}

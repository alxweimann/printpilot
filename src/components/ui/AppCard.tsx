import type { ReactNode } from "react"

type AppCardProps = {
  children: ReactNode
  className?: string
}

export function AppCard({ children, className = "" }: AppCardProps) {
  return (
    <section className={`rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ${className}`}>
      {children}
    </section>
  )
}

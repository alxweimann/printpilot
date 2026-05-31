import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  icon?: string
  children: ReactNode
  className?: string
}

export function Panel({ title, icon, children, className = '' }: PanelProps) {
  return (
    <section className={`pp-panel ${className}`}>
      <header className="pp-panel__header">
        {icon ? <span className="pp-panel__icon">{icon}</span> : null}
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  )
}

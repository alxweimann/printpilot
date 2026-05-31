type StatusPillProps = {
  children: string
  tone?: 'green' | 'orange' | 'gray' | 'blue'
}

export function StatusPill({ children, tone = 'gray' }: StatusPillProps) {
  return <span className={`pp-status-pill pp-status-pill--${tone}`}>{children}</span>
}

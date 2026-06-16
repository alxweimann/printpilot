import type { ReactNode } from 'react'

export type PrintPilotNavTarget = 'orders' | 'calculation'

const bottomNav: Array<[string, string, PrintPilotNavTarget | undefined]> = [
  ['▦', 'Dashboard', undefined],
  ['▤', 'Aufträge', 'orders'],
  ['◫', 'Kalkulation', 'calculation'],
  ['▣', 'Kalender', undefined],
  ['▣', 'Maschinen', undefined],
  ['⌘', 'Produktion', undefined],
  ['□', 'Lager', undefined],
  ['♙', 'Kunden', undefined],
]

type AppShellProps = {
  children: ReactNode
  activeTarget?: PrintPilotNavTarget
  onNavigate?: (target: PrintPilotNavTarget) => void
}

export function AppShell({ children, activeTarget = 'orders', onNavigate }: AppShellProps) {
  return (
    <div className="pp-app pp-app--console">
      <main className="pp-main pp-main--console">
        {children}
        <nav className="pp-bottom-nav" aria-label="Schnellnavigation">
          {bottomNav.map(([icon, label, target]) => (
            <button
              key={label}
              type="button"
              className={target === activeTarget ? 'is-active' : undefined}
              onClick={target && onNavigate ? () => onNavigate(target) : undefined}
              disabled={!target}
              aria-current={target === activeTarget ? 'page' : undefined}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </main>
    </div>
  )
}

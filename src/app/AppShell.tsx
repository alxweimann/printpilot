import type { ReactNode } from 'react'

const bottomNav = [
  ['▦', 'Dashboard'],
  ['▤', 'Aufträge'],
  ['▣', 'Kalender'],
  ['▣', 'Maschinen'],
  ['⌘', 'Produktion'],
  ['□', 'Lager'],
  ['♙', 'Kunden'],
]

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="pp-app pp-app--console">
      <main className="pp-main pp-main--console">
        {children}
        <nav className="pp-bottom-nav" aria-label="Schnellnavigation">
          {bottomNav.map(([icon, label]) => (
            <button key={label}>
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </main>
    </div>
  )
}

import { useState } from 'react'
import { AppShell } from './app/AppShell'
import { OrderPocketPage } from './features/order-pocket/OrderPocketPage'
import { OrdersOverviewPage } from './features/orders/OrdersOverviewPage'

type PrintPilotView = 'orders' | 'order-pocket'

export default function App() {
  const [activeView, setActiveView] = useState<PrintPilotView>('orders')

  return (
    <AppShell>
      {activeView === 'orders' ? (
        <OrdersOverviewPage onOpenOrderPocket={() => setActiveView('order-pocket')} />
      ) : (
        <div className="pp-pocket-route-shell">
          <div className="pp-pocket-route-toolbar" aria-label="Auftragstaschen-Navigation">
            <button type="button" onClick={() => setActiveView('orders')}>← Zur Aufträge-Übersicht</button>
            <span>Auftragstasche · PP-2026-00481</span>
          </div>
          <OrderPocketPage />
        </div>
      )}
    </AppShell>
  )
}

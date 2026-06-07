import { useState } from 'react'
import { AppShell } from './app/AppShell'
import { OrderPocketPage } from './features/order-pocket/OrderPocketPage'
import { OrdersOverviewPage } from './features/orders/OrdersOverviewPage'
import { getFallbackOrder } from './features/orders/order-data'
import type { PrintPilotOrder } from './features/orders/order-data'

type PrintPilotView = 'orders' | 'order-pocket'

export default function App() {
  const [activeView, setActiveView] = useState<PrintPilotView>('orders')
  const [selectedOrder, setSelectedOrder] = useState<PrintPilotOrder>(getFallbackOrder())

  const openOrderPocket = (order: PrintPilotOrder) => {
    setSelectedOrder(order)
    setActiveView('order-pocket')
  }

  return (
    <AppShell>
      {activeView === 'orders' ? (
        <OrdersOverviewPage onOpenOrderPocket={openOrderPocket} />
      ) : (
        <div className="pp-pocket-route-shell">
          <div className="pp-pocket-route-toolbar" aria-label="Auftragstaschen-Navigation">
            <button type="button" onClick={() => setActiveView('orders')}>← Zur Aufträge-Übersicht</button>
            <span>Detailansicht · Auftragstasche {selectedOrder.id}</span>
          </div>
          <OrderPocketPage order={selectedOrder} />
        </div>
      )}
    </AppShell>
  )
}

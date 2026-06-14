import { useMemo, useState } from 'react'
import { AppShell } from './app/AppShell'
import { OrderPocketPage } from './features/order-pocket/OrderPocketPage'
import { OrdersOverviewPage } from './features/orders/OrdersOverviewPage'
import { getFallbackOrder, orderRows } from './features/orders/order-data'
import type { PrintPilotOrder } from './features/orders/order-data'

type PrintPilotView = 'orders' | 'order-pocket'

function cloneOrder(order: PrintPilotOrder): PrintPilotOrder {
  return {
    ...order,
    priority: { ...order.priority },
    production: { ...order.production },
    approval: { ...order.approval },
    data: { ...order.data },
    bleedStatus: { ...order.bleedStatus },
    preview: { ...order.preview },
    customerAddress: [...order.customerAddress],
    finishing: order.finishing.map((step) => ({
      ...step,
      status: { ...step.status },
    })),
    checklist: order.checklist.map((section) => ({
      ...section,
      items: section.items.map((item) => ({ ...item })),
    })),
    history: order.history.map((entry) => ({ ...entry })),
  }
}

function createInitialOrders() {
  return orderRows.map(cloneOrder)
}

export default function App() {
  const [activeView, setActiveView] = useState<PrintPilotView>('orders')
  const [orders, setOrders] = useState<PrintPilotOrder[]>(createInitialOrders)
  const [selectedOrderId, setSelectedOrderId] = useState<string>(getFallbackOrder().id)

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? orders[0] ?? getFallbackOrder(),
    [orders, selectedOrderId],
  )

  const openOrderPocket = (order: PrintPilotOrder) => {
    setSelectedOrderId(order.id)
    setActiveView('order-pocket')
  }

  const updateSelectedOrder = (updatedOrder: PrintPilotOrder) => {
    const nextOrder = cloneOrder(updatedOrder)
    setSelectedOrderId(nextOrder.id)
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === nextOrder.id ? nextOrder : order,
      ),
    )
  }

  const resetSelectedOrder = () => {
    const baseOrder =
      orderRows.find((order) => order.id === selectedOrderId) ?? getFallbackOrder()
    const resetOrder = cloneOrder(baseOrder)

    setSelectedOrderId(resetOrder.id)
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === resetOrder.id ? resetOrder : order,
      ),
    )
  }

  return (
    <AppShell>
      {activeView === 'orders' ? (
        <OrdersOverviewPage orders={orders} onOpenOrderPocket={openOrderPocket} />
      ) : (
        <div className="pp-pocket-route-shell">
          <div className="pp-pocket-route-toolbar" aria-label="Auftragstaschen-Navigation">
            <button type="button" onClick={() => setActiveView('orders')}>← Zur Aufträge-Übersicht</button>
            <span>Detailansicht · Auftragstasche {selectedOrder.id}</span>
          </div>
          <OrderPocketPage
            order={selectedOrder}
            onOrderChange={updateSelectedOrder}
            onOrderReset={resetSelectedOrder}
          />
        </div>
      )}
    </AppShell>
  )
}

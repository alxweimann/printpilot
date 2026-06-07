import { AppShell } from './app/AppShell'
import { OrdersOverviewPage } from './features/orders/OrdersOverviewPage'

export default function App() {
  return (
    <AppShell>
      <OrdersOverviewPage />
    </AppShell>
  )
}

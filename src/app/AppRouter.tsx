import { CalculationPage } from "../pages/CalculationPage";
import { CustomersPage } from "../pages/CustomersPage";
import { DashboardPage } from "../pages/DashboardPage";
import { DeliveryNotesPage } from "../pages/DeliveryNotesPage";
import { InvoicesPage } from "../pages/InvoicesPage";
import { MaterialPage } from "../pages/MaterialPage";
import { OrdersPage } from "../pages/OrdersPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { QuotesPage } from "../pages/QuotesPage";
import { RemindersPage } from "../pages/RemindersPage";
import { getModuleConfig } from "./moduleConfig";

type AppRouterProps = {
  activePage: string;
};

export function AppRouter({ activePage }: AppRouterProps) {
  switch (activePage) {
    case "dashboard":
      return <DashboardPage />;

    case "calculation":
      return <CalculationPage />;

    case "quotes":
      return <QuotesPage />;

    case "orders":
      return <OrdersPage />;

    case "invoices":
      return <InvoicesPage />;

    case "delivery-notes":
      return <DeliveryNotesPage />;

    case "reminders":
      return <RemindersPage />;

    case "customers":
      return <CustomersPage />;

    case "material":
      return <MaterialPage />;

    default: {
      const module = getModuleConfig(activePage);

      return (
        <PlaceholderPage
          title={module.title}
          description={module.description}
          actionLabel={module.actionLabel}
          tabs={module.tabs}
        />
      );
    }
  }
}

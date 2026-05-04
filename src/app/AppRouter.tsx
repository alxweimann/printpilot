import { CalculationPage } from "../pages/CalculationPage";
import { CustomersPage } from "../pages/CustomersPage";
import { DashboardPage } from "../pages/DashboardPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
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

    case "customers":
      return <CustomersPage />;

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

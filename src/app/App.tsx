import { useState } from "react";
import { AppShell } from "../layout/AppShell";
import { CalculationPage } from "../pages/CalculationPage";
import { CustomersPage } from "../pages/CustomersPage";
import { DashboardPage } from "../pages/DashboardPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";

export function App() {
  const [activePage, setActivePage] = useState("dashboard");

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;

      case "calculation":
        return <CalculationPage />;

      case "customers":
        return <CustomersPage />;

      case "quotes":
        return (
          <PlaceholderPage
            title="Angebote"
            description="Angebotsübersicht und Angebotsbearbeitung werden später aufgebaut."
          />
        );

      case "orders":
        return (
          <PlaceholderPage
            title="Aufträge"
            description="Auftragsverwaltung wird später aus Angeboten und Kalkulationen entstehen."
          />
        );

      case "invoices":
        return (
          <PlaceholderPage
            title="Rechnungen"
            description="Rechnungen werden später sauber mit Zahlstatus und Folgeprozessen aufgebaut."
          />
        );

      case "delivery-notes":
        return (
          <PlaceholderPage
            title="Lieferscheine"
            description="Lieferscheine werden später als eigener Verkaufsprozess ergänzt."
          />
        );

      case "reminders":
        return (
          <PlaceholderPage
            title="Mahnungen"
            description="Mahnungen werden später erst nach sauberer Rechnungslogik umgesetzt."
          />
        );

      case "material":
        return (
          <PlaceholderPage
            title="Material"
            description="Materialstammdaten für Papier, Formate, Preise und Lager werden später aufgebaut."
          />
        );

      case "machines":
        return (
          <PlaceholderPage
            title="Maschinen"
            description="Maschinenstammdaten werden später für Druckkosten und Produktionslogik genutzt."
          />
        );

      case "finishing":
        return (
          <PlaceholderPage
            title="Weiterverarbeitung"
            description="Schneiden, Falzen, Rillen, Heften und weitere Prozesse werden später ergänzt."
          />
        );

      case "services":
        return (
          <PlaceholderPage
            title="Leistungen"
            description="Freie Leistungen und Zuschläge werden später gepflegt."
          />
        );

      case "templates":
        return (
          <PlaceholderPage
            title="Vorlagen"
            description="Vorlagen für Produkte, Angebote und Dokumente werden später aufgebaut."
          />
        );

      case "settings":
        return (
          <PlaceholderPage
            title="Einstellungen"
            description="Globale Einstellungen für PrintPilot werden später ergänzt."
          />
        );

      default:
        return <DashboardPage />;
    }
  }

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </AppShell>
  );
}
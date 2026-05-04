import { useState } from "react";
import { AppShell } from "../layout/AppShell";
import { AppRouter } from "./AppRouter";
import { getModuleConfig } from "./moduleConfig";

export function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const activeModule = getModuleConfig(activePage);

  return (
    <AppShell
      activePage={activePage}
      accentColor={activeModule.accentColor}
      onNavigate={setActivePage}
    >
      <AppRouter activePage={activePage} onNavigate={setActivePage} />
    </AppShell>
  );
}

import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  children: ReactNode;
  activePage: string;
  onNavigate: (pageId: string) => void;
};

export function AppShell({ children, activePage, onNavigate }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <main className="app-main">
        <div className="app-workspace">{children}</div>
      </main>
    </div>
  );
}
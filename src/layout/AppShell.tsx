import type { CSSProperties, ReactNode } from "react";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  children: ReactNode;
  activePage: string;
  accentColor: string;
  onNavigate: (pageId: string) => void;
};

export function AppShell({
  children,
  activePage,
  accentColor,
  onNavigate,
}: AppShellProps) {
  return (
    <div
      className="app-shell"
      style={{ "--module-accent": accentColor } as CSSProperties}
    >
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <main className="app-main">
        <div className="app-workspace">{children}</div>
      </main>
    </div>
  );
}

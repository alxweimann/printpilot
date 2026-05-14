import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

import { navigationGroups, navigationItems } from "../app/navigation";
import { usePrintPilotStore } from "../store/PrintPilotStore";
import {
  formatPrintPilotDate,
  formatPrintPilotTime,
} from "../utils/dateFormat";

type SidebarProps = {
  activePage: string;
  onNavigate: (pageId: string) => void;
};

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { settings } = usePrintPilotStore();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const ledDate = useMemo(
    () => formatPrintPilotDate(now, settings.dateFormat),
    [now, settings.dateFormat],
  );

  const ledTime = useMemo(() => formatPrintPilotTime(now), [now]);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">PP</div>

        <div>
          <div className="sidebar-title">PrintPilot</div>
          <div className="sidebar-subtitle">Digitaldruck Software</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navigationGroups.map((group) => {
          const items = navigationItems.filter((item) => item.group === group.id);

          return (
            <div className="sidebar-group" key={group.id}>
              <div className="sidebar-group-title">{group.label}</div>

              <div className="sidebar-group-items">
                {items.map((item) => {
                  const isActive = item.id === activePage;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={isActive ? "sidebar-item active" : "sidebar-item"}
                      style={{ "--item-accent": item.accentColor } as CSSProperties}
                      onClick={() => onNavigate(item.id)}
                    >
                      <span className="sidebar-item-mark" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-led-clock" aria-label="Aktuelles Datum und Uhrzeit">
        <div className="sidebar-led-display">
          <div className="sidebar-led-line">{ledDate}</div>
          <div className="sidebar-led-line">{ledTime}</div>
        </div>
      </div>
    </aside>
  );
}

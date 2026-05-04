type PageTabsProps = {
  tabs: string[];
  activeTab: string;
  onTabChange?: (tab: string) => void;
};

export function PageTabs({ tabs, activeTab, onTabChange }: PageTabsProps) {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="page-tabs">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <button
            type="button"
            key={tab}
            className={isActive ? "page-tab active" : "page-tab"}
            onClick={() => onTabChange?.(tab)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

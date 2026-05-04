type PageTabsProps = {
  tabs: string[];
  activeTab: string;
  onChange?: (tab: string) => void;
};

export function PageTabs({ tabs, activeTab, onChange }: PageTabsProps) {
  return (
    <div className="page-tabs">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <button
            type="button"
            key={tab}
            className={isActive ? "page-tab active" : "page-tab"}
            onClick={() => onChange?.(tab)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

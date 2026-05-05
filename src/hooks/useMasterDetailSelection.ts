import { useMemo, useState } from "react";

type MasterDetailItem = {
  id: string;
};

type UseMasterDetailSelectionOptions<
  TTab extends string,
  TItem extends MasterDetailItem,
> = {
  rowsByTab: Record<TTab, TItem[]>;
  initialTab: TTab;
};

export function useMasterDetailSelection<
  TTab extends string,
  TItem extends MasterDetailItem,
>({ rowsByTab, initialTab }: UseMasterDetailSelectionOptions<TTab, TItem>) {
  const [activeTab, setActiveTabState] = useState<TTab>(initialTab);
  const [selectedId, setSelectedId] = useState(
    rowsByTab[initialTab][0]?.id ?? "",
  );

  const rows = rowsByTab[activeTab];

  const selectedItem = useMemo(() => {
    return rows.find((item) => item.id === selectedId) ?? rows[0];
  }, [rows, selectedId]);

  function setActiveTab(nextTab: TTab) {
    const nextRows = rowsByTab[nextTab];

    setActiveTabState(nextTab);
    setSelectedId(nextRows[0]?.id ?? "");
  }

  function selectItem(itemId: string) {
    setSelectedId(itemId);
  }

  return {
    activeTab,
    selectedId,
    rows,
    selectedItem,
    setActiveTab,
    selectItem,
  };
}

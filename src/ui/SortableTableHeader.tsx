import type { ReactNode } from "react";

import type { SortConfig } from "./useSortableTable";

type SortableTableHeaderProps<TKey extends string> = {
  sortKey: TKey;
  label: ReactNode;
  sortConfig: SortConfig<TKey>;
  onSort: (sortKey: TKey) => void;
};

export function SortableTableHeader<TKey extends string>({
  sortKey,
  label,
  sortConfig,
  onSort,
}: SortableTableHeaderProps<TKey>) {
  const isActive = sortConfig?.key === sortKey;
  const directionLabel = sortConfig?.direction === "asc" ? "aufsteigend" : "absteigend";
  const title = isActive
    ? `${label} ${directionLabel} sortiert`
    : `Nach ${label} sortieren`;

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      title={title}
      style={{
        alignItems: "center",
        background: "transparent",
        border: 0,
        color: "inherit",
        cursor: "pointer",
        display: "inline-flex",
        font: "inherit",
        gap: "0.35rem",
        letterSpacing: "inherit",
        padding: 0,
        textTransform: "inherit",
        whiteSpace: "nowrap",
      }}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        style={{ fontSize: "0.7rem", opacity: isActive ? 1 : 0.45 }}
      >
        {isActive ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );
}

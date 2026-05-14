import type { ReactNode } from "react";
import type { SortConfig, SortDirection } from "./useSortableTable";

type SortableTableHeaderProps<TSortKey extends string = string> = {
  label: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";

  /**
   * Standard API for OrdersPage and QuotesPage.
   */
  sortKey?: TSortKey;
  columnKey?: TSortKey;
  sortConfig?: SortConfig<TSortKey> | null;
  onSort?: (sortKey: TSortKey) => void;

  /**
   * Compatibility API for existing master-data pages.
   */
  active?: boolean;
  direction?: SortDirection;
  onClick?: () => void;
};

function getSortIndicator(direction: SortDirection | undefined) {
  if (direction === "asc") {
    return "↑";
  }

  if (direction === "desc") {
    return "↓";
  }

  return "↕";
}

export function SortableTableHeader<TSortKey extends string = string>({
  label,
  sortConfig = null,
  onSort,
  sortKey,
  columnKey,
  active,
  direction,
  onClick,
  className = "",
  align = "left",
}: SortableTableHeaderProps<TSortKey>) {
  const resolvedSortKey = sortKey ?? columnKey;

  const isActive =
    typeof active === "boolean"
      ? active
      : Boolean(sortConfig && resolvedSortKey && sortConfig.key === resolvedSortKey);

  const resolvedDirection =
    direction ?? (isActive && sortConfig ? sortConfig.direction : undefined);

  const indicator = getSortIndicator(isActive ? resolvedDirection : undefined);

  const alignClass =
    align === "right"
      ? "justify-end text-right"
      : align === "center"
        ? "justify-center text-center"
        : "justify-start text-left";

  function handleClick() {
    if (onClick) {
      onClick();
      return;
    }

    if (onSort && resolvedSortKey) {
      onSort(resolvedSortKey);
    }
  }

  const isSortable = Boolean(onClick || (onSort && resolvedSortKey));

  return (
    <th className={["sortable-table-header", className].join(" ")}>
      {isSortable ? (
        <button
          type="button"
          onClick={handleClick}
          className={[
            "inline-flex w-full items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition",
            alignClass,
            isActive ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-800",
          ].join(" ")}
        >
          <span>{label}</span>
          <span
            aria-hidden="true"
            className={[
              "text-[11px] leading-none",
              isActive ? "opacity-100" : "opacity-40",
            ].join(" ")}
          >
            {indicator}
          </span>
        </button>
      ) : (
        <span
          className={[
            "inline-flex w-full items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500",
            alignClass,
          ].join(" ")}
        >
          {label}
        </span>
      )}
    </th>
  );
}

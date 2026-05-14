import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import type { SortConfig, SortDirection } from "./useSortableTable";

type SortableTableHeaderProps<TSortKey extends string = string> = {
  label: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";

  sortKey?: TSortKey;
  columnKey?: TSortKey;
  sortConfig?: SortConfig<TSortKey> | null;
  onSort?: (sortKey: TSortKey) => void;

  active?: boolean;
  direction?: SortDirection;
  onClick?: () => void;
};

const headerCellStyle: CSSProperties = {
  borderBottom: "0",
  boxShadow: "none",
  cursor: "pointer",
  outline: "none",
  textAlign: "left",
  textDecoration: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
};

const headerTextStyle: CSSProperties = {
  border: "0",
  borderBottom: "0",
  boxShadow: "none",
  cursor: "inherit",
  textAlign: "left",
  textDecoration: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
};

function getSortIndicator(direction: SortDirection | undefined, isActive: boolean) {
  if (!isActive) {
    return "↕";
  }

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
}: SortableTableHeaderProps<TSortKey>) {
  const resolvedSortKey = sortKey ?? columnKey;

  const isActive =
    typeof active === "boolean"
      ? active
      : Boolean(sortConfig && resolvedSortKey && sortConfig.key === resolvedSortKey);

  const resolvedDirection =
    direction ?? (isActive && sortConfig ? sortConfig.direction : undefined);

  const indicator = getSortIndicator(resolvedDirection, isActive);

  function handleSort() {
    if (onClick) {
      onClick();
      return;
    }

    if (onSort && resolvedSortKey) {
      onSort(resolvedSortKey);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTableCellElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSort();
    }
  }

  const isSortable = Boolean(onClick || (onSort && resolvedSortKey));

  return (
    <th
      tabIndex={isSortable ? 0 : undefined}
      onClick={isSortable ? handleSort : undefined}
      onKeyDown={isSortable ? handleKeyDown : undefined}
      aria-sort={
        isActive
          ? resolvedDirection === "asc"
            ? "ascending"
            : "descending"
          : undefined
      }
      className={["px-4 py-3 text-left", className].filter(Boolean).join(" ")}
      style={headerCellStyle}
    >
      <span
        data-sortable-header
        className={[
          "inline-flex items-center justify-start text-left text-xs font-semibold uppercase tracking-[0.14em]",
          isActive ? "text-zinc-950" : "text-zinc-500",
          isSortable ? "hover:text-zinc-800" : "",
        ].join(" ")}
        style={headerTextStyle}
      >
        <span data-sortable-header-label style={headerTextStyle}>
          {label}
        </span>

        {isSortable && (
          <span
            data-sortable-header-arrow
            aria-hidden="true"
            style={{
              ...headerTextStyle,
              display: "inline-flex",
              flex: "0 0 auto",
              fontSize: "11px",
              justifyContent: "center",
              lineHeight: 1,
              marginLeft: "10px",
              minWidth: "16px",
              opacity: isActive ? 0.9 : 0.35,
              width: "16px",
            }}
          >
            {indicator}
          </span>
        )}
      </span>
    </th>
  );
}

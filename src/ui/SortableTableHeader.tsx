import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
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
   * Compatibility API for existing master-data/document pages.
   */
  active?: boolean;
  direction?: SortDirection;
  onClick?: () => void;
};

const headerCellStyle: CSSProperties = {
  borderBottom: "0",
  boxShadow: "none",
  textDecoration: "none",
  outline: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
};

const clickableHeaderCellStyle: CSSProperties = {
  ...headerCellStyle,
  cursor: "pointer",
};

const headerTextStyle: CSSProperties = {
  border: "0",
  borderBottom: "0",
  boxShadow: "none",
  textDecoration: "none",
  outline: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  cursor: "inherit",
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
  align = "left",
}: SortableTableHeaderProps<TSortKey>) {
  const resolvedSortKey = sortKey ?? columnKey;

  const isActive =
    typeof active === "boolean"
      ? active
      : Boolean(sortConfig && resolvedSortKey && sortConfig.key === resolvedSortKey);

  const resolvedDirection =
    direction ?? (isActive && sortConfig ? sortConfig.direction : undefined);

  const indicator = getSortIndicator(resolvedDirection, isActive);

  const alignClass =
    align === "right"
      ? "justify-end text-right"
      : align === "center"
        ? "justify-center text-center"
        : "justify-start text-left";

  const cellTextAlign: CSSProperties["textAlign"] =
    align === "right" ? "right" : align === "center" ? "center" : "left";

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
      className={["px-4 py-3", className].join(" ")}
      style={{
        ...(isSortable ? clickableHeaderCellStyle : headerCellStyle),
        textAlign: cellTextAlign,
      }}
    >
      <span
        className={[
          "inline-flex w-full items-center text-xs font-semibold uppercase tracking-[0.14em]",
          alignClass,
          isActive ? "text-zinc-950" : "text-zinc-500",
          isSortable ? "hover:text-zinc-800" : "",
        ].join(" ")}
        style={headerTextStyle}
      >
        <span
          style={{
            ...headerTextStyle,
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <span style={headerTextStyle}>{label}</span>

          {isSortable && (
            <span
              aria-hidden="true"
              style={{
                ...headerTextStyle,
                position: "absolute",
                left: "calc(100% + 10px)",
                top: "50%",
                transform: "translateY(-50%)",
                display: "inline-flex",
                width: "16px",
                minWidth: "16px",
                justifyContent: "center",
                fontSize: "11px",
                lineHeight: 1,
                opacity: isActive ? 0.9 : 0.35,
              }}
            >
              {indicator}
            </span>
          )}
        </span>
      </span>
    </th>
  );
}

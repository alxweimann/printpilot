import type { ReactNode } from "react";


type TableShellProps = {
  children: ReactNode;
  className?: string;
};

type TableRowProps = {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

type StatusBadgeTone =
  | "neutral"
  | "blue"
  | "green"
  | "red"
  | "amber"
  | "purple";

type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusBadgeTone;
};

export type DataTableColumn<T> = {
  key?: string;
  accessorKey?: string;
  id?: string;
  label?: ReactNode;
  header?: ReactNode;
  title?: ReactNode;
  className?: string;
  cellClassName?: string;
  headerClassName?: string;
  render?: (item: T, index: number) => ReactNode;
  cell?: (item: T, index: number) => ReactNode;
};

export type DataTableProps<T> = {
  children?: ReactNode;
  columns?: DataTableColumn<T>[];
  data?: T[];
  rows?: T[];
  items?: T[];
  getRowKey?: (item: T, index: number) => string;
  rowKey?: keyof T | ((item: T, index: number) => string);
  emptyText?: ReactNode;
  emptyMessage?: ReactNode;
  onRowClick?: (item: T) => void;
  isRowActive?: (item: T) => boolean;
  className?: string;
  tableClassName?: string;
};

type TableToolbarProps = {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

const badgeToneClasses: Record<StatusBadgeTone, string> = {
  neutral: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  purple: "bg-violet-50 text-violet-700 ring-violet-200",
};

function getColumnKey<T>(column: DataTableColumn<T>, index: number) {
  return column.key ?? column.accessorKey ?? column.id ?? `column-${index}`;
}

function getColumnHeader<T>(column: DataTableColumn<T>) {
  return column.label ?? column.header ?? column.title ?? "";
}

function getCellValue<T>(item: T, column: DataTableColumn<T>, index: number) {
  if (column.render) {
    return column.render(item, index);
  }

  if (column.cell) {
    return column.cell(item, index);
  }

  const accessor = column.accessorKey ?? column.key ?? column.id;

  if (accessor && typeof item === "object" && item !== null && accessor in item) {
    return String((item as Record<string, unknown>)[accessor] ?? "");
  }

  return null;
}

function getTableRowKey<T>(
  item: T,
  index: number,
  getRowKey?: (item: T, index: number) => string,
  rowKey?: keyof T | ((item: T, index: number) => string),
) {
  if (getRowKey) {
    return getRowKey(item, index);
  }

  if (typeof rowKey === "function") {
    return rowKey(item, index);
  }

  if (rowKey && typeof item === "object" && item !== null) {
    const value = (item as Record<string, unknown>)[String(rowKey)];
    if (value !== undefined && value !== null) {
      return String(value);
    }
  }

  if (typeof item === "object" && item !== null) {
    const record = item as Record<string, unknown>;
    if (record.id !== undefined && record.id !== null) {
      return String(record.id);
    }
    if (record.customerId !== undefined && record.customerId !== null) {
      return String(record.customerId);
    }
    if (record.quoteId !== undefined && record.quoteId !== null) {
      return String(record.quoteId);
    }
    if (record.orderId !== undefined && record.orderId !== null) {
      return String(record.orderId);
    }
    if (record.deliveryNoteId !== undefined && record.deliveryNoteId !== null) {
      return String(record.deliveryNoteId);
    }
  }

  return String(index);
}

export function TableToolbar({
  title,
  description,
  children,
  actions,
  className = "",
}: TableToolbarProps) {
  return (
    <div className={["table-toolbar", className].filter(Boolean).join(" ")}>
      {(title || description) && (
        <div className="table-toolbar-copy">
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
        </div>
      )}

      {(children || actions) && (
        <div className="table-toolbar-actions">
          {children}
          {actions}
        </div>
      )}
    </div>
  );
}

export function TableShell({ children, className = "" }: TableShellProps) {
  return (
    <div className={["data-table-shell", className].filter(Boolean).join(" ")}>
      <style>
        {`
          .data-table {
            width: 100%;
            border-collapse: collapse;
          }

          .data-table thead,
          .data-table tbody,
          .data-table tr,
          .data-table th,
          .data-table td {
            text-align: left !important;
          }

          .data-table th {
            vertical-align: middle;
            user-select: none;
          }

          .data-table td {
            vertical-align: middle;
          }

          .data-table th > *,
          .data-table td > * {
            text-align: left !important;
          }

          .data-table [data-sortable-header] {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            width: auto !important;
            text-align: left !important;
          }

          .data-table [data-sortable-header-label] {
            text-align: left !important;
          }

          .data-table [data-sortable-header-arrow] {
            margin-left: 10px !important;
            flex: 0 0 auto !important;
          }
        `}
      </style>
      <div className="data-table-scroll">{children}</div>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>;
}

export function TableHeadCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={["text-left", className].filter(Boolean).join(" ")}>
      {children}
    </th>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({
  children,
  active = false,
  onClick,
  className = "",
}: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={[
        onClick ? "data-table-clickable-row" : "",
        active ? "data-table-row-selected" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={["text-left", className].filter(Boolean).join(" ")}>
      {children}
    </td>
  );
}

export function TablePrimaryText({ children }: { children: ReactNode }) {
  return <div className="font-semibold text-zinc-950">{children}</div>;
}

export function TableSecondaryText({ children }: { children: ReactNode }) {
  return <div className="mt-1 text-xs text-zinc-500">{children}</div>;
}

export function StatusBadge({
  children,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex min-w-[88px] items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset",
        badgeToneClasses[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export function EmptyTableState({
  children,
  colSpan,
}: {
  children: ReactNode;
  colSpan: number;
}) {
  return (
    <tr>
      <td
        colSpan={Math.max(colSpan, 1)}
        className="px-5 py-10 text-center text-sm text-zinc-500"
      >
        {children}
      </td>
    </tr>
  );
}

/**
 * Robust compatibility wrapper for existing pages.
 *
 * Supports:
 * - legacy children usage: <DataTable><thead /> <tbody /></DataTable>
 * - columns + data
 * - columns + rows
 * - columns + items
 * - key/accessorKey/id columns
 * - label/header/title headers
 * - render/cell render functions
 */
export function DataTable<T>({
  children,
  columns = [],
  data,
  rows,
  items,
  getRowKey,
  rowKey,
  emptyText,
  emptyMessage,
  onRowClick,
  isRowActive,
  className = "",
  tableClassName = "",
}: DataTableProps<T>) {
  /**
   * Important:
   * Existing pages may already build the complete table content manually.
   * In that case we must render children and not replace the content with
   * the column/data API. This keeps demo/test data visible.
   */
  if (children) {
    return (
      <TableShell className={className}>
        <table
          className={[
            "data-table",
            tableClassName,
          ].join(" ")}
        >
          {children}
        </table>
      </TableShell>
    );
  }

  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data)
    ? data
    : Array.isArray(rows)
      ? rows
      : Array.isArray(items)
        ? items
        : [];

  const resolvedEmptyText =
    emptyText ?? emptyMessage ?? "Keine Einträge vorhanden.";

  return (
    <TableShell className={className}>
      <table
        className={[
          "data-table",
          tableClassName,
        ].join(" ")}
      >
        <TableHeader>
          <tr>
            {safeColumns.length > 0 ? (
              safeColumns.map((column, index) => (
                <TableHeadCell
                  key={getColumnKey(column, index)}
                  className={column.headerClassName}
                >
                  {getColumnHeader(column)}
                </TableHeadCell>
              ))
            ) : (
              <TableHeadCell>Einträge</TableHeadCell>
            )}
          </tr>
        </TableHeader>

        <TableBody>
          {safeData.length === 0 ? (
            <EmptyTableState colSpan={safeColumns.length || 1}>
              {resolvedEmptyText}
            </EmptyTableState>
          ) : (
            safeData.map((item, rowIndex) => (
              <TableRow
                key={getTableRowKey(item, rowIndex, getRowKey, rowKey)}
                active={isRowActive?.(item) ?? false}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {safeColumns.length > 0 ? (
                  safeColumns.map((column, columnIndex) => (
                    <TableCell
                      key={getColumnKey(column, columnIndex)}
                      className={column.cellClassName ?? column.className}
                    >
                      {getCellValue(item, column, rowIndex)}
                    </TableCell>
                  ))
                ) : (
                  <TableCell>
                    {typeof item === "string" || typeof item === "number"
                      ? item
                      : JSON.stringify(item)}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </table>
    </TableShell>
  );
}

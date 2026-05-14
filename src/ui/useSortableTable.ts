import { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc";

export type SortConfig<TSortKey extends string> = {
  key: TSortKey;
  direction: SortDirection;
} | null;

export type SortValue = string | number | boolean | Date | null | undefined;

type UseSortableTableOptions<TItem, TSortKey extends string> = {
  rows: TItem[];
  initialSortKey?: TSortKey;
  initialDirection?: SortDirection;
  getSortValue: (item: TItem, sortKey: TSortKey) => SortValue;
  fallbackSortValue?: (item: TItem) => SortValue;
};

const sortCollator = new Intl.Collator("de-DE", {
  numeric: true,
  sensitivity: "base",
});

function normalizeSortValue(value: SortValue) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

export function useSortableTable<TItem, TSortKey extends string>({
  rows,
  initialSortKey,
  initialDirection = "asc",
  getSortValue,
  fallbackSortValue,
}: UseSortableTableOptions<TItem, TSortKey>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<TSortKey>>(
    initialSortKey
      ? {
          key: initialSortKey,
          direction: initialDirection,
        }
      : null,
  );

  const sortedRows = useMemo(() => {
    if (!sortConfig) {
      return rows;
    }

    const directionFactor = sortConfig.direction === "asc" ? 1 : -1;

    return [...rows].sort((firstItem, secondItem) => {
      const firstValue = normalizeSortValue(
        getSortValue(firstItem, sortConfig.key),
      );
      const secondValue = normalizeSortValue(
        getSortValue(secondItem, sortConfig.key),
      );

      const primaryResult =
        sortCollator.compare(firstValue, secondValue) * directionFactor;

      if (primaryResult !== 0) {
        return primaryResult;
      }

      if (fallbackSortValue) {
        return sortCollator.compare(
          normalizeSortValue(fallbackSortValue(firstItem)),
          normalizeSortValue(fallbackSortValue(secondItem)),
        );
      }

      return 0;
    });
  }, [fallbackSortValue, getSortValue, rows, sortConfig]);

  function requestSort(nextSortKey: TSortKey) {
    setSortConfig((currentConfig) => {
      if (currentConfig?.key === nextSortKey) {
        return {
          key: nextSortKey,
          direction: currentConfig.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key: nextSortKey,
        direction: "asc",
      };
    });
  }

  function getAriaSort(sortKey: TSortKey) {
    if (sortConfig?.key !== sortKey) {
      return "none" as const;
    }

    return sortConfig.direction === "asc" ? "ascending" : "descending";
  }

  return {
    sortedRows,
    sortConfig,
    requestSort,
    getAriaSort,
  };
}

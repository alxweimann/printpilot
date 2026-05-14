import { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc";

export type SortConfig<TKey extends string> = {
  key: TKey;
  direction: SortDirection;
} | null;

type SortableValue = string | number | Date | null | undefined;

type UseSortableTableOptions<TRow, TKey extends string> = {
  rows: TRow[];
  getSortValue: (row: TRow, key: TKey) => SortableValue;
  initialSort?: SortConfig<TKey>;
  locale?: string;
};

const defaultCollator = new Intl.Collator("de-DE", {
  numeric: true,
  sensitivity: "base",
});

function normalizeSortableValue(value: SortableValue) {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (value === null || value === undefined) {
    return "";
  }

  return value;
}

function compareSortableValues(
  firstValue: SortableValue,
  secondValue: SortableValue,
  collator: Intl.Collator,
) {
  const normalizedFirstValue = normalizeSortableValue(firstValue);
  const normalizedSecondValue = normalizeSortableValue(secondValue);

  if (
    typeof normalizedFirstValue === "number" &&
    typeof normalizedSecondValue === "number"
  ) {
    return normalizedFirstValue - normalizedSecondValue;
  }

  return collator.compare(
    String(normalizedFirstValue),
    String(normalizedSecondValue),
  );
}

export function useSortableTable<TRow, TKey extends string>({
  rows,
  getSortValue,
  initialSort = null,
  locale = "de-DE",
}: UseSortableTableOptions<TRow, TKey>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<TKey>>(initialSort);

  const collator = useMemo(() => {
    if (locale === "de-DE") {
      return defaultCollator;
    }

    return new Intl.Collator(locale, {
      numeric: true,
      sensitivity: "base",
    });
  }, [locale]);

  const sortedRows = useMemo(() => {
    if (!sortConfig) {
      return rows;
    }

    const directionFactor = sortConfig.direction === "asc" ? 1 : -1;

    return [...rows].sort((firstRow, secondRow) => {
      const primaryResult = compareSortableValues(
        getSortValue(firstRow, sortConfig.key),
        getSortValue(secondRow, sortConfig.key),
        collator,
      );

      return primaryResult * directionFactor;
    });
  }, [collator, getSortValue, rows, sortConfig]);

  function requestSort(nextSortKey: TKey) {
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

  function getAriaSort(sortKey: TKey): "none" | "ascending" | "descending" {
    if (sortConfig?.key !== sortKey) {
      return "none";
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

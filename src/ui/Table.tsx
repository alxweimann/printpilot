import type { ReactNode } from "react";

type DataTableProps = {
  children: ReactNode;
};

type TableToolbarProps = {
  children: ReactNode;
};

export function TableToolbar({ children }: TableToolbarProps) {
  return <div className="table-toolbar">{children}</div>;
}

export function DataTable({ children }: DataTableProps) {
  return <table className="data-table">{children}</table>;
}

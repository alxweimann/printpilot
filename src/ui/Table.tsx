import type { ReactNode } from "react";

import "./table.css";

type TableToolbarProps = {
  children: ReactNode;
};

type DataTableProps = {
  children: ReactNode;
};

export function TableToolbar({ children }: TableToolbarProps) {
  return <div className="table-toolbar">{children}</div>;
}

export function DataTable({ children }: DataTableProps) {
  return <table className="data-table">{children}</table>;
}

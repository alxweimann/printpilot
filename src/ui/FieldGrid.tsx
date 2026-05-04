import type { ReactNode } from "react";

type FieldGridProps = {
  children: ReactNode;
};

export function FieldGrid({ children }: FieldGridProps) {
  return <div className="field-grid">{children}</div>;
}

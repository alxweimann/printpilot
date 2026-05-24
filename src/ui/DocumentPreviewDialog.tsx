import type { ReactNode } from "react";

import { Button } from "./Button";

type PreviewField = {
  label: ReactNode;
  value: ReactNode;
};

type DocumentPreviewDialogProps = {
  open: boolean;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  fields: PreviewField[];
  onClose: () => void;
};

export function DocumentPreviewDialog({
  open,
  eyebrow = "Dokumentvorschau",
  title,
  subtitle,
  fields,
  onClose,
}: DocumentPreviewDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="preview-dialog-backdrop" role="presentation">
      <section
        className="preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Dokumentvorschau"
      >
        <header className="preview-dialog-header">
          <div>
            <span className="preview-dialog-eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>

          <Button onClick={onClose}>Schließen</Button>
        </header>

        <div className="preview-document-sheet">
          <div className="preview-document-logo">PrintPilot</div>

          <div className="preview-document-title">
            <span>{eyebrow}</span>
            <strong>{title}</strong>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>

          <dl className="preview-document-fields">
            {fields.map((field, index) => (
              <div key={index}>
                <dt>{field.label}</dt>
                <dd>{field.value || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}

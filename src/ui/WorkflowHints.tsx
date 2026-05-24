import type { ReactNode } from "react";

type WorkflowHintVariant = "warning" | "info" | "success";

type WorkflowHint = {
  title: ReactNode;
  description?: ReactNode;
  variant?: WorkflowHintVariant;
};

type WorkflowHintsProps = {
  title?: ReactNode;
  hints: WorkflowHint[];
};

const variantStyles: Record<
  WorkflowHintVariant,
  {
    background: string;
    borderColor: string;
    accent: string;
    color: string;
  }
> = {
  warning: {
    background: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.28)",
    accent: "#f59e0b",
    color: "#92400e",
  },
  info: {
    background: "rgba(59, 130, 246, 0.08)",
    borderColor: "rgba(59, 130, 246, 0.24)",
    accent: "#3b82f6",
    color: "#1d4ed8",
  },
  success: {
    background: "rgba(34, 197, 94, 0.08)",
    borderColor: "rgba(34, 197, 94, 0.24)",
    accent: "#22c55e",
    color: "#15803d",
  },
};

export function WorkflowHints({ title = "Workflow-Hinweise", hints }: WorkflowHintsProps) {
  if (hints.length === 0) {
    return null;
  }

  return (
    <section className="workflow-hints" aria-label="Workflow-Hinweise">
      <div className="workflow-hints-title">{title}</div>

      <div className="workflow-hints-list">
        {hints.map((hint, index) => {
          const variant = hint.variant ?? "info";
          const style = variantStyles[variant];

          return (
            <article
              key={index}
              className="workflow-hint"
              style={{
                background: style.background,
                borderColor: style.borderColor,
                color: style.color,
              }}
            >
              <span
                className="workflow-hint-dot"
                style={{ background: style.accent }}
                aria-hidden="true"
              />
              <div>
                <strong>{hint.title}</strong>
                {hint.description ? <p>{hint.description}</p> : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

import type { ReactNode } from "react";
import { PrintPilotLogo } from "../brand/PrintPilotLogo";

type AppWorkHeaderAction = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};

type AppWorkHeaderProps = {
  module: string;
  title: string;
  subtitle?: string;
  chips?: Array<string | number | null | undefined | false>;
  primaryAction?: AppWorkHeaderAction;
  secondaryActions?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function AppWorkHeader({
  module,
  title,
  subtitle,
  chips = [],
  primaryAction,
  secondaryActions,
  className,
  ariaLabel,
}: AppWorkHeaderProps) {
  const visibleChips = chips.filter((chip): chip is string | number =>
    chip !== null && chip !== undefined && chip !== false && String(chip).trim().length > 0,
  );
  const classNames = ["pp-work-header", className].filter(Boolean).join(" ");

  return (
    <header className={classNames} aria-label={ariaLabel ?? `Arbeitskopf ${module}`}>
      <div className="pp-work-header__brand" aria-hidden="true">
        <PrintPilotLogo className="pp-work-header__logo" variant="app" />
      </div>

      <div className="pp-work-header__main">
        <span className="pp-work-header__module">{module}</span>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>

      <div className="pp-work-header__chips" aria-label={`${module} Kontextdaten`}>
        {visibleChips.map((chip) => (
          <span key={String(chip)}>{chip}</span>
        ))}
      </div>

      {primaryAction || secondaryActions ? (
        <div className="pp-work-header__actions">
          {secondaryActions ? (
            <div className="pp-work-header__secondary-actions">{secondaryActions}</div>
          ) : null}
          {primaryAction ? (
            <button
              type="button"
              className="pp-work-header__primary-action"
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              aria-label={primaryAction.ariaLabel}
            >
              {primaryAction.label}
            </button>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

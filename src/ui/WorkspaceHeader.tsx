type WorkspaceHeaderProps = {
  kicker: string;
  title: string;
  statusLabel?: string;
  statusValue?: string;
};

export function WorkspaceHeader({
  kicker,
  title,
  statusLabel = "Status",
  statusValue,
}: WorkspaceHeaderProps) {
  return (
    <div className="calculation-sheet-header">
      <div>
        <div className="sheet-kicker">{kicker}</div>
        <h2>{title}</h2>
      </div>

      {statusValue ? (
        <div className="sheet-meta">
          <span>{statusLabel}</span>
          <strong>{statusValue}</strong>
        </div>
      ) : null}
    </div>
  );
}

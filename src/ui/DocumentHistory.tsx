type DocumentHistoryEntry = {
  id?: string;
  createdAt: string;
  action: string;
  status: string;
  previousStatus?: string;
  nextStatus?: string;
};

type DocumentHistoryProps = {
  entries?: DocumentHistoryEntry[];
  maxVisible?: number;
};

function formatHistoryDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function sortHistoryEntries(entries: DocumentHistoryEntry[]) {
  return [...entries].sort((firstEntry, secondEntry) => {
    const firstDate = new Date(firstEntry.createdAt).getTime();
    const secondDate = new Date(secondEntry.createdAt).getTime();

    return secondDate - firstDate;
  });
}

function getDocumentNumberFromAction(action: string) {
  const match = action.match(/: ([A-ZÄÖÜ]{1,4}-[^\s]+)/);

  return match?.[1] ?? null;
}

function getActionLabel(action: string) {
  const documentNumber = getDocumentNumberFromAction(action);

  if (!documentNumber) {
    return action;
  }

  return action.replace(`: ${documentNumber}`, "");
}

export function DocumentHistory({
  entries = [],
  maxVisible = 5,
}: DocumentHistoryProps) {
  if (entries.length === 0) {
    return null;
  }

  const visibleEntries = sortHistoryEntries(entries).slice(0, maxVisible);
  const hiddenCount = Math.max(entries.length - visibleEntries.length, 0);

  return (
    <section className="document-history document-history--timeline" aria-label="Dokumenthistorie">
      <div className="document-history-title">Historie</div>

      <ol className="document-history-list">
        {visibleEntries.map((entry, index) => {
          const documentNumber = getDocumentNumberFromAction(entry.action);
          const actionLabel = getActionLabel(entry.action);

          return (
            <li key={entry.id ?? `${entry.createdAt}-${index}`}>
              <span className="document-history-dot" aria-hidden="true" />
              <div className="document-history-content">
                <strong>
                  {actionLabel}
                  {documentNumber ? (
                    <span className="document-history-reference">
                      {documentNumber}
                    </span>
                  ) : null}
                </strong>

                {entry.previousStatus && entry.nextStatus ? (
                  <p className="document-history-meta">
                    <span className="document-history-transition">
                      {entry.previousStatus} → {entry.nextStatus}
                    </span>
                    <span>{formatHistoryDate(entry.createdAt)}</span>
                  </p>
                ) : (
                  <p className="document-history-meta">
                    <span>Status: {entry.status}</span>
                    <span>{formatHistoryDate(entry.createdAt)}</span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {hiddenCount > 0 ? (
        <div className="document-history-more">
          {hiddenCount} ältere Einträge ausgeblendet
        </div>
      ) : null}
    </section>
  );
}

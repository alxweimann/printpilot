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
    <section className="document-history" aria-label="Dokumenthistorie">
      <div className="document-history-title">Historie</div>

      <ol className="document-history-list">
        {visibleEntries.map((entry, index) => (
          <li key={entry.id ?? `${entry.createdAt}-${index}`}>
            <span className="document-history-dot" aria-hidden="true" />
            <div>
              <strong>{entry.action}</strong>
              {entry.previousStatus && entry.nextStatus ? (
                <p>
                  {formatHistoryDate(entry.createdAt)} ·{" "}
                  <span className="document-history-transition">
                    {entry.previousStatus} → {entry.nextStatus}
                  </span>
                </p>
              ) : (
                <p>
                  {formatHistoryDate(entry.createdAt)} · Status: {entry.status}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {hiddenCount > 0 ? (
        <div className="document-history-more">
          {hiddenCount} ältere Einträge ausgeblendet
        </div>
      ) : null}
    </section>
  );
}

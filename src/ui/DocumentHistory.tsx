type DocumentHistoryEntry = {
  id?: string;
  createdAt: string;
  action: string;
  status: string;
};

type DocumentHistoryProps = {
  entries?: DocumentHistoryEntry[];
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

export function DocumentHistory({ entries = [] }: DocumentHistoryProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="document-history" aria-label="Dokumenthistorie">
      <div className="document-history-title">Historie</div>

      <ol className="document-history-list">
        {entries.map((entry, index) => (
          <li key={entry.id ?? `${entry.createdAt}-${index}`}>
            <span className="document-history-dot" aria-hidden="true" />
            <div>
              <strong>{entry.action}</strong>
              <p>
                {formatHistoryDate(entry.createdAt)} · Status: {entry.status}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

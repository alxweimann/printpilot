type DirtyStateNoticeProps = {
  isDirty: boolean;
};

export function DirtyStateNotice({ isDirty }: DirtyStateNoticeProps) {
  if (!isDirty) {
    return null;
  }

  return (
    <span
      style={{
        alignSelf: "center",
        color: "var(--color-text-muted)",
        fontSize: "0.8rem",
        fontWeight: 600,
        marginRight: "auto",
      }}
    >
      Ungespeicherte Änderungen
    </span>
  );
}

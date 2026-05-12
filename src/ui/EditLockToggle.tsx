type EditLockToggleProps = {
  isEditing: boolean;
  onToggle: () => void;
};

export function EditLockToggle({ isEditing, onToggle }: EditLockToggleProps) {
  return (
    <button
      type="button"
      aria-label={isEditing ? "Bearbeitung sperren" : "Bearbeitung oeffnen"}
      title={isEditing ? "Bearbeitung sperren" : "Bearbeitung oeffnen"}
      onClick={onToggle}
      style={{
        alignItems: "center",
        alignSelf: "center",
        background: "transparent",
        border: 0,
        boxShadow: "none",
        cursor: "pointer",
        display: "inline-flex",
        fontSize: "1.55rem",
        height: "2.5rem",
        justifyContent: "center",
        lineHeight: 1,
        padding: 0,
        width: "1.65rem",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          display: "inline-flex",
          height: "100%",
          justifyContent: "center",
          transform: "translateY(-4px)",
        }}
      >
        {isEditing ? "\uD83D\uDD13" : "\uD83D\uDD12"}
      </span>
    </button>
  );
}

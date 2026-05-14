import { Button } from "./Button";

type SaveActionButtonProps = {
  isDirty: boolean;
  defaultLabel: string;
  dirtyLabel?: string;
  onClick?: () => void;
};

export function SaveActionButton({
  isDirty,
  defaultLabel,
  dirtyLabel = "Änderungen speichern",
  onClick,
}: SaveActionButtonProps) {
  return (
    <Button variant="primary" onClick={onClick}>
      {isDirty ? dirtyLabel : defaultLabel}
    </Button>
  );
}

import { Button } from "./Button";

type SaveActionButtonProps = {
  isDirty: boolean;
  defaultLabel: string;
  dirtyLabel?: string;
};

export function SaveActionButton({
  isDirty,
  defaultLabel,
  dirtyLabel = "Änderungen speichern",
}: SaveActionButtonProps) {
  return (
    <Button variant="primary">
      {isDirty ? dirtyLabel : defaultLabel}
    </Button>
  );
}

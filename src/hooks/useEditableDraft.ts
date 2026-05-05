import { useEffect, useMemo, useState } from "react";

type DraftSource = {
  id: string;
};

function serializeDraft<TDraft>(value: TDraft | undefined) {
  return JSON.stringify(value ?? null);
}

export function useEditableDraft<TDraft extends DraftSource>(
  source: TDraft | undefined,
) {
  const [draft, setDraft] = useState<TDraft | undefined>(source);

  useEffect(() => {
    setDraft(source);
  }, [source]);

  const isDirty = useMemo(() => {
    return serializeDraft(draft) !== serializeDraft(source);
  }, [draft, source]);

  function updateDraftField<TKey extends keyof TDraft>(
    key: TKey,
    value: TDraft[TKey],
  ) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        [key]: value,
      };
    });
  }

  function resetDraft() {
    setDraft(source);
  }

  return {
    draft,
    isDirty,
    updateDraftField,
    resetDraft,
  };
}

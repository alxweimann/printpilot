import { useEffect, useState } from "react";

type DraftSource = {
  id: string;
};

export function useEditableDraft<TDraft extends DraftSource>(
  source: TDraft | undefined,
) {
  const [draft, setDraft] = useState<TDraft | undefined>(source);

  useEffect(() => {
    setDraft(source);
  }, [source]);

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
    updateDraftField,
    resetDraft,
  };
}

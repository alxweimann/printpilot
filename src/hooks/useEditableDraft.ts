import { useEffect, useMemo, useRef, useState } from "react";

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
  const [savedSource, setSavedSource] = useState<TDraft | undefined>(source);
  const activeSourceIdRef = useRef<string | undefined>(source?.id);

  useEffect(() => {
    const nextSourceId = source?.id;

    if (activeSourceIdRef.current === nextSourceId) {
      return;
    }

    activeSourceIdRef.current = nextSourceId;
    setDraft(source);
    setSavedSource(source);
  }, [source]);

  const isDirty = useMemo(() => {
    return serializeDraft(draft) !== serializeDraft(savedSource);
  }, [draft, savedSource]);

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
    setDraft(savedSource);
  }

  function saveDraft(nextSavedSource?: TDraft) {
    const nextSavedDraft = nextSavedSource ?? draft;

    setSavedSource(nextSavedDraft);
    setDraft(nextSavedDraft);
  }

  return {
    draft,
    isDirty,
    updateDraftField,
    resetDraft,
    saveDraft,
  };
}

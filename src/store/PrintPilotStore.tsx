import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  type PrintPilotQuote,
  type PrintPilotSettings,
  type PrintPilotStoreData,
  createPrintPilotStoreSnapshot,
} from "../data/printPilotStore";

type PrintPilotStoreContextValue = {
  data: PrintPilotStoreData;
  quotes: PrintPilotQuote[];
  settings: PrintPilotSettings;
  updateQuote: (quote: PrintPilotQuote) => void;
  updateSettings: (settings: PrintPilotSettings) => void;
  replaceStoreData: (data: PrintPilotStoreData) => void;
  getBackupData: () => PrintPilotStoreData;
};

const PrintPilotStoreContext =
  createContext<PrintPilotStoreContextValue | null>(null);

type PrintPilotStoreProviderProps = {
  children: ReactNode;
};

export function PrintPilotStoreProvider({
  children,
}: PrintPilotStoreProviderProps) {
  const [data, setData] = useState<PrintPilotStoreData>(() =>
    createPrintPilotStoreSnapshot(),
  );

  function updateQuote(updatedQuote: PrintPilotQuote) {
    setData((currentData) => ({
      ...currentData,
      quotes: currentData.quotes.map((quote) =>
        quote.id === updatedQuote.id ? updatedQuote : quote,
      ),
    }));
  }

  function updateSettings(updatedSettings: PrintPilotSettings) {
    setData((currentData) => ({
      ...currentData,
      settings: updatedSettings,
    }));
  }

  function replaceStoreData(nextData: PrintPilotStoreData) {
    setData(nextData);
  }

  function getBackupData() {
    return data;
  }

  const value = useMemo<PrintPilotStoreContextValue>(
    () => ({
      data,
      quotes: data.quotes,
      settings: data.settings,
      updateQuote,
      updateSettings,
      replaceStoreData,
      getBackupData,
    }),
    [data],
  );

  return (
    <PrintPilotStoreContext.Provider value={value}>
      {children}
    </PrintPilotStoreContext.Provider>
  );
}

export function usePrintPilotStore() {
  const context = useContext(PrintPilotStoreContext);

  if (!context) {
    throw new Error(
      "usePrintPilotStore must be used inside PrintPilotStoreProvider.",
    );
  }

  return context;
}

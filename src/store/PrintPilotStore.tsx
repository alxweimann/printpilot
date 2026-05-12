import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  type PrintPilotCustomer,
  type PrintPilotMachine,
  type PrintPilotMaterial,
  type PrintPilotQuote,
  type PrintPilotService,
  type PrintPilotSettings,
  type PrintPilotStoreData,
  createPrintPilotStoreSnapshot,
} from "../data/printPilotStore";

const PRINTPILOT_LOCAL_STORAGE_KEY = "printpilot-store-v1";

type PrintPilotStoreContextValue = {
  data: PrintPilotStoreData;
  customers: PrintPilotCustomer[];
  quotes: PrintPilotQuote[];
  materials: PrintPilotMaterial[];
  machines: PrintPilotMachine[];
  services: PrintPilotService[];
  settings: PrintPilotSettings;
  updateCustomer: (customer: PrintPilotCustomer) => void;
  updateMachine: (machine: PrintPilotMachine) => void;
  updateMaterial: (material: PrintPilotMaterial) => void;
  updateQuote: (quote: PrintPilotQuote) => void;
  updateService: (service: PrintPilotService) => void;
  updateSettings: (settings: PrintPilotSettings) => void;
  replaceStoreData: (data: PrintPilotStoreData) => void;
  resetStoreData: () => void;
  getBackupData: () => PrintPilotStoreData;
};

const PrintPilotStoreContext =
  createContext<PrintPilotStoreContextValue | null>(null);

type PrintPilotStoreProviderProps = {
  children: ReactNode;
};

function isValidStoreData(value: unknown): value is PrintPilotStoreData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PrintPilotStoreData>;

  return (
    Array.isArray(candidate.customers) &&
    Array.isArray(candidate.quotes) &&
    Array.isArray(candidate.orders) &&
    Array.isArray(candidate.materials) &&
    Array.isArray(candidate.machines) &&
    Array.isArray(candidate.services) &&
    Array.isArray(candidate.finishing) &&
    Array.isArray(candidate.templates) &&
    typeof candidate.settings === "object" &&
    candidate.settings !== null &&
    !Array.isArray(candidate.settings)
  );
}

function readStoredData() {
  try {
    const storedValue = window.localStorage.getItem(
      PRINTPILOT_LOCAL_STORAGE_KEY,
    );

    if (!storedValue) {
      return createPrintPilotStoreSnapshot();
    }

    const parsedValue = JSON.parse(storedValue) as unknown;

    if (!isValidStoreData(parsedValue)) {
      return createPrintPilotStoreSnapshot();
    }

    return createPrintPilotStoreSnapshot(parsedValue);
  } catch {
    return createPrintPilotStoreSnapshot();
  }
}

export function PrintPilotStoreProvider({
  children,
}: PrintPilotStoreProviderProps) {
  const [data, setData] = useState<PrintPilotStoreData>(() => readStoredData());

  useEffect(() => {
    window.localStorage.setItem(
      PRINTPILOT_LOCAL_STORAGE_KEY,
      JSON.stringify(data),
    );
  }, [data]);

  function updateCustomer(updatedCustomer: PrintPilotCustomer) {
    setData((currentData) => ({
      ...currentData,
      customers: currentData.customers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer,
      ),
    }));
  }

  function updateMachine(updatedMachine: PrintPilotMachine) {
    setData((currentData) => ({
      ...currentData,
      machines: currentData.machines.map((machine) =>
        machine.id === updatedMachine.id ? updatedMachine : machine,
      ),
    }));
  }

  function updateMaterial(updatedMaterial: PrintPilotMaterial) {
    setData((currentData) => ({
      ...currentData,
      materials: currentData.materials.map((material) =>
        material.id === updatedMaterial.id ? updatedMaterial : material,
      ),
    }));
  }

  function updateQuote(updatedQuote: PrintPilotQuote) {
    setData((currentData) => ({
      ...currentData,
      quotes: currentData.quotes.map((quote) =>
        quote.id === updatedQuote.id ? updatedQuote : quote,
      ),
    }));
  }

  function updateService(updatedService: PrintPilotService) {
    setData((currentData) => ({
      ...currentData,
      services: currentData.services.map((service) =>
        service.id === updatedService.id ? updatedService : service,
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
    setData(createPrintPilotStoreSnapshot(nextData));
  }

  function resetStoreData() {
    window.localStorage.removeItem(PRINTPILOT_LOCAL_STORAGE_KEY);
    setData(createPrintPilotStoreSnapshot());
  }

  function getBackupData() {
    return data;
  }

  const value = useMemo<PrintPilotStoreContextValue>(
    () => ({
      data,
      customers: data.customers,
      quotes: data.quotes,
      materials: data.materials,
      machines: data.machines,
      services: data.services,
      settings: data.settings,
      updateCustomer,
      updateMachine,
      updateMaterial,
      updateQuote,
      updateService,
      updateSettings,
      replaceStoreData,
      resetStoreData,
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

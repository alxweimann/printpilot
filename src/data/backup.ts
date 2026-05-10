import {
  type PrintPilotStoreData,
  createEmptyPrintPilotStoreData,
} from "./printPilotStore";

export type PrintPilotBackupData = PrintPilotStoreData;

export type PrintPilotBackupFile = {
  app: "PrintPilot";
  version: string;
  createdAt: string;
  data: PrintPilotBackupData;
};

export type PrintPilotBackupSummary = {
  version: string;
  createdAt: string;
  customers: number;
  quotes: number;
  orders: number;
  materials: number;
  machines: number;
  services: number;
  finishing: number;
  templates: number;
  hasSettings: boolean;
};

export const PRINTPILOT_BACKUP_VERSION = "0.1.0";

export function createEmptyBackupData(): PrintPilotBackupData {
  return createEmptyPrintPilotStoreData();
}

export function createPrintPilotBackup(
  data: PrintPilotBackupData = createEmptyBackupData(),
): PrintPilotBackupFile {
  return {
    app: "PrintPilot",
    version: PRINTPILOT_BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    data,
  };
}

export function createBackupFileName(date = new Date()) {
  const timestamp = date
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .replace("Z", "");

  return `printpilot-backup-${timestamp}.json`;
}

export function downloadPrintPilotBackup(backup: PrintPilotBackupFile) {
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = createBackupFileName(new Date(backup.createdAt));
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function isBackupData(value: unknown): value is PrintPilotBackupData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PrintPilotBackupData>;

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

export function isPrintPilotBackupFile(value: unknown): value is PrintPilotBackupFile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PrintPilotBackupFile>;

  return (
    candidate.app === "PrintPilot" &&
    typeof candidate.version === "string" &&
    typeof candidate.createdAt === "string" &&
    isBackupData(candidate.data)
  );
}

export function getPrintPilotBackupSummary(
  backup: PrintPilotBackupFile,
): PrintPilotBackupSummary {
  return {
    version: backup.version,
    createdAt: backup.createdAt,
    customers: backup.data.customers.length,
    quotes: backup.data.quotes.length,
    orders: backup.data.orders.length,
    materials: backup.data.materials.length,
    machines: backup.data.machines.length,
    services: backup.data.services.length,
    finishing: backup.data.finishing.length,
    templates: backup.data.templates.length,
    hasSettings: Object.keys(backup.data.settings).length > 0,
  };
}

export async function readPrintPilotBackupFile(file: File) {
  const content = await file.text();
  const parsedBackup = JSON.parse(content) as unknown;

  if (!isPrintPilotBackupFile(parsedBackup)) {
    throw new Error("Die Datei ist keine gültige PrintPilot-Backup-Datei.");
  }

  return parsedBackup;
}

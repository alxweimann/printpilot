export type PrintPilotBackupData = {
  customers: unknown[];
  quotes: unknown[];
  orders: unknown[];
  materials: unknown[];
  machines: unknown[];
  services: unknown[];
  finishing: unknown[];
  templates: unknown[];
  settings: Record<string, unknown>;
};

export type PrintPilotBackupFile = {
  app: "PrintPilot";
  version: string;
  createdAt: string;
  data: PrintPilotBackupData;
};

export const PRINTPILOT_BACKUP_VERSION = "0.1.0";

export function createEmptyBackupData(): PrintPilotBackupData {
  return {
    customers: [],
    quotes: [],
    orders: [],
    materials: [],
    machines: [],
    services: [],
    finishing: [],
    templates: [],
    settings: {},
  };
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

export function isPrintPilotBackupFile(value: unknown): value is PrintPilotBackupFile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PrintPilotBackupFile>;

  return (
    candidate.app === "PrintPilot" &&
    typeof candidate.version === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.data === "object" &&
    candidate.data !== null
  );
}

export async function readPrintPilotBackupFile(file: File) {
  const content = await file.text();
  const parsedBackup = JSON.parse(content) as unknown;

  if (!isPrintPilotBackupFile(parsedBackup)) {
    throw new Error("Die Datei ist keine gültige PrintPilot-Backup-Datei.");
  }

  return parsedBackup;
}

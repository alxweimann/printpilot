export type PrintPilotDateFormat =
  | "TT.MM.JJJJ"
  | "TT-MM-JJJJ"
  | "JJJJ-MM-TT"
  | "JJJJ/MM/TT";

const defaultDateFormat: PrintPilotDateFormat = "TT.MM.JJJJ";

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function normalizePrintPilotDateFormat(
  value: string | undefined,
): PrintPilotDateFormat {
  switch (value) {
    case "TT.MM.JJJJ":
    case "TT-MM-JJJJ":
    case "JJJJ-MM-TT":
    case "JJJJ/MM/TT":
      return value;

    default:
      return defaultDateFormat;
  }
}

export function formatPrintPilotDate(
  value: Date,
  format: string | undefined,
) {
  const resolvedFormat = normalizePrintPilotDateFormat(format);

  const day = padDatePart(value.getDate());
  const month = padDatePart(value.getMonth() + 1);
  const year = String(value.getFullYear());

  switch (resolvedFormat) {
    case "TT-MM-JJJJ":
      return `${day}-${month}-${year}`;

    case "JJJJ-MM-TT":
      return `${year}-${month}-${day}`;

    case "JJJJ/MM/TT":
      return `${year}/${month}/${day}`;

    case "TT.MM.JJJJ":
    default:
      return `${day}.${month}.${year}`;
  }
}

export function formatPrintPilotTime(value: Date) {
  const hours = padDatePart(value.getHours());
  const minutes = padDatePart(value.getMinutes());
  const seconds = padDatePart(value.getSeconds());

  return `${hours}:${minutes}:${seconds}`;
}

export function formatPrintPilotDateString(
  value: string | undefined,
  format: string | undefined,
) {
  if (!value) {
    return "";
  }

  const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    const resolvedFormat = normalizePrintPilotDateFormat(format);

    switch (resolvedFormat) {
      case "TT-MM-JJJJ":
        return `${day}-${month}-${year}`;

      case "JJJJ-MM-TT":
        return `${year}-${month}-${day}`;

      case "JJJJ/MM/TT":
        return `${year}/${month}/${day}`;

      case "TT.MM.JJJJ":
      default:
        return `${day}.${month}.${year}`;
    }
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return formatPrintPilotDate(parsedDate, format);
}

export const parseArrivalDate = (value: unknown): string | null => {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "number") {
    // Excel epoch logic
    const excelEpoch = new Date(1899, 11, 30);
    const parsed = new Date(excelEpoch.getTime() + value * 86400000);
    return parsed.toISOString().split("T")[0];
  }

  const raw = String(value).trim();

  // Convert dd/mm/yyyy to yyyy-mm-dd
  if (raw.includes("/")) {
    const [day, month, year] = raw.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // Already standard format
  if (raw.includes("-")) return raw;

  return null;
};

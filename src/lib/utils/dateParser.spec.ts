import { describe, expect, it } from "vitest";
import { parseArrivalDate } from "./dateParser";

describe("parseArrivalDate", () => {
  it("should return null for null or undefined values", () => {
    expect(parseArrivalDate(null)).toBeNull();
    expect(parseArrivalDate(undefined)).toBeNull();
    expect(parseArrivalDate("")).toBeNull();
  });

  it("should format a Javascript Date instance to yyyy-mm-dd", () => {
    const jsDate = new Date("2024-05-15T10:00:00.000Z");
    expect(parseArrivalDate(jsDate)).toBe("2024-05-15");
  });

  it("should transform Excel epoch numbers to yyyy-mm-dd strings", () => {
    // Excel epoch 45000 is approx 2023-03-15
    const result = parseArrivalDate(45000);
    expect(result).toBe("2023-03-15");
  });

  it("should convert dd/mm/yyyy to yyyy-mm-dd", () => {
    expect(parseArrivalDate("12/05/2026")).toBe("2026-05-12");
    expect(parseArrivalDate("1/9/2023")).toBe("2023-09-01"); // Padding test
  });

  it("should keep yyyy-mm-dd formatted strings", () => {
    expect(parseArrivalDate("2025-10-25")).toBe("2025-10-25");
  });

  it("should return null for unmatched formats", () => {
    expect(parseArrivalDate("invalid date string here!")).toBeNull();
  });
});

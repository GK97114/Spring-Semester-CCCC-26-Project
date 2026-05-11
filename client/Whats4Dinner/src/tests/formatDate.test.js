import { describe, it, expect } from "vitest";
import { formatDate } from "../utils/formatDate";

// Helper to get a local YYYY-MM-DD string offset by N days
function localDateString(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

describe("formatDate", () => {

    it("returns 'Today' for current date", () => {
        expect(formatDate(localDateString(0))).toBe("Today");
    });

    it("returns 'Yesterday' for yesterday's date", () => {
        expect(formatDate(localDateString(-1))).toBe("Yesterday");
    });

    it("returns 'X days ago' for dates within the past week", () => {
        expect(formatDate(localDateString(-3))).toBe("3 days ago");
    });

    it("returns a short date for dates older than 7 days", () => {
        const result = formatDate(localDateString(-10));
        expect(result).not.toContain("days ago");
        expect(result).not.toBe("Today");
        expect(result).not.toBe("Yesterday");
    });

});
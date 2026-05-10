import { describe, it, expect } from "vitest";
import { formatDate } from "../utils/formatDate";

describe("formatDate", () => {

    it("returns 'Today' for current date", () => {
        expect(formatDate(new Date().toISOString())).toBe("Today");
    });

    it("returns 'Yesterday' for yesterday's date", () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(formatDate(yesterday.toISOString())).toBe("Yesterday");
    });

    it("returns 'X days ago' for dates within the past week", () => {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        expect(formatDate(threeDaysAgo.toISOString())).toBe("3 days ago");
    });

    it("returns a short date for dates older than 7 days", () => {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        const result = formatDate(tenDaysAgo.toISOString());
        // Should be something like "Apr 30" — just check it's not a relative string
        expect(result).not.toContain("days ago");
        expect(result).not.toBe("Today");
        expect(result).not.toBe("Yesterday");
    });

});
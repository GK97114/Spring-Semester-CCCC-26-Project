import { describe, it, expect } from "vitest";
import { getToday } from "../utils/getToday";

describe("getToday", () => {

    it("returns a string in YYYY-MM-DD format", () => {
        const result = getToday();
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("returns today's local date", () => {
        const now = new Date();
        const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        expect(getToday()).toBe(expected);
    });

    it("returns a valid date", () => {
        const result = getToday();
        const parsed = new Date(result);
        expect(parsed.toString()).not.toBe("Invalid Date");
    });

});
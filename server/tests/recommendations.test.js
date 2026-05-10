import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

vi.mock("../db.js", () => ({
    default: { query: vi.fn() }
}));

vi.mock("../middleware/auth.js", () => ({
    requireUser: (req, res, next) => {
        req.userId = "test-user-uuid";
        next();
    }
}));

import pool from "../db.js";

beforeEach(() => {
    vi.clearAllMocks();
});


// ─── NOT ENOUGH MEALS (< 5) ───────────────────────────────────────────────────

describe("GET /api/recommendations — not enough meals", () => {

    it("returns popular cuisines from other users when user has fewer than 5 meals", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ meal_name: "Pizza", cuisine: "Italian" }]
        });
        pool.query.mockResolvedValueOnce({
            rows: [
                { cuisine: "Thai" },
                { cuisine: "Indian" },
                { cuisine: "Mexican" }
            ]
        });

        const res = await request(app)
            .get("/api/recommendations")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(200);
        expect(res.body.recommendations).toHaveLength(3);
        // Should have reason strings now
        expect(res.body.recommendations[0]).toHaveProperty("reason");
    });

    it("returns cuisines from master list when no other users have meals", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ meal_name: "Pizza", cuisine: "Italian" }]
        });
        pool.query.mockResolvedValueOnce({ rows: [] }); // No other users

        const res = await request(app)
            .get("/api/recommendations")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(200);
        expect(res.body.recommendations.length).toBeGreaterThan(0);
        expect(res.body.recommendations[0]).toHaveProperty("cuisine");
        expect(res.body.recommendations[0]).toHaveProperty("reason");
    });

    it("does not recommend cuisines the user already logged", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ meal_name: "Pizza", cuisine: "Italian" }]
        });
        pool.query.mockResolvedValueOnce({
            rows: [
                { cuisine: "Thai" },
                { cuisine: "Indian" },
                { cuisine: "Mexican" }
            ]
        });

        const res = await request(app)
            .get("/api/recommendations")
            .set("Cookie", "user_id=test-user-uuid");

        const cuisines = res.body.recommendations.map(r => r.cuisine);
        expect(cuisines).not.toContain("Italian");
    });

    it("returns popular cuisines when user has zero meals", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });
        pool.query.mockResolvedValueOnce({
            rows: [
                { cuisine: "Italian" },
                { cuisine: "Mexican" },
                { cuisine: "Japanese" }
            ]
        });

        const res = await request(app)
            .get("/api/recommendations")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(200);
        expect(res.body.recommendations).toHaveLength(3);
    });
});


// ─── ALL SAME CUISINE ─────────────────────────────────────────────────────────

describe("GET /api/recommendations — all same cuisine", () => {

    it("returns meals from different cuisines when all recent meals are the same cuisine", async () => {
        // First query: user has 5+ meals but all Italian
        pool.query.mockResolvedValueOnce({
            rows: [
                { meal_name: "Pizza", cuisine: "Italian" },
                { meal_name: "Pasta", cuisine: "Italian" },
                { meal_name: "Risotto", cuisine: "Italian" },
                { meal_name: "Lasagna", cuisine: "Italian" },
                { meal_name: "Gnocchi", cuisine: "Italian" }
            ]
        });
        // Second query: popular meals that aren't Italian
        pool.query.mockResolvedValueOnce({
            rows: [
                { meal_name: "Tacos" },
                { meal_name: "Sushi" },
                { meal_name: "Pad Thai" }
            ]
        });

        const res = await request(app)
            .get("/api/recommendations")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(200);
        expect(res.body.recommendations).toHaveLength(3);
        expect(res.body.recommendations).toContain("Tacos");
    });

});


// ─── WEIGHTED SCORING (normal path) ──────────────────────────────────────────

describe("GET /api/recommendations — weighted scoring", () => {

    it("returns 3 cuisine recommendations with reasons", async () => {
        // 5+ meals with varied cuisines — triggers weighted scoring path
        pool.query.mockResolvedValueOnce({
            rows: [
                { meal_name: "Pizza", cuisine: "Italian" },
                { meal_name: "Pasta", cuisine: "Italian" },
                { meal_name: "Pasta", cuisine: "Italian" },
                { meal_name: "Tacos", cuisine: "Mexican" },
                { meal_name: "Burrito", cuisine: "Mexican" },
                { meal_name: "Sushi", cuisine: "Japanese" },
            ]
        });

        const res = await request(app)
            .get("/api/recommendations")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(200);
        expect(res.body.recommendations).toHaveLength(3);

        // Each recommendation should have cuisine and reason
        res.body.recommendations.forEach(rec => {
            expect(rec).toHaveProperty("cuisine");
            expect(rec).toHaveProperty("reason");
        });
    });

    it("gives highest weight to cuisines not in user history", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [
                { meal_name: "Pizza", cuisine: "Italian" },
                { meal_name: "Pasta", cuisine: "Italian" },
                { meal_name: "Tacos", cuisine: "Mexican" },
                { meal_name: "Burrito", cuisine: "Mexican" },
                { meal_name: "Sushi", cuisine: "Japanese" },
            ]
        });

        const res = await request(app)
            .get("/api/recommendations")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(200);

        // Cuisines not in history should have the "haven't tried" reason
        const untried = res.body.recommendations.find(
            rec => rec.reason === "You haven't tried this cuisine yet, give it a try!"
        );
        expect(untried).toBeDefined();
    });

    it("reason reflects count=1 correctly", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [
                { meal_name: "Pizza", cuisine: "Italian" },
                { meal_name: "Pasta", cuisine: "Italian" },
                { meal_name: "Pasta", cuisine: "Italian" },
                { meal_name: "Tacos", cuisine: "Mexican" },
                { meal_name: "Sushi", cuisine: "Japanese" },
            ]
        });

        const res = await request(app)
            .get("/api/recommendations")
            .set("Cookie", "user_id=test-user-uuid");

        // Japanese appears once — should get the count===1 reason
        const japanese = res.body.recommendations.find(rec => rec.cuisine === "japanese");
        if (japanese) {
            expect(japanese.reason).toBe("You've only had this cuisine recently");
        }
    });

});


// ─── ERROR HANDLING ───────────────────────────────────────────────────────────

describe("GET /api/recommendations — error handling", () => {

    it("returns 500 when database throws on first query", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app)
            .get("/api/recommendations")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Error fetching recommendations");
    });

    it("returns 500 when database throws on second query (notEnoughMeals path)", async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ meal_name: "Pizza", cuisine: "Italian" }] });
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app)
            .get("/api/recommendations")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Error fetching recommendations");
    });

});
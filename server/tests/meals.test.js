import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

// Mock the database pool so no real DB calls happen in tests
vi.mock("../db.js", () => ({
    default: {
        query: vi.fn()
    }
}));

// Mock auth middleware so we don't need a real cookie in every test
vi.mock("../middleware/auth.js", () => ({
    requireUser: (req, res, next) => {
        req.userId = "test-user-uuid";
        next();
    }
}));

// Import pool AFTER mocking so we get the mocked version
import pool from "../db.js";

// Reset all mocks before each test so they don't bleed into each other
beforeEach(() => {
    vi.clearAllMocks();
});


// ─── GET /api/meals ───────────────────────────────────────────────────────────

describe("GET /api/meals", () => {

    it("returns meals for the authenticated user", async () => {
        // Arrange: tell the mock what the DB should return
        pool.query.mockResolvedValueOnce({
            rows: [
                { id: "meal-1", meal_name: "Pizza", cuisine: "Italian" },
                { id: "meal-2", meal_name: "Tacos", cuisine: "Mexican" }
            ]
        });

        // Act: make the request
        const res = await request(app)
            .get("/api/meals")
            .set("Cookie", "user_id=test-user-uuid");

        // Assert: check the response
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].meal_name).toBe("Pizza");
    });

    it("returns an empty array when user has no meals", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get("/api/meals")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });

    it("returns 500 when database throws an error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app)
            .get("/api/meals")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Error fetching meals");
    });

});


// ─── POST /api/meals ──────────────────────────────────────────────────────────

describe("POST /api/meals", () => {

    it("creates a meal with valid input", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] }); // INSERT doesn't return rows

        const res = await request(app)
            .post("/api/meals")
            .set("Cookie", "user_id=test-user-uuid")
            .send({ meal_name: "Pizza", cuisine: "Italian" });

        expect(res.status).toBe(200);
        expect(res.body.meal_name).toBe("Pizza");
        expect(res.body.cuisine).toBe("Italian");
        expect(res.body.id).toBeDefined(); // UUID was generated
    });

    it("returns 400 when cuisine is missing", async () => {
    const res = await request(app)
        .post("/api/meals")
        .set("Cookie", "user_id=test-user-uuid")
        .send({ meal_name: "Pizza" });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Bad Request");
});

    it("returns 400 when meal_name is missing", async () => {
        const res = await request(app)
            .post("/api/meals")
            .set("Cookie", "user_id=test-user-uuid")
            .send({ cuisine: "Italian" });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Bad Request");
    });

    it("returns 400 when meal_name is empty string", async () => {
        const res = await request(app)
            .post("/api/meals")
            .set("Cookie", "user_id=test-user-uuid")
            .send({ meal_name: "", cuisine: "Italian" });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Bad Request");
    });

    it("returns 500 when database throws an error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app)
            .post("/api/meals")
            .set("Cookie", "user_id=test-user-uuid")
            .send({ meal_name: "Pizza", cuisine: "Italian" });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Error adding meal");
    });

});


// ─── DELETE /api/meals/:id ────────────────────────────────────────────────────

describe("DELETE /api/meals/:id", () => {

    it("deletes a meal successfully", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .delete("/api/meals/meal-1")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("returns 404 when meal does not exist", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app)
            .delete("/api/meals/nonexistent-id")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Meal not found");
    });

    it("returns 500 when database throws an error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app)
            .delete("/api/meals/meal-1")
            .set("Cookie", "user_id=test-user-uuid");

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Error deleting meal");
    });

});


// ─── PUT /api/meals/:id ───────────────────────────────────────────────────────

describe("PUT /api/meals/:id", () => {

    it("updates a meal successfully", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .put("/api/meals/meal-1")
            .set("Cookie", "user_id=test-user-uuid")
            .send({ meal_name: "Updated Pizza", cuisine: "Italian" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("returns 404 when meal does not exist", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app)
            .put("/api/meals/nonexistent-id")
            .set("Cookie", "user_id=test-user-uuid")
            .send({ meal_name: "Updated Pizza", cuisine: "Italian" });

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Meal not found");
    });

    it("returns 400 when meal_name is missing", async () => {
        const res = await request(app)
            .put("/api/meals/meal-1")
            .set("Cookie", "user_id=test-user-uuid")
            .send({ cuisine: "Italian" });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Bad Request");
    });

    it("returns 500 when database throws an error", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app)
            .put("/api/meals/meal-1")
            .set("Cookie", "user_id=test-user-uuid")
            .send({ meal_name: "Updated Pizza", cuisine: "Italian" });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Error updating meal");
    });

});
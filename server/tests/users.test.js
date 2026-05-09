import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

vi.mock("../db.js", () => ({
    default: { query: vi.fn() }
}));

import pool from "../db.js";

beforeEach(() => {
    vi.clearAllMocks();
});


// ─── EXISTING SESSION ─────────────────────────────────────────────────────────

describe("GET /api/users — existing session", () => {

    it("returns existing user_id when cookie is present", async () => {
        const res = await request(app)
            .get("/api/users")
            .set("Cookie", "user_id=existing-uuid");

        expect(res.status).toBe(200);
        expect(res.body.user_id).toBe("existing-uuid");
    });

    it("does not insert into the database when cookie is present", async () => {
        await request(app)
            .get("/api/users")
            .set("Cookie", "user_id=existing-uuid");

        expect(pool.query).not.toHaveBeenCalled();
    });

});


// ─── NEW SESSION ──────────────────────────────────────────────────────────────

describe("GET /api/users — new session", () => {

    it("creates a new user and returns a user_id when no cookie exists", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get("/api/users");

        expect(res.status).toBe(200);
        expect(res.body.user_id).toBeDefined();
        expect(typeof res.body.user_id).toBe("string");
    });

    it("inserts a new user into the database when no cookie exists", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        await request(app)
            .get("/api/users");

        expect(pool.query).toHaveBeenCalledOnce();
        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO users (id) VALUES ($1)",
            [expect.any(String)]
        );
    });

    it("sets a user_id cookie on new session", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get("/api/users");

        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain("user_id=");
    });

    it("returns a valid UUID format for new user", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get("/api/users");

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(res.body.user_id).toMatch(uuidRegex);
    });

    it("generates a different UUID on each new session", async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const res1 = await request(app).get("/api/users");
        const res2 = await request(app).get("/api/users");

        expect(res1.body.user_id).not.toBe(res2.body.user_id);
    });

});


// ─── ERROR HANDLING ───────────────────────────────────────────────────────────

describe("GET /api/users — error handling", () => {

    it("returns 500 when database throws on insert", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app)
            .get("/api/users");

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Internal server error");
    });

    it("does not set a cookie when database insert fails", async () => {
        pool.query.mockRejectedValueOnce(new Error("DB connection failed"));

        const res = await request(app)
            .get("/api/users");

        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeUndefined();
    });

});
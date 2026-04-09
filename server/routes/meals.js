import express from "express";
import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET /api/meals -> get recent meals for the user
router.get("/", async (req, res) => {
    try {
        const userId = req.cookies.user_id;

        // If no user ID cookie, return 401 Unauthorized
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user session" });
        }

        const result = await pool.query(
            `SELECT * FROM meals
            WHERE user_id = $1
            and created_at > NOW() - INTERVAL '14 days'
            ORDER BY created_at DESC`,
            [userId]
        );

        res.json(result.rows);

    } catch (err) {
        console.error("Error fetching meals:", err);
        res.status(500).json({ error: "Error fetching meals" });
    }
});

// POST /api/meals -> add a new meal for the user
router.post("/", async (req, res) => {
    try {
        const userId = req.cookies.user_id;
        const { name, cuisine } = req.body;

        // If no user ID cookie, return 401 Unauthorized
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user session" });
        }

        // Validate required fields
        if (!name) {
            return res.status(400).json({ error: "Bad Request: Name is required" });
        }

        if (!cuisine) {
            return res.status(400).json({ error: "Bad Request: Cuisine is required" });
        }

        // Generate a new UUID for the meal
        const mealId = uuidv4();

        await pool.query(
            `INSERT INTO meals (id, user_id, name, cuisine)
            VALUES ($1, $2, $3, $4)`,
            [mealId, userId, name, cuisine || null]
        );

        res.json({ id: mealId, name, cuisine });

    } catch (err) {
        console.error("Error adding meal:", err);
        res.status(500).json({ error: "Error adding meal" });
    }
});

// DELETE /api/meals/:id -> delete a meal by ID
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.cookies.user_id;
        const { id } = req.params;

        // If no user ID cookie, return 401 Unauthorized
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user session" });
        }

        await pool.query(
            `DELETE FROM meals
            WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        res.json({ success: true });

    } catch (err) {
        console.error("Error deleting meal:", err);
        res.status(500).json({ error: "Error deleting meal" });
    }
});

// PUT /api/meals/:id -> update a meal by ID
router.put("/:id", async (req, res) => {
    try {
        const userId = req.cookies.user_id;
        const { id } = req.params;
        const { location, name, cuisine, rating, notes } = req.body;

        // If no user ID cookie, return 401 Unauthorized
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user session" });
        }

        // Validate required fields
        if (!name) {
            return res.status(400).json({ error: "Bad Request: Name is required" });
        }

        if (!cuisine) {
            return res.status(400).json({ error: "Bad Request: Cuisine is required" });
        }

        await pool.query(
            `UPDATE meals
            SET location = $1,
            name = $2,
            cuisine = $3,
            rating = $4,
            notes = $5
            WHERE id = $6 AND user_id = $7`,
            [location || null, name, cuisine, rating || null, notes || null, id, userId]
        );

        res.json({ success: true });

    } catch (err) {
        console.error("Error updating meal:", err);
        res.status(500).json({ error: "Error updating meal" });
    }
});

export default router;
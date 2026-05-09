import express from "express";
import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";
import { requireUser } from "../middleware/auth.js";
import { validateMealInput } from "../utils/validMealsInput.js";

const router = express.Router();

// GET /api/meals -> get recent meals for the user
router.get("/", requireUser, async (req, res) => {
    try {
        const userId = req.userId;

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
router.post("/", requireUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { meal_name, cuisine } = req.body;

        // Validate required fields
        const error = validateMealInput(meal_name, cuisine);
        if (error) {
            return res.status(400).json({ error: `Bad Request: ${error}` });
        }

        // Generate a new UUID for the meal
        const mealId = uuidv4();

        await pool.query(
            `INSERT INTO meals (id, user_id, meal_name, cuisine)
            VALUES ($1, $2, $3, $4)`,
            [mealId, userId, meal_name, cuisine || null]
        );

        res.json({ id: mealId, meal_name, cuisine });

    } catch (err) {
        console.error("Error adding meal:", err);
        res.status(500).json({ error: "Error adding meal" });
    }
});

// DELETE /api/meals/:id -> delete a meal by ID
router.delete("/:id", requireUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM meals
            WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Meal not found"});
        }

        res.json({ success: true });

    } catch (err) {
        console.error("Error deleting meal:", err);
        res.status(500).json({ error: "Error deleting meal" });
    }
});

// PUT /api/meals/:id -> update a meal by ID
router.put("/:id", requireUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { location, meal_name, cuisine, rating, notes } = req.body;

        // Validate required fields
        const error = validateMealInput(meal_name, cuisine);
        if (error) {
            return res.status(400).json({ error: `Bad Request: ${error}` });
        }

        const result = await pool.query(
            `UPDATE meals
            SET location = $1,
            meal_name = $2,
            cuisine = $3,
            rating = $4,
            notes = $5
            WHERE id = $6 AND user_id = $7`,
            [location || null, meal_name, cuisine, rating || null, notes || null, id, userId]
        );

        if(result.rowCount === 0) {
            return res.status(404).json({ error: "Meal not found"})
        }

        res.json({ success: true });

    } catch (err) {
        console.error("Error updating meal:", err);
        res.status(500).json({ error: "Error updating meal" });
    }
});

export default router;
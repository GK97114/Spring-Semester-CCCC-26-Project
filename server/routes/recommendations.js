// Goal: Recommend meals based on user meal history and cuisine preferences

const express = require("express");
const router = express.Router();
const pool = require("../db");
const { requireUser } = require("../middleware/auth");
const { CUISINES_MASTER_LIST } = require("../utils/cuisinesMasterList");

router.get("/", requireUser, async (req, res) => {
    try {
        // Inputs
        const { userId } = req.user;

        // Get Recent meals from last 7 to 14 days
        const result = await pool.query(
            `SELECT meal_name, cuisine FROM meals
            WHERE user_id = $1
            AND created_at >= CURRENT_DATE - INTERVAL '14 days'`,
            [userId]
        );
        const recentMeals = result.rows;

        // Handle edge cases and default to popular cuisines for less than 7 days of meals
        const uniqueCuisines = new Set(recentMeals.map(meal => meal.cuisine));

        const notEnoughMeals = recentMeals.length < 5;

        // Recommend the most popular cuisines from the table if user has less than 5 meals
        if (notEnoughMeals) {
            const popularResult = await pool.query(
                `SELECT cuisine, COUNT(*) as count FROM meals
                GROUP BY cuisine
                ORDER BY count DESC
                LIMIT 3`
            );
            return res.json({ recommendations: popularResult.rows.map(row => row.cuisine) });
        }

        // Recommend popular meals that do not include the user's current same cuisine if all meals are the same cuisine
        if (uniqueCuisines.size === 1) {
            const userCuisine = recentMeals[0].cuisine;
            const popularResult = await pool.query(
                `SELECT meal_name FROM meals
                WHERE cuisine != $1
                GROUP BY meal_name
                ORDER BY COUNT(*) DESC
                LIMIT 3`
                , [userCuisine]
            );
            return res.json({ recommendations: popularResult.rows.map(row => row.meal_name) });
        };

        // count cuisine types
        const cuisineCounts = {};
        recentMeals.forEach((meal) => {
            const cuisine = (meal.cuisine || "other").toLowerCase();
            cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
        });

        // Check against imported master list of cuisines and handle unknown cuisines
        const validCuisineCounts = {};
        const VALID_CUISINES = Object.values(CUISINES_MASTER_LIST).map(cuisine => cuisine.toLowerCase());

        for (const cuisine in cuisineCounts) {
            // If cuisine is in master list, keep it. Otherwise, categorize it as "other"
            if (VALID_CUISINES.includes(cuisine)) {
                validCuisineCounts[cuisine] = cuisineCounts[cuisine];
            } else {
                validCuisineCounts["other"] = (validCuisineCounts["other"] || 0) + cuisineCounts[cuisine];
            }
        }

        // compare user cuisine types to master list

        // Weight cuisines based on frequency

        // Return weighted list of cuisines for recommendations and return top 3 cuisines for recommendations

    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ error: "Error fetching recommendations" });
    }
});
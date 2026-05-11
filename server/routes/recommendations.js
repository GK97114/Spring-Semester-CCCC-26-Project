// Goal: Recommend meals based on user meal history and cuisine preferences

import express from "express";
import pool from "../db.js";
import { requireUser } from "../middleware/auth.js";
import { CUISINES_MASTER_LIST } from "../utils/cuisinesMasterList.js";

const router = express.Router();

router.get("/", requireUser, async (req, res) => {
    try {
        // Inputs
        const userId = req.userId;    // Get userId from request object (set by requireUser middleware)

        // Get Recent meals from last 7 to 14 days
        const result = await pool.query(
            `SELECT meal_name, cuisine FROM meals
            WHERE user_id = $1
            AND eaten_on >= CURRENT_DATE - INTERVAL '14 days'`,
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
                WHERE user_id != $1
                GROUP BY cuisine
                ORDER BY count DESC
                LIMIT 3`,
                [userId]
            );

            // If no other users exist, fall back to master list
            if (popularResult.rows.length === 0) {
                const { CUISINES_MASTER_LIST } = await import("../utils/cuisinesMasterList.js");
                const fallback = Object.values(CUISINES_MASTER_LIST).slice(0, 3);
                return res.json({
                    recommendations: fallback.map(cuisine => ({
                        cuisine,
                        reason: "A popular cuisine to try!"
                    }))
                });
            }

            return res.json({
                recommendations: popularResult.rows.map(row => ({
                    cuisine: row.cuisine,
                    reason: "Trending with other users!"
                }))
            });
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
            const cuisine = (meal.cuisine || "other").toLowerCase().trim();
            cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
        });

        // Check against imported master list of cuisines and handle unknown cuisines
        const validCuisineCounts = {};
        const VALID_CUISINES_SET = new Set(Object.values(CUISINES_MASTER_LIST).map(c => c.toLowerCase()));

        for (const cuisine in cuisineCounts) {
            // If cuisine is in master list, keep it. Otherwise, categorize it as "other"
            if (VALID_CUISINES_SET.has(cuisine)) {
                validCuisineCounts[cuisine] = cuisineCounts[cuisine];
            } else {
                validCuisineCounts["other"] = (validCuisineCounts["other"] || 0) + cuisineCounts[cuisine];
            }
        }

        // Ensure all cuisines from master list are represented in the counts, even if they are 0
        Object.values(CUISINES_MASTER_LIST).forEach(cuisine => {
            const cuisineKey = cuisine.toLowerCase();
            if (!validCuisineCounts[cuisineKey]) {
                validCuisineCounts[cuisineKey] = 0;
            }
        });

        // Weight cuisines based on frequency
        // More frequent cuisines get lower weight, less frequent cuisines get higher weight to encourage variety
        // Cuisine not in user's history gets highest weight to encourage trying new cuisines
        const maxCount = Math.max(...Object.values(validCuisineCounts));

        const weightedCuisines = Object.entries(validCuisineCounts).map(([cuisine, count]) => ({
            cuisine,
            weight: maxCount - count
        }));

        // Return weighted list of cuisines for recommendations and return top 3 cuisines for recommendations
        // Cuisine that is common will have lower weight 
        // Cuisine that is less common will have higher weight to encourage variety in recommendations
        const sortedCuisines = weightedCuisines.sort((a, b) => b.weight - a.weight);

        const recommendations = sortedCuisines
            .filter(item => item.cuisine !== "other")
            .slice(0, 3)
            .map(({ cuisine }) => {
                let reason = "";
                const count = validCuisineCounts[cuisine];

                // Provide reasoning for recommendations based on user's meal history
                if (count === 0) {
                    reason = "You haven't tried this cuisine yet, give it a try!";
                } else if (count === 1) {
                    reason = "You've only had this cuisine recently";
                } else {
                    reason = "You've had this cuisine less than the others";
                }
                
                return { cuisine, reason };
        });

        return res.json({ recommendations });

    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ error: "Error fetching recommendations" });
    }
});

export default router;
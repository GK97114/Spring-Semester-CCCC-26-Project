import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db.js';

const router = express.Router();

// GET /api/users
router.get('/', async (req, res) => {
    try {
        let userId = req.cookies.user_id;

        // Check if user has a cookie
        if (userId) {
            // if yes, return that user
            return res.json({ user_id: userId });
        }

        // If no, create a new UUID
        userId = uuidv4();

        // Insert into users table
        await pool.query(
            'INSERT INTO users (id) VALUES ($1)',
            [userId]
        );

        // Set Cookie with the new UUID
        res.cookie("user_id", userId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        });

        // return the new user
        res.json({ user_id: userId });

    } catch (err) {
        console.error("Error handling user cookie", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
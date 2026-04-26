import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import pool from "./db";
import userRoutes from "./routes/users.js";
import recommendationRoutes from "./routes/recommendations.js";
import mealRoutes from "./routes/meals.js";

const app = express();

// CORS configuration to allow requests from the frontend and enable cookies for session management
app.use(cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    credentials: true, // Allow cookies to be sent
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/meals", mealRoutes);

// Start the server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
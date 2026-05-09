import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import userRoutes from "./routes/users.js";
import recommendationRoutes from "./routes/recommendations.js";
import mealRoutes from "./routes/meals.js";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGIN
    ? [process.env.ALLOWED_ORIGIN]
    : ["http://localhost:5173"];

// CORS configuration to allow requests from the frontend and enable cookies for session management
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/meals", mealRoutes);

export default app;
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import pool from "./db";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    credentials: true, // Allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
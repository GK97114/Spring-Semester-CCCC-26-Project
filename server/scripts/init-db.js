import pool from "../db.js";
import fs from "fs";

const initDb = async () => {
    try {
        const sql = fs.readFileSync("./server/migrations/init.sql", "utf-8");
        await pool.query(sql);
        console.log("Database initialized successfully");
    } catch (err) {
        console.error("Error initializing database", err);
    } finally {
        process.exit();
    }
};

initDb();
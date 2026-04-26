import pkg from 'pg';
import dotenv from 'dotenv';
// Immediately load environment variables before creating the pool
dotenv.config();

const { Pool } = pkg;

// Pool configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test the connection
pool.connect()
    .then(() => console.log("Connected to PostgreSQL database"))
    .catch(err => console.error("Error connecting to PostgreSQL database", err));

export default pool;
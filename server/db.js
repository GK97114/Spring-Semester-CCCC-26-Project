import pkg from 'pg';
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
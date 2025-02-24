const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

pool.connect((err) => {
    if (err) {
        console.error("❌ PostgreSQL Connection Failed:", err);
    } else {
        console.log("✅ Connected to Supabase PostgreSQL");
    }
});

module.exports = pool;

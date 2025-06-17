const { Pool } = require('pg');

// Get the DATABASE_URL from environment variables
const databaseUrl = process.env.DATABASE_URL || 'postgresql://coffee_lab_user:jz5x00jzGHaKyrqDWehqfsCu6vRb688b@dpg-d18qgkruibrs73duejs0-a.frankfurt-postgres.render.com/coffee_lab_db_dldc';

// Create a new pool using the connection string
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Export the pool for use in other modules
module.exports = pool;

const { Pool } = require('pg');

// Get the DATABASE_URL from environment variables
const databaseUrl = process.env.DATABASE_URL || 'postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a/coffee_lab_db_lyf9';

// Create a new pool using the connection string
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Export the pool for use in other modules
module.exports = pool;

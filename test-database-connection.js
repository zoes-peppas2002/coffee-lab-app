/**
 * Test Database Connection Script
 * 
 * This script tests the connection to the PostgreSQL database on Render.
 */

require('dotenv').config({ path: './backend/.env.production' });
const { Pool } = require('pg');

console.log('='.repeat(60));
console.log('COFFEE LAB - TEST DATABASE CONNECTION');
console.log('='.repeat(60));

// Log the DATABASE_URL for debugging (without the password)
const dbUrlForLogging = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL.replace(/:[^:]*@/, ':***@') 
  : 'Not set';
console.log('PostgreSQL connection string:', dbUrlForLogging);

// Create a connection pool with the DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the database connection
async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Successfully connected to PostgreSQL database at:', res.rows[0].now);
    
    // Check if the users table exists
    try {
      const usersRes = await pool.query('SELECT * FROM users LIMIT 1');
      console.log('✅ Users table exists with', usersRes.rowCount, 'rows');
      
      if (usersRes.rows.length > 0) {
        console.log('Sample user:', JSON.stringify(usersRes.rows[0], null, 2));
      }
    } catch (tableErr) {
      console.error('❌ Error querying users table:', tableErr.message);
      
      // Create the users table if it doesn't exist
      try {
        console.log('Creating users table...');
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Users table created successfully');
        
        // Insert a default admin user
        await pool.query(`
          INSERT INTO users (name, email, password, role)
          VALUES ('Admin', 'zp@coffeelab.gr', 'Zoespeppas2025!', 'admin')
          ON CONFLICT (email) DO NOTHING
        `);
        console.log('✅ Default admin user created');
      } catch (createErr) {
        console.error('❌ Error creating users table:', createErr.message);
      }
    }
    
    // Close the connection pool
    await pool.end();
  } catch (err) {
    console.error('❌ Error connecting to PostgreSQL database:', err.message);
    console.error('Database URL format might be incorrect.');
    
    // Try to parse the DATABASE_URL to check for format issues
    try {
      const url = new URL(process.env.DATABASE_URL);
      console.log('URL protocol:', url.protocol);
      console.log('URL hostname:', url.hostname);
      console.log('URL pathname:', url.pathname);
    } catch (parseErr) {
      console.error('❌ Error parsing DATABASE_URL:', parseErr.message);
    }
  }
}

// Run the test
testConnection();

/**
 * Test Render PostgreSQL Connection
 * 
 * This script tests the connection to the Render PostgreSQL database.
 */
const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env.production') });

console.log('=================================================');
console.log('COFFEE LAB - TEST RENDER POSTGRESQL CONNECTION');
console.log('=================================================');
console.log('This script will test the connection to the Render PostgreSQL database.');
console.log('');

// Get the DATABASE_URL from environment variables
const databaseUrl = "postgresql://coffee_lab_user:jz5x00jzGHaKyrqDWehqfsCu6vRb688b@dpg-d18qgkruibrs73duejs0-a.frankfurt-postgres.render.com/coffee_lab_db_dldc";

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not defined in the .env.production file.');
  console.error('Please make sure the .env.production file exists and contains the DATABASE_URL variable.');
  process.exit(1);
}

console.log('Using DATABASE_URL:', databaseUrl.replace(/:[^:]*@/, ':****@')); // Hide password in logs

// Create a new client
const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

// Connect to the database
async function testConnection() {
  try {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL database!');
    
    // Test query
    console.log('Running test query...');
    const result = await client.query('SELECT NOW() as now');
    console.log('✅ Query successful! Current time on server:', result.rows[0].now);
    
    // List tables
    console.log('\nListing database tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Tables in the database:');
      tablesResult.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
    }
    
    // Test users table
    console.log('\nChecking users table...');
    try {
      const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
      console.log(`✅ Users table exists with ${usersResult.rows[0].count} records.`);
      
      // Check admin user
      const adminResult = await client.query("SELECT * FROM users WHERE email = 'zp@coffeelab.gr'");
      if (adminResult.rows.length > 0) {
        console.log('✅ Admin user exists:', adminResult.rows[0].name);
      } else {
        console.log('⚠️ Admin user not found!');
      }
    } catch (err) {
      console.error('❌ Error checking users table:', err.message);
    }
    
    console.log('\n✅ Connection test completed successfully!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('Error details:', err);
  } finally {
    await client.end();
  }
}

// Run the test
testConnection();

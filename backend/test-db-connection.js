/**
 * Test Database Connection
 * 
 * This script tests the connection to the database.
 */
const fs = require('fs');
const path = require('path');

// Set NODE_ENV to production
process.env.NODE_ENV = 'production';

// Set DATABASE_URL with external hostname
process.env.DATABASE_URL = 'postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a.frankfurt-postgres.render.com/coffee_lab_db_lyf9';

// Get the appropriate pool
const pool = require('./db-pg');

async function testConnection() {
  console.log('=================================================');
  console.log('COFFEE LAB - TEST DATABASE CONNECTION');
  console.log('=================================================');
  console.log('');
  
  try {
    console.log('Testing connection to the database...');
    console.log('Using connection string with external hostname:');
    console.log(process.env.DATABASE_URL);
    
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log(`Current database time: ${result.rows[0].now}`);
    
    // List all tables
    console.log('\nListing all tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Tables in the database:');
      tablesResult.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
    return true;
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the test
testConnection().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});

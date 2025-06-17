/**
 * Test Local MySQL Connection
 * 
 * This script tests the connection to the local MySQL database.
 */
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

console.log('=================================================');
console.log('COFFEE LAB - TEST LOCAL MYSQL CONNECTION');
console.log('=================================================');
console.log('This script will test the connection to the local MySQL database.');
console.log('');

// Define the database connection parameters
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Zoespeppas2025!',
  database: 'coffee_lab_db'
};

console.log('Using database configuration:');
console.log('- Host:', dbConfig.host);
console.log('- User:', dbConfig.user);
console.log('- Database:', dbConfig.database);
console.log('');

// Test the connection
async function testConnection() {
  let connection;
  
  try {
    console.log('Connecting to MySQL database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database!');
    
    // Test query
    console.log('Running test query...');
    const [result] = await connection.query('SELECT NOW() as now');
    console.log('✅ Query successful! Current time on server:', result[0].now);
    
    // List tables
    console.log('\nListing database tables...');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Tables in the database:');
      tables.forEach((row, index) => {
        const tableName = Object.values(row)[0];
        console.log(`${index + 1}. ${tableName}`);
      });
    }
    
    // Test users table
    console.log('\nChecking users table...');
    try {
      const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
      console.log(`✅ Users table exists with ${users[0].count} records.`);
      
      // Check admin user
      const [admin] = await connection.query("SELECT * FROM users WHERE email = 'zp@coffeelab.gr'");
      if (admin.length > 0) {
        console.log('✅ Admin user exists:', admin[0].name);
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
    if (connection) {
      await connection.end();
    }
  }
}

// Run the test
testConnection();

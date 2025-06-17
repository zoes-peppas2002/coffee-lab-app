/**
 * Fix Users Table Schema
 * 
 * This script fixes the users table schema in the database.
 * It adds the 'name' column if it doesn't exist.
 */
const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

console.log('=================================================');
console.log('COFFEE LAB - FIX USERS TABLE SCHEMA');
console.log('=================================================');
console.log('This script will fix the users table schema in the database.');
console.log('');

// Define the database connection options
const connectionOptions = [
  {
    name: "Render PostgreSQL (External)",
    url: "postgresql://coffee_lab_user:JZBtkeHcgpITKIKBJj6Dw7M4eAIMgh2r@dpg-d17f1iemcj7s73d4rhb0-a/coffee_lab_db_lyf9",
    ssl: { rejectUnauthorized: false }
  },
  {
    name: "Render PostgreSQL (Internal)",
    url: "postgresql://coffee_lab_user:JZBtkeHcgpITKIKBJj6Dw7M4eAIMgh2r@dpg-d17f1iemcj7s73d4rhb0-a/coffee_lab_db_lyf9",
    ssl: { rejectUnauthorized: false }
  }
];

// Function to fix the users table schema
async function fixUsersTableSchema() {
  console.log('Fixing users table schema...');
  
  let successfulConnections = 0;
  
  // Try each connection option
  for (const option of connectionOptions) {
    console.log(`\nTrying connection: ${option.name}`);
    console.log(`URL: ${option.url}`);
    console.log(`SSL: ${option.ssl ? 'Enabled' : 'Disabled'}`);
    
    try {
      const pool = new Pool({
        connectionString: option.url,
        ssl: option.ssl
      });
      
      // Test the connection
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Connection successful!');
      console.log(`Current database time: ${result.rows[0].now}`);
      
      // Check if the users table exists
      const tableResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
      
      if (!tableResult.rows[0].exists) {
        console.log('❌ Users table does not exist. Creating it...');
        
        // Create the users table
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            role VARCHAR(50) NOT NULL,
            active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        
        console.log('✅ Users table created successfully.');
      } else {
        console.log('✅ Users table exists.');
      }
      
      // Check if the name column exists
      const columnResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'users' 
          AND column_name = 'name'
        );
      `);
      
      if (!columnResult.rows[0].exists) {
        console.log('❌ Name column does not exist. Adding it...');
        
        // Add the name column
        await pool.query(`
          ALTER TABLE users ADD COLUMN name VARCHAR(255);
        `);
        
        console.log('✅ Name column added successfully.');
        
        // Update existing users to set the name column
        await pool.query(`
          UPDATE users SET name = 'Admin' WHERE email = 'zp@coffeelab.gr';
        `);
        
        console.log('✅ Updated existing users with name values.');
      } else {
        console.log('✅ Name column exists.');
      }
      
      // Check if the username column exists
      const usernameColumnResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'users' 
          AND column_name = 'username'
        );
      `);
      
      if (!usernameColumnResult.rows[0].exists) {
        console.log('❌ Username column does not exist. Adding it...');
        
        // Add the username column
        await pool.query(`
          ALTER TABLE users ADD COLUMN username VARCHAR(255);
        `);
        
        console.log('✅ Username column added successfully.');
        
        // Update existing users to set the username column
        await pool.query(`
          UPDATE users SET username = email WHERE username IS NULL;
        `);
        
        console.log('✅ Updated existing users with username values.');
        
        // Add unique constraint to username column
        await pool.query(`
          ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);
        `);
        
        console.log('✅ Added unique constraint to username column.');
      } else {
        console.log('✅ Username column exists.');
      }
      
      // List all columns in the users table
      const columnsResult = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users';
      `);
      
      console.log('\nColumns in the users table:');
      columnsResult.rows.forEach(row => {
        console.log(`- ${row.column_name} (${row.data_type})`);
      });
      
      // Close the connection pool
      await pool.end();
      
      successfulConnections++;
    } catch (err) {
      console.error(`❌ Connection failed: ${err.message}`);
    }
  }
  
  console.log('\n=================================================');
  console.log('USERS TABLE SCHEMA FIX RESULTS');
  console.log('=================================================');
  console.log(`Successful connections: ${successfulConnections}/${connectionOptions.length}`);
  
  if (successfulConnections > 0) {
    console.log('\n✅ Users table schema fixed successfully!');
    return true;
  } else {
    console.log('\n❌ Failed to fix users table schema.');
    return false;
  }
}

// Run the function
fixUsersTableSchema()
  .then(success => {
    if (!success) {
      console.log('\nPossible issues:');
      console.log('1. The database credentials may be incorrect');
      console.log('2. The database server may be down or unreachable');
      console.log('3. There may be network issues preventing the connection');
      console.log('4. The database may have been deleted or renamed');
    }
  })
  .catch(err => {
    console.error('❌ Unhandled error:', err);
  });

/**
 * Fix User Management Issues
 * 
 * This script fixes issues with user management in both MySQL and PostgreSQL databases.
 */
const { Pool } = require('pg');
const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('=================================================');
console.log('COFFEE LAB - FIX USER MANAGEMENT ISSUES');
console.log('=================================================');
console.log('This script will fix issues with user management in the database.');
console.log('');

// Determine if we're using PostgreSQL or MySQL
const isPg = process.env.NODE_ENV === 'production';
console.log(`Using ${isPg ? 'PostgreSQL' : 'MySQL'} database`);

async function fixUserManagement() {
  try {
    if (isPg) {
      // PostgreSQL
      const pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });

      console.log('Connected to PostgreSQL database');
      
      // Check if users table exists
      const tableResult = await pgPool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
      
      if (!tableResult.rows[0].exists) {
        console.error('❌ Users table does not exist in PostgreSQL database');
        return;
      }
      
      console.log('✅ Users table exists in PostgreSQL database');
      
      // Check if name column exists
      const columnResult = await pgPool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'users' 
          AND column_name = 'name'
        );
      `);
      
      if (!columnResult.rows[0].exists) {
        console.log('❌ Name column does not exist. Adding it...');
        await pgPool.query(`ALTER TABLE users ADD COLUMN name VARCHAR(255);`);
        console.log('✅ Name column added successfully');
        
        // Update existing users with name values
        await pgPool.query(`
          UPDATE users 
          SET name = CASE 
            WHEN email = 'zp@coffeelab.gr' THEN 'Admin'
            ELSE SPLIT_PART(email, '@', 1)
          END
          WHERE name IS NULL;
        `);
        console.log('✅ Updated existing users with name values');
      } else {
        console.log('✅ Name column exists');
      }
      
      // List all users
      const usersResult = await pgPool.query('SELECT * FROM users');
      console.log(`Found ${usersResult.rows.length} users in PostgreSQL database:`);
      usersResult.rows.forEach(user => {
        console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
      
      // Close the connection
      await pgPool.end();
      
    } else {
      // MySQL
      const mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Zoespeppas2025!',
        database: process.env.DB_NAME || 'coffee_lab_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      
      console.log('Connected to MySQL database');
      
      // Check if users table exists
      const [tables] = await mysqlPool.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = ? 
        AND table_name = 'users'
      `, [process.env.DB_NAME || 'coffee_lab_db']);
      
      if (tables[0].count === 0) {
        console.error('❌ Users table does not exist in MySQL database');
        return;
      }
      
      console.log('✅ Users table exists in MySQL database');
      
      // Check if name column exists
      const [columns] = await mysqlPool.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.columns 
        WHERE table_schema = ? 
        AND table_name = 'users' 
        AND column_name = 'name'
      `, [process.env.DB_NAME || 'coffee_lab_db']);
      
      if (columns[0].count === 0) {
        console.log('❌ Name column does not exist. Adding it...');
        await mysqlPool.query(`ALTER TABLE users ADD COLUMN name VARCHAR(255);`);
        console.log('✅ Name column added successfully');
        
        // Update existing users with name values
        await mysqlPool.query(`
          UPDATE users 
          SET name = CASE 
            WHEN email = 'zp@coffeelab.gr' THEN 'Admin'
            ELSE SUBSTRING_INDEX(email, '@', 1)
          END
          WHERE name IS NULL;
        `);
        console.log('✅ Updated existing users with name values');
      } else {
        console.log('✅ Name column exists');
      }
      
      // List all users
      const [users] = await mysqlPool.query('SELECT * FROM users');
      console.log(`Found ${users.length} users in MySQL database:`);
      users.forEach(user => {
        console.log(`- ID: ${user.id}, Name: ${user.name || 'NULL'}, Email: ${user.email}, Role: ${user.role}`);
      });
      
      // Close the connection
      await mysqlPool.end();
    }
    
    console.log('');
    console.log('=================================================');
    console.log('USER MANAGEMENT FIX RESULTS');
    console.log('=================================================');
    console.log('✅ User management issues fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing user management issues:', error);
  }
}

// Run the function
fixUserManagement();

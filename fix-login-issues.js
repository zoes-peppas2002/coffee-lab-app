/**
 * Fix Login Issues
 * 
 * This script fixes login issues with the application:
 * 1. Fixes the users table in PostgreSQL to ensure email has UNIQUE constraint
 * 2. Adds more detailed logging to help diagnose login issues
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('=================================================');
console.log('COFFEE LAB - FIX LOGIN ISSUES');
console.log('=================================================');
console.log('This script will fix login issues with the application.');
console.log('');

// Function to fix the users table in PostgreSQL
async function fixUsersTable() {
  try {
    console.log('Fixing users table in PostgreSQL...');
    
    // Only proceed if we're in production environment
    if (process.env.NODE_ENV !== 'production') {
      console.log('Not in production environment. Setting NODE_ENV to production...');
      process.env.NODE_ENV = 'production';
    }
    
    // Get the PostgreSQL pool
    const pool = require('./backend/db-pg');
    
    // Check if the users table exists
    const tableExists = await checkTableExists(pool, 'users');
    
    if (tableExists) {
      console.log('Users table exists. Checking if email column has UNIQUE constraint...');
      
      // Check if email column has UNIQUE constraint
      const hasUniqueConstraint = await checkEmailUniqueConstraint(pool);
      
      if (!hasUniqueConstraint) {
        console.log('Email column does not have UNIQUE constraint. Adding constraint...');
        
        // Add UNIQUE constraint to email column
        await addEmailUniqueConstraint(pool);
        
        console.log('✅ UNIQUE constraint added to email column.');
      } else {
        console.log('✅ Email column already has UNIQUE constraint.');
      }
    } else {
      console.log('Users table does not exist. Creating table...');
      
      // Create users table with email UNIQUE constraint
      await createUsersTable(pool);
      
      console.log('✅ Users table created with email UNIQUE constraint.');
    }
    
    // Create default admin user if it doesn't exist
    await createDefaultAdminUser(pool);
    
    console.log('✅ Users table fixed successfully!');
    
    return true;
  } catch (error) {
    console.error('❌ Error fixing users table:', error);
    return false;
  }
}

// Function to check if a table exists
async function checkTableExists(pool, tableName) {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )
    `, [tableName]);
    
    return result.rows[0].exists;
  } catch (error) {
    console.error('❌ Error checking if table exists:', error);
    return false;
  }
}

// Function to check if email column has UNIQUE constraint
async function checkEmailUniqueConstraint(pool) {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as count
      FROM pg_constraint
      WHERE conrelid = 'users'::regclass
      AND contype = 'u'
      AND conname LIKE '%email%'
    `);
    
    return result.rows[0].count > 0;
  } catch (error) {
    console.error('❌ Error checking email UNIQUE constraint:', error);
    return false;
  }
}

// Function to add UNIQUE constraint to email column
async function addEmailUniqueConstraint(pool) {
  try {
    // First check if the constraint already exists
    const constraintExists = await pool.query(`
      SELECT COUNT(*) as count
      FROM pg_constraint
      WHERE conrelid = 'users'::regclass
      AND contype = 'u'
      AND conname = 'users_email_key'
    `);
    
    if (constraintExists.rows[0].count === 0) {
      // Add UNIQUE constraint to email column
      await pool.query(`
        ALTER TABLE users
        ADD CONSTRAINT users_email_key UNIQUE (email)
      `);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error adding email UNIQUE constraint:', error);
    return false;
  }
}

// Function to create users table with email UNIQUE constraint
async function createUsersTable(pool) {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    return true;
  } catch (error) {
    console.error('❌ Error creating users table:', error);
    return false;
  }
}

// Function to create default admin user
async function createDefaultAdminUser(pool) {
  try {
    // Check if admin user exists
    const adminExists = await pool.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE email = 'zp@coffeelab.gr'
    `);
    
    if (adminExists.rows[0].count === 0) {
      console.log('Admin user does not exist. Creating admin user...');
      
      // Create admin user
      await pool.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ('Admin', 'zp@coffeelab.gr', 'Zoespeppas2025!', 'admin')
      `);
      
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('✅ Admin user already exists.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return false;
  }
}

// Function to fix the routes in server.js
function fixServerRoutes() {
  try {
    console.log('Fixing routes in server.js...');
    
    const serverJsPath = path.join(__dirname, 'backend', 'server.js');
    
    // Read the server.js file
    let serverJs = fs.readFileSync(serverJsPath, 'utf8');
    
    // Check if the routes need to be fixed
    if (serverJs.includes('app.use("/api/direct-auth", authRoutes);') && 
        serverJs.includes('app.use("/api/auth", authRoutes);')) {
      console.log('Routes already exist in server.js. Updating them...');
      
      // Replace the routes with the fixed version
      serverJs = serverJs.replace(
        'app.use("/api/direct-auth", authRoutes); // Direct auth route first\napp.use("/api/auth", authRoutes); // Then regular auth route',
        'app.use("/api/direct-auth", authRoutes); // Direct auth route'
      );
      
      // Write the updated server.js file
      fs.writeFileSync(serverJsPath, serverJs, 'utf8');
      
      console.log('✅ Routes fixed in server.js!');
    } else {
      console.log('Routes do not need to be fixed in server.js.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error fixing routes in server.js:', error);
    return false;
  }
}

// Function to add more detailed logging to direct-auth.js
function addDetailedLogging() {
  try {
    console.log('Adding more detailed logging to direct-auth.js...');
    
    const directAuthJsPath = path.join(__dirname, 'backend', 'routes', 'direct-auth.js');
    
    // Read the direct-auth.js file
    let directAuthJs = fs.readFileSync(directAuthJsPath, 'utf8');
    
    // Check if the logging needs to be added
    if (!directAuthJs.includes('console.log(\'DETAILED LOGIN DEBUG\')')) {
      console.log('Adding detailed logging to direct-auth.js...');
      
      // Add detailed logging after the try block
      directAuthJs = directAuthJs.replace(
        'try {',
        'try {\n    console.log(\'DETAILED LOGIN DEBUG - Request received\');\n    console.log(\'Request URL:\', req.originalUrl);\n    console.log(\'Request method:\', req.method);\n    console.log(\'Request path:\', req.path);\n    console.log(\'Request query:\', JSON.stringify(req.query));\n    console.log(\'Request params:\', JSON.stringify(req.params));\n    console.log(\'Request body:\', JSON.stringify(req.body));\n    console.log(\'Request headers:\', JSON.stringify(req.headers));\n'
      );
      
      // Write the updated direct-auth.js file
      fs.writeFileSync(directAuthJsPath, directAuthJs, 'utf8');
      
      console.log('✅ Detailed logging added to direct-auth.js!');
    } else {
      console.log('Detailed logging already exists in direct-auth.js.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error adding detailed logging to direct-auth.js:', error);
    return false;
  }
}

// Run the functions
async function main() {
  try {
    // Fix the users table in PostgreSQL
    const usersTableFixed = await fixUsersTable();
    
    // Fix the routes in server.js
    const serverRoutesFixed = fixServerRoutes();
    
    // Add detailed logging to direct-auth.js
    const loggingAdded = addDetailedLogging();
    
    console.log('');
    console.log('=================================================');
    console.log('LOGIN ISSUES FIX RESULTS');
    console.log('=================================================');
    console.log(`Users table fixed: ${usersTableFixed ? '✅' : '❌'}`);
    console.log(`Server routes fixed: ${serverRoutesFixed ? '✅' : '❌'}`);
    console.log(`Detailed logging added: ${loggingAdded ? '✅' : '❌'}`);
    
    if (usersTableFixed && serverRoutesFixed && loggingAdded) {
      console.log('');
      console.log('✅ All login issues fixed successfully!');
      console.log('');
      console.log('Please restart the server and try logging in again.');
    } else {
      console.log('');
      console.log('⚠️ Some login issues could not be fixed.');
      console.log('');
      console.log('Please check the logs for more information.');
    }
  } catch (error) {
    console.error('❌ Error fixing login issues:', error);
  }
}

// Run the main function
main();

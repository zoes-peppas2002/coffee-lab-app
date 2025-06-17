/**
 * Fix Email Constraint in PostgreSQL
 * 
 * This script fixes the issue with the email constraint being skipped in PostgreSQL.
 * It adds the UNIQUE constraint to the email column in the users table.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('=================================================');
console.log('COFFEE LAB - FIX EMAIL CONSTRAINT IN POSTGRESQL');
console.log('=================================================');
console.log('This script will fix the email constraint issue in PostgreSQL.');
console.log('');

async function fixEmailConstraint() {
  try {
    // Set NODE_ENV to production to use PostgreSQL
    process.env.NODE_ENV = 'production';
    
    // Get the PostgreSQL pool
    const pool = require('./backend/db-pg');
    
    console.log('Checking if users table exists...');
    
    // Check if the users table exists
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tableExists = tableCheckResult.rows[0].exists;
    
    if (!tableExists) {
      console.error('❌ Users table does not exist!');
      return false;
    }
    
    console.log('✅ Users table exists.');
    
    // Check if email column has UNIQUE constraint
    console.log('Checking if email column has UNIQUE constraint...');
    
    const constraintCheckResult = await pool.query(`
      SELECT COUNT(*) FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu 
      ON tc.constraint_name = ccu.constraint_name
      WHERE tc.constraint_type = 'UNIQUE' 
      AND tc.table_name = 'users' 
      AND ccu.column_name = 'email';
    `);
    
    const constraintExists = parseInt(constraintCheckResult.rows[0].count) > 0;
    
    if (constraintExists) {
      console.log('✅ Email column already has UNIQUE constraint.');
      return true;
    }
    
    console.log('Adding UNIQUE constraint to email column...');
    
    // Add UNIQUE constraint to email column
    try {
      await pool.query(`
        ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
      `);
      console.log('✅ UNIQUE constraint added to email column.');
    } catch (error) {
      // If the constraint already exists, this is fine
      if (error.message.includes('already exists')) {
        console.log('✅ UNIQUE constraint already exists.');
      } else {
        console.error('❌ Error adding UNIQUE constraint:', error.message);
        return false;
      }
    }
    
    // Check if admin user exists
    console.log('Checking if admin user exists...');
    
    const adminCheckResult = await pool.query(`
      SELECT COUNT(*) FROM users WHERE email = 'zp@coffeelab.gr';
    `);
    
    const adminExists = parseInt(adminCheckResult.rows[0].count) > 0;
    
    if (adminExists) {
      console.log('✅ Admin user already exists.');
    } else {
      console.log('Creating admin user...');
      
      try {
        await pool.query(`
          INSERT INTO users (name, email, password, role) 
          VALUES ('Admin', 'zp@coffeelab.gr', 'Zoespeppas2025!', 'admin');
        `);
        console.log('✅ Admin user created successfully.');
      } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        return false;
      }
    }
    
    console.log('');
    console.log('=================================================');
    console.log('EMAIL CONSTRAINT FIX RESULTS');
    console.log('=================================================');
    console.log('Users table exists: ✅');
    console.log('Email constraint added: ✅');
    console.log('Admin user exists: ✅');
    console.log('');
    console.log('✅ All email constraint issues fixed successfully!');
    
    return true;
  } catch (error) {
    console.error('❌ Error fixing email constraint:', error.message);
    return false;
  }
}

// Run the script
fixEmailConstraint().then(() => {
  console.log('Script execution completed!');
}).catch(error => {
  console.error('Script execution failed:', error);
});

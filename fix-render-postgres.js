/**
 * Fix Render PostgreSQL Database
 * 
 * This script fixes the PostgreSQL database on Render.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env.production') });

console.log('=================================================');
console.log('COFFEE LAB - FIX RENDER POSTGRESQL DATABASE');
console.log('=================================================');
console.log('This script will fix the PostgreSQL database on Render.');
console.log('');

// Create a PostgreSQL client
const { Client } = require('pg');

// Get the database URL from the environment variables
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ DATABASE_URL environment variable not found!');
  console.error('Please make sure the .env file in the backend directory contains the DATABASE_URL variable.');
  process.exit(1);
}

console.log('Connecting to PostgreSQL database...');

const client = new Client({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

// Connect to the database
client.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL database!');
    return fixDatabase();
  })
  .catch(err => {
    console.error('❌ Failed to connect to PostgreSQL database:', err);
    process.exit(1);
  });

// Fix the database
async function fixDatabase() {
  try {
    // Check if the users table exists
    const usersTableExists = await checkTableExists('users');
    if (!usersTableExists) {
      console.log('Creating users table...');
      await createUsersTable();
      console.log('✅ Users table created successfully!');
    } else {
      console.log('✅ Users table already exists.');
    }

    // Check if the network_stores table exists
    const networkStoresTableExists = await checkTableExists('network_stores');
    if (!networkStoresTableExists) {
      console.log('Creating network_stores table...');
      await createNetworkStoresTable();
      console.log('✅ Network stores table created successfully!');
    } else {
      console.log('✅ Network stores table already exists.');
    }

    // Check if the stores table exists
    const storesTableExists = await checkTableExists('stores');
    if (!storesTableExists) {
      console.log('Creating stores table...');
      await createStoresTable();
      console.log('✅ Stores table created successfully!');
    } else {
      console.log('✅ Stores table already exists.');
    }

    // Check if the checklist_templates table exists
    const checklistTemplatesTableExists = await checkTableExists('checklist_templates');
    if (!checklistTemplatesTableExists) {
      console.log('Creating checklist_templates table...');
      await createChecklistTemplatesTable();
      console.log('✅ Checklist templates table created successfully!');
    } else {
      console.log('✅ Checklist templates table already exists.');
    }

    // Check if the checklists table exists
    const checklistsTableExists = await checkTableExists('checklists');
    if (!checklistsTableExists) {
      console.log('Creating checklists table...');
      await createChecklistsTable();
      console.log('✅ Checklists table created successfully!');
    } else {
      console.log('✅ Checklists table already exists.');
    }

    // Create default admin user if it doesn't exist
    console.log('Checking for default admin user...');
    const adminExists = await checkAdminExists();
    if (!adminExists) {
      console.log('Creating default admin user...');
      await createDefaultAdmin();
      console.log('✅ Default admin user created successfully!');
    } else {
      console.log('✅ Default admin user already exists.');
    }

    console.log('');
    console.log('✅ Database fixed successfully!');
    client.end();
  } catch (err) {
    console.error('❌ Failed to fix database:', err);
    client.end();
    process.exit(1);
  }
}

// Check if a table exists
async function checkTableExists(tableName) {
  const result = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )
  `, [tableName]);
  
  return result.rows[0].exists;
}

// Check if the admin user exists
async function checkAdminExists() {
  const result = await client.query(`
    SELECT EXISTS (
      SELECT FROM users 
      WHERE email = 'zp@coffeelab.gr'
    )
  `);
  
  return result.rows[0].exists;
}

// Create the users table
async function createUsersTable() {
  await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Create the network_stores table
async function createNetworkStoresTable() {
  await client.query(`
    CREATE TABLE network_stores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(255),
      manager_name VARCHAR(255),
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Create the stores table
async function createStoresTable() {
  await client.query(`
    CREATE TABLE stores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      assigned_to INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Create the checklist_templates table
async function createChecklistTemplatesTable() {
  await client.query(`
    CREATE TABLE checklist_templates (
      id SERIAL PRIMARY KEY,
      role VARCHAR(50) NOT NULL,
      template_data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Create the checklists table
async function createChecklistsTable() {
  await client.query(`
    CREATE TABLE checklists (
      id SERIAL PRIMARY KEY,
      store_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      checklist_data JSONB NOT NULL,
      total_score DECIMAL(5,2) NOT NULL,
      has_zero_cutoff BOOLEAN DEFAULT FALSE,
      pdf_url VARCHAR(255),
      submit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Create the default admin user
async function createDefaultAdmin() {
  await client.query(`
    INSERT INTO users (name, email, password, role)
    VALUES ('Admin', 'zp@coffeelab.gr', 'Zoespeppas2025!', 'admin')
  `);
}

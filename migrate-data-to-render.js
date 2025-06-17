/**
 * Migrate Data to Render PostgreSQL
 * 
 * This script migrates data from the local MySQL database to the Render PostgreSQL database.
 */
const mysql = require('mysql2/promise');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') }); // Local MySQL
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env.production') }); // Render PostgreSQL

console.log('=================================================');
console.log('COFFEE LAB - MIGRATE DATA TO RENDER POSTGRESQL');
console.log('=================================================');
console.log('This script will migrate data from the local MySQL database to the Render PostgreSQL database.');
console.log('');

// MySQL connection
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'coffee_lab_db'
};

// PostgreSQL connection
const pgConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

// Tables to migrate
const tables = [
  'users',
  'network_stores',
  'stores',
  'checklist_templates',
  'checklists'
];

// Main function
async function migrateData() {
  let mysqlConnection;
  let pgClient;

  try {
    // Connect to MySQL
    console.log('Connecting to MySQL database...');
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Connected to MySQL database!');

    // Connect to PostgreSQL
    console.log('Connecting to PostgreSQL database...');
    pgClient = new Client(pgConfig);
    await pgClient.connect();
    console.log('✅ Connected to PostgreSQL database!');

    // Migrate each table
    for (const table of tables) {
      await migrateTable(mysqlConnection, pgClient, table);
    }

    console.log('');
    console.log('✅ Data migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    // Close connections
    if (mysqlConnection) await mysqlConnection.end();
    if (pgClient) await pgClient.end();
  }
}

// Migrate a single table
async function migrateTable(mysqlConnection, pgClient, tableName) {
  console.log(`\nMigrating table: ${tableName}`);

  try {
    // Check if table exists in MySQL
    const [tableCheck] = await mysqlConnection.execute(`SHOW TABLES LIKE '${tableName}'`);
    if (tableCheck.length === 0) {
      console.log(`⚠️ Table ${tableName} does not exist in MySQL. Skipping.`);
      return;
    }

    // Get data from MySQL
    const [rows] = await mysqlConnection.execute(`SELECT * FROM ${tableName}`);
    console.log(`Found ${rows.length} rows in MySQL ${tableName} table.`);

    if (rows.length === 0) {
      console.log(`⚠️ No data in MySQL ${tableName} table. Skipping.`);
      return;
    }

    // Check if table exists in PostgreSQL
    const tableExists = await pgClient.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )
    `, [tableName]);

    if (!tableExists.rows[0].exists) {
      console.log(`⚠️ Table ${tableName} does not exist in PostgreSQL. Skipping.`);
      return;
    }

    // Get column names
    const columns = Object.keys(rows[0]);
    
    // Clear existing data in PostgreSQL (optional)
    console.log(`Clearing existing data in PostgreSQL ${tableName} table...`);
    await pgClient.query(`DELETE FROM ${tableName}`);
    
    // Reset sequence if there's an id column
    if (columns.includes('id')) {
      await pgClient.query(`ALTER SEQUENCE ${tableName}_id_seq RESTART WITH 1`);
    }

    // Insert data into PostgreSQL
    let insertedCount = 0;
    for (const row of rows) {
      const values = columns.map(col => row[col]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      
      try {
        await pgClient.query(`
          INSERT INTO ${tableName} (${columns.join(', ')})
          VALUES (${placeholders})
        `, values);
        insertedCount++;
      } catch (err) {
        console.error(`❌ Error inserting row:`, err.message);
        console.error('Row data:', row);
      }
    }

    console.log(`✅ Migrated ${insertedCount} of ${rows.length} rows to PostgreSQL ${tableName} table.`);
  } catch (err) {
    console.error(`❌ Error migrating table ${tableName}:`, err);
  }
}

// Run the migration
migrateData();

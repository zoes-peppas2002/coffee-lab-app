/**
 * Database Viewer Tool
 * 
 * This script allows you to view and check the data in the server database.
 */
const fs = require('fs');
const path = require('path');

// Get the appropriate pool
let pool;
if (process.env.NODE_ENV === 'production') {
  pool = require('./db-pg');
  console.log('Using PostgreSQL database for viewing');
} else {
  pool = require('./db');
  console.log('Using MySQL database for viewing');
}

// Function to list all tables
async function listTables() {
  try {
    let query;
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query to list tables
      query = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
    } else {
      // MySQL query to list tables
      query = `
        SHOW TABLES
      `;
    }
    
    const result = await pool.query(query);
    console.log('Tables in the database:');
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL result format
      result.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
      return result.rows.map(row => row.table_name);
    } else {
      // MySQL result format
      const tables = [];
      for (const row of result) {
        const tableName = Object.values(row)[0];
        console.log(`- ${tableName}`);
        tables.push(tableName);
      }
      return tables;
    }
  } catch (err) {
    console.error('Error listing tables:', err);
    return [];
  }
}

// Function to view table structure
async function viewTableStructure(tableName) {
  try {
    let query;
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query to view table structure
      query = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `;
      const result = await pool.query(query, [tableName]);
      
      console.log(`
Structure of table "${tableName}":`);
      console.log('Column Name | Data Type | Nullable');
      console.log('----------- | --------- | --------');
      
      result.rows.forEach(row => {
        console.log(`${row.column_name} | ${row.data_type} | ${row.is_nullable}`);
      });
    } else {
      // MySQL query to view table structure
      query = `DESCRIBE ${tableName}`;
      const result = await pool.query(query);
      
      console.log(`
Structure of table "${tableName}":`);
      console.log('Field | Type | Null | Key | Default | Extra');
      console.log('----- | ---- | ---- | --- | ------- | -----');
      
      for (const row of result) {
        console.log(`${row.Field} | ${row.Type} | ${row.Null} | ${row.Key} | ${row.Default} | ${row.Extra}`);
      }
    }
  } catch (err) {
    console.error(`Error viewing structure of table "${tableName}":`, err);
  }
}

// Function to view table data
async function viewTableData(tableName, limit = 10) {
  try {
    const query = `SELECT * FROM "${tableName}" LIMIT ${limit}`;
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL
      const result = await pool.query(query);
      console.log(`
Data in table "${tableName}" (limit ${limit}):`);
      
      if (result.rows.length === 0) {
        console.log('No data found in this table.');
      } else {
        console.table(result.rows);
      }
    } else {
      // MySQL
      const result = await pool.query(query);
      console.log(`
Data in table "${tableName}" (limit ${limit}):`);
      
      if (result.length === 0) {
        console.log('No data found in this table.');
      } else {
        console.table(result);
      }
    }
  } catch (err) {
    console.error(`Error viewing data in table "${tableName}":`, err);
  }
}

// Function to count records in a table
async function countRecords(tableName) {
  try {
    const query = `SELECT COUNT(*) FROM "${tableName}"`;
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL
      const result = await pool.query(query);
      const count = parseInt(result.rows[0].count);
      console.log(`Table "${tableName}" contains ${count} records.`);
      return count;
    } else {
      // MySQL
      const result = await pool.query(query);
      const count = parseInt(Object.values(result[0])[0]);
      console.log(`Table "${tableName}" contains ${count} records.`);
      return count;
    }
  } catch (err) {
    console.error(`Error counting records in table "${tableName}":`, err);
    return 0;
  }
}

// Main function
async function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - DATABASE VIEWER TOOL');
  console.log('=================================================');
  console.log('');
  
  try {
    // List all tables
    const tables = await listTables();
    
    if (tables.length === 0) {
      console.log('No tables found in the database.');
      return;
    }
    
    // View structure and data for each table
    for (const tableName of tables) {
      await viewTableStructure(tableName);
      const count = await countRecords(tableName);
      
      if (count > 0) {
        await viewTableData(tableName);
      }
      
      console.log(''); // Add a blank line between tables
    }
    
    console.log('Database viewing completed successfully.');
  } catch (err) {
    console.error('Error in database viewer:', err);
  } finally {
    // Close the connection pool
    if (pool.end) {
      await pool.end();
    }
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});

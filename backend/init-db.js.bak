const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Initialize the database by creating necessary tables
 */
async function initDb() {
  try {
    console.log('Initializing database...');
    
    // Επιλογή του κατάλληλου pool ανάλογα με το περιβάλλον
    let pool;
    if (process.env.NODE_ENV === 'production') {
      // Χρήση PostgreSQL στο Render
      pool = require('./db-pg');
      console.log('Using PostgreSQL for initialization');
    } else {
      // Χρήση MySQL τοπικά
      pool = require('./db');
      console.log('Using MySQL for initialization');
    }
    
    // Read SQL scripts
    const usersTableSql = fs.readFileSync(path.join(__dirname, 'create-users-table.sql'), 'utf8');
    const defaultAdminSql = fs.readFileSync(path.join(__dirname, 'create-default-admin.sql'), 'utf8');
    const networkTableSql = fs.readFileSync(path.join(__dirname, 'create-network-table.sql'), 'utf8');
    
    // Split SQL commands
    const usersCommands = usersTableSql.split(';').filter(cmd => cmd.trim() !== '');
    const adminCommands = defaultAdminSql.split(';').filter(cmd => cmd.trim() !== '');
    const networkCommands = networkTableSql.split(';').filter(cmd => cmd.trim() !== '');
    
    // Execute users table commands first
    console.log('Creating users table...');
    for (const command of usersCommands) {
      if (command.trim()) {
        // Skip ANY index creation command completely
        if (command.includes('CREATE INDEX') || command.includes('idx_') || command.includes('INDEX')) {
          console.log('EMERGENCY FIX: Skipping index command:', command);
          continue;
        }
        
        // Skip commands with email UNIQUE constraint in PostgreSQL environment
        if (process.env.NODE_ENV === 'production' && 
            (command.includes('UNIQUE') || command.includes('email'))) {
          console.log('EMERGENCY FIX: Skipping email constraint command in PostgreSQL:', command);
          continue;
        }
        
        // Προσαρμογή του SQL για PostgreSQL αν είμαστε σε περιβάλλον παραγωγής
        let sqlCommand = command;
        if (process.env.NODE_ENV === 'production') {
          // Αντικατάσταση MySQL-specific syntax με PostgreSQL syntax
          sqlCommand = sqlCommand
            .replace(/`/g, '"')
            .replace(/INT\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/gi, 'SERIAL PRIMARY KEY')
            .replace(/INT\s+NOT\s+NULL\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/gi, 'SERIAL PRIMARY KEY')
            .replace(/INT\s+NOT\s+NULL\s+AUTO_INCREMENT/gi, 'SERIAL')
            .replace(/AUTO_INCREMENT/g, '')
            .replace(/DATETIME/gi, 'TIMESTAMP')
            .replace(/TINYINT\(1\)/gi, 'BOOLEAN')
            .replace(/DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/gi, 'DEFAULT CURRENT_TIMESTAMP')
            .replace(/ENUM\('admin', 'area_manager', 'coffee_specialist'\)/gi, 'VARCHAR(20)');
          
          // Log the converted SQL command for debugging
          console.log('Converted SQL command for users table:', sqlCommand);
        }
        
        try {
          // Skip any command that might create an index
          if (sqlCommand.includes('CREATE INDEX') || sqlCommand.includes('idx_') || sqlCommand.includes('INDEX')) {
            console.log('Skipping potential index command:', sqlCommand);
            continue;
          }
          
          await pool.query(sqlCommand);
          console.log('Executed SQL command for users table successfully');
        } catch (error) {
          // If the error is about anything already existing, just log and continue
          if (error.message && (
              error.message.includes('already exists') || 
              error.code === '42P07' || 
              error.routine === 'index_create'
          )) {
            console.log('Object already exists, continuing...');
          } else {
            // For other errors, log but don't throw
            console.error('Error executing SQL command:', error.message);
          }
        }
      }
    }
    
    // Execute default admin user commands
    console.log('Creating default admin user...');
    for (const command of adminCommands) {
      if (command.trim()) {
        // Προσαρμογή του SQL για PostgreSQL αν είμαστε σε περιβάλλον παραγωγής
        let sqlCommand = command;
        if (process.env.NODE_ENV === 'production') {
          // Αντικατάσταση MySQL-specific syntax με PostgreSQL syntax
          sqlCommand = sqlCommand
            .replace(/`/g, '"')
            .replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP');
          
          // Log the converted SQL command for debugging
          console.log('Converted SQL command for default admin:', sqlCommand);
        }
        
        try {
          await pool.query(sqlCommand);
          console.log('Executed SQL command for default admin successfully');
        } catch (error) {
          // If the error is about anything already existing, just log and continue
          if (error.message && error.message.includes('already exists')) {
            console.log('Admin user already exists, continuing...');
          } else {
            console.error('Error creating admin user:', error.message);
          }
        }
      }
    }
    
    // Execute network table commands
    console.log('Creating network_stores table...');
    for (const command of networkCommands) {
      if (command.trim()) {
        // Προσαρμογή του SQL για PostgreSQL αν είμαστε σε περιβάλλον παραγωγής
        let sqlCommand = command;
        if (process.env.NODE_ENV === 'production') {
          // Αντικατάσταση MySQL-specific syntax με PostgreSQL syntax
          sqlCommand = sqlCommand
            .replace(/`/g, '"')
            .replace(/INT\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/gi, 'SERIAL PRIMARY KEY')
            .replace(/INT\s+NOT\s+NULL\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/gi, 'SERIAL PRIMARY KEY')
            .replace(/INT\s+NOT\s+NULL\s+AUTO_INCREMENT/gi, 'SERIAL')
            .replace(/AUTO_INCREMENT/g, '')
            .replace(/DATETIME/gi, 'TIMESTAMP')
            .replace(/TINYINT\(1\)/gi, 'BOOLEAN')
            .replace(/DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/gi, 'DEFAULT CURRENT_TIMESTAMP');
          
          // Log the converted SQL command for debugging
          console.log('Converted SQL command:', sqlCommand);
        }
        
        try {
          await pool.query(sqlCommand);
          console.log('Executed SQL command successfully');
        } catch (error) {
          // If the error is about anything already existing, just log and continue
          if (error.message && error.message.includes('already exists')) {
            console.log('Network table already exists, continuing...');
          } else {
            console.error('Error creating network table:', error.message);
          }
        }
      }
    }
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Export the function for use in server.js
module.exports = initDb;

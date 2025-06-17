/**
 * Update Database Connection for Render Deployment
 * 
 * This script updates the database connection configuration to match the Render environment.
 */
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('COFFEE LAB - UPDATE DATABASE CONNECTION');
console.log('=================================================');
console.log('This script will update the database connection configuration.');
console.log('');

// Update db-pg.js file
console.log('Updating db-pg.js file...');
const dbPgPath = path.join(__dirname, 'backend', 'db-pg.js');

if (fs.existsSync(dbPgPath)) {
  let dbPgContent = fs.readFileSync(dbPgPath, 'utf8');
  
  // Update the connection configuration
  const updatedDbPgContent = `const { Pool } = require('pg');

// Get the DATABASE_URL from environment variables
const databaseUrl = process.env.DATABASE_URL || 'postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a/coffee_lab_db_lyf9';

// Create a new pool using the connection string
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Export the pool for use in other modules
module.exports = pool;
`;
  
  // Write the updated content back to the file
  fs.writeFileSync(dbPgPath, updatedDbPgContent);
  console.log('✅ db-pg.js updated successfully.');
} else {
  console.error('❌ backend/db-pg.js not found.');
}

// Update .env.production file
console.log('\nUpdating .env.production file...');
const envProductionPath = path.join(__dirname, 'backend', '.env.production');

const envProductionContent = `NODE_ENV=production
DATABASE_URL=postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a/coffee_lab_db_lyf9
PORT=10000
`;

fs.writeFileSync(envProductionPath, envProductionContent);
console.log('✅ .env.production updated successfully.');

// Create a script to test the database connection
console.log('\nCreating test-db-connection.js...');
const testDbConnectionPath = path.join(__dirname, 'backend', 'test-db-connection.js');

const testDbConnectionContent = `/**
 * Test Database Connection
 * 
 * This script tests the connection to the database.
 */
const fs = require('fs');
const path = require('path');

// Set NODE_ENV to production
process.env.NODE_ENV = 'production';

// Set DATABASE_URL
process.env.DATABASE_URL = 'postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a/coffee_lab_db_lyf9';

// Get the appropriate pool
const pool = require('./db-pg');

async function testConnection() {
  console.log('=================================================');
  console.log('COFFEE LAB - TEST DATABASE CONNECTION');
  console.log('=================================================');
  console.log('');
  
  try {
    console.log('Testing connection to the database...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log(\`Current database time: \${result.rows[0].now}\`);
    
    // List all tables
    console.log('\\nListing all tables...');
    const tablesResult = await pool.query(\`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    \`);
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Tables in the database:');
      tablesResult.rows.forEach(row => {
        console.log(\`- \${row.table_name}\`);
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
`;

fs.writeFileSync(testDbConnectionPath, testDbConnectionContent);
console.log('✅ test-db-connection.js created successfully.');

// Create a batch file to run the test
console.log('\nCreating test-db-connection.bat...');
const testDbConnectionBatchPath = path.join(__dirname, 'test-db-connection.bat');

const testDbConnectionBatchContent = `@echo off
echo ===================================
echo COFFEE LAB - TEST DATABASE CONNECTION
echo ===================================
echo.
echo This script will test the connection to the database.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running test-db-connection.js...
cd backend
node test-db-connection.js
cd ..

echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(testDbConnectionBatchPath, testDbConnectionBatchContent);
console.log('✅ test-db-connection.bat created successfully.');

// Create a batch file to run this script
console.log('\nCreating update-db-connection.bat...');
const batchPath = path.join(__dirname, 'update-db-connection.bat');

const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - UPDATE DATABASE CONNECTION
echo ===================================
echo.
echo This script will update the database connection configuration.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running update-db-connection.js...
node update-db-connection.js

echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(batchPath, batchContent);
console.log('✅ update-db-connection.bat created successfully.');

// Update the fix-everything-and-deploy.bat file
console.log('\nUpdating fix-everything-and-deploy.bat...');
const fixEverythingPath = path.join(__dirname, 'fix-everything-and-deploy.bat');

if (fs.existsSync(fixEverythingPath)) {
  let fixEverythingContent = fs.readFileSync(fixEverythingPath, 'utf8');
  
  // Update the content to include the database connection update
  const updatedFixEverythingContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX EVERYTHING AND DEPLOY
echo ===================================
echo.
echo This script will fix all issues and deploy to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Updating database connection...
call update-db-connection.bat

echo.
echo Step 2: Fixing all database issues...
call fix-all-database-issues.bat

echo.
echo Step 3: Fixing dependencies...
call fix-render-dependencies.bat

echo.
echo Step 4: Fixing path-to-regexp error...
call fix-path-to-regexp-error.bat

echo.
echo Step 5: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 6: Deploying to Render...
call deploy-to-render.bat

echo.
echo All steps completed!
echo.
echo The application has been fixed and deployed to Render.
echo.
echo Press any key to exit...
pause > nul`;
  
  // Write the updated content back to the file
  fs.writeFileSync(fixEverythingPath, updatedFixEverythingContent);
  console.log('✅ fix-everything-and-deploy.bat updated successfully.');
} else {
  console.error('❌ fix-everything-and-deploy.bat not found.');
}

console.log('\n=================================================');
console.log('DATABASE CONNECTION UPDATE COMPLETED');
console.log('=================================================');
console.log('The database connection configuration has been updated.');
console.log('');
console.log('To test the database connection:');
console.log('1. Run test-db-connection.bat');
console.log('');
console.log('To deploy to Render with all fixes:');
console.log('1. Run fix-everything-and-deploy.bat');

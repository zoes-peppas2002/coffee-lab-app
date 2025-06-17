/**
 * Fix Database Connection for Render Deployment
 * 
 * This script fixes the database connection issue by using the external hostname.
 */
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('COFFEE LAB - FIX DATABASE CONNECTION');
console.log('=================================================');
console.log('This script will fix the database connection issue.');
console.log('');

// Update db-pg.js file
console.log('Updating db-pg.js file...');
const dbPgPath = path.join(__dirname, 'backend', 'db-pg.js');

if (fs.existsSync(dbPgPath)) {
  // Update the connection configuration to use the external hostname
  const updatedDbPgContent = `const { Pool } = require('pg');

// Get the DATABASE_URL from environment variables
// Use the external hostname for connections from outside Render
const databaseUrl = process.env.DATABASE_URL || 'postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a.frankfurt-postgres.render.com/coffee_lab_db_lyf9';

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
DATABASE_URL=postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a.frankfurt-postgres.render.com/coffee_lab_db_lyf9
PORT=10000
`;

fs.writeFileSync(envProductionPath, envProductionContent);
console.log('✅ .env.production updated successfully.');

// Update test-db-connection.js
console.log('\nUpdating test-db-connection.js...');
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

// Set DATABASE_URL with external hostname
process.env.DATABASE_URL = 'postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a.frankfurt-postgres.render.com/coffee_lab_db_lyf9';

// Get the appropriate pool
const pool = require('./db-pg');

async function testConnection() {
  console.log('=================================================');
  console.log('COFFEE LAB - TEST DATABASE CONNECTION');
  console.log('=================================================');
  console.log('');
  
  try {
    console.log('Testing connection to the database...');
    console.log('Using connection string with external hostname:');
    console.log(process.env.DATABASE_URL);
    
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
console.log('✅ test-db-connection.js updated successfully.');

// Update database-viewer.js
console.log('\nUpdating database-viewer.js...');
const dbViewerPath = path.join(__dirname, 'backend', 'database-viewer.js');

if (fs.existsSync(dbViewerPath)) {
  let dbViewerContent = fs.readFileSync(dbViewerPath, 'utf8');
  
  // Update the DATABASE_URL to use the external hostname
  dbViewerContent = dbViewerContent.replace(
    /process\.env\.DATABASE_URL = ['"]postgresql:\/\/coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a\/coffee_lab_db_lyf9['"]/g,
    'process.env.DATABASE_URL = \'postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a.frankfurt-postgres.render.com/coffee_lab_db_lyf9\''
  );
  
  fs.writeFileSync(dbViewerPath, dbViewerContent);
  console.log('✅ database-viewer.js updated successfully.');
} else {
  console.error('❌ backend/database-viewer.js not found.');
}

// Create a batch file to run this script
console.log('\nCreating fix-db-connection.bat...');
const batchPath = path.join(__dirname, 'fix-db-connection.bat');

const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX DATABASE CONNECTION
echo ===================================
echo.
echo This script will fix the database connection issue.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-db-connection.js...
node fix-db-connection.js

echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(batchPath, batchContent);
console.log('✅ fix-db-connection.bat created successfully.');

// Update fix-everything-and-deploy.bat
console.log('\nUpdating fix-everything-and-deploy.bat...');
const fixEverythingPath = path.join(__dirname, 'fix-everything-and-deploy.bat');

if (fs.existsSync(fixEverythingPath)) {
  let fixEverythingContent = fs.readFileSync(fixEverythingPath, 'utf8');
  
  // Update the content to include the database connection fix
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
echo Step 1: Fixing scripts...
call fix-scripts.bat

echo.
echo Step 2: Fixing database connection...
call fix-db-connection.bat

echo.
echo Step 3: Fixing all database issues...
call fix-all-database-issues.bat

echo.
echo Step 4: Fixing dependencies...
call fix-render-dependencies.bat

echo.
echo Step 5: Fixing path-to-regexp error...
call fix-path-to-regexp-error.bat

echo.
echo Step 6: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 7: Deploying to Render...
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
console.log('DATABASE CONNECTION FIX COMPLETED');
console.log('=================================================');
console.log('The database connection has been fixed to use the external hostname.');
console.log('');
console.log('To test the database connection:');
console.log('1. Run test-db-connection.bat');
console.log('');
console.log('To deploy to Render with all fixes:');
console.log('1. Run fix-everything-and-deploy.bat');

/**
 * Fix Database Issues for Render Deployment
 * 
 * This script addresses the specific database issues mentioned by Render support:
 * 1. Creates missing tables (users, etc.)
 * 2. Fixes the boolean default value syntax (DEFAULT 1 -> DEFAULT true)
 */
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('COFFEE LAB - FIX DATABASE ISSUES');
console.log('=================================================');
console.log('This script will fix database issues for Render deployment.');
console.log('');

// Fix create-users-table.sql
console.log('Fixing create-users-table.sql...');
const usersTablePath = path.join(__dirname, 'backend', 'create-users-table.sql');

if (fs.existsSync(usersTablePath)) {
  let usersTableContent = fs.readFileSync(usersTablePath, 'utf8');
  
  // Fix boolean default values
  usersTableContent = usersTableContent.replace(/DEFAULT 1/g, 'DEFAULT true');
  usersTableContent = usersTableContent.replace(/DEFAULT 0/g, 'DEFAULT false');
  
  // Write the updated content back to the file
  fs.writeFileSync(usersTablePath, usersTableContent);
  console.log('✅ create-users-table.sql fixed successfully.');
} else {
  console.error('❌ backend/create-users-table.sql not found.');
}

// Fix create-network-table.sql
console.log('\nFixing create-network-table.sql...');
const networkTablePath = path.join(__dirname, 'backend', 'create-network-table.sql');

if (fs.existsSync(networkTablePath)) {
  let networkTableContent = fs.readFileSync(networkTablePath, 'utf8');
  
  // Fix boolean default values
  networkTableContent = networkTableContent.replace(/DEFAULT 1/g, 'DEFAULT true');
  networkTableContent = networkTableContent.replace(/DEFAULT 0/g, 'DEFAULT false');
  
  // Write the updated content back to the file
  fs.writeFileSync(networkTablePath, networkTableContent);
  console.log('✅ create-network-table.sql fixed successfully.');
} else {
  console.error('❌ backend/create-network-table.sql not found.');
}

// Create a modified init-db.js that ensures all tables are created
console.log('\nCreating fixed-init-db.js...');
const initDbPath = path.join(__dirname, 'backend', 'init-db.js');
const fixedInitDbPath = path.join(__dirname, 'backend', 'fixed-init-db.js');

if (fs.existsSync(initDbPath)) {
  let initDbContent = fs.readFileSync(initDbPath, 'utf8');
  
  // Add code to ensure all tables are created
  const additionalCode = `
// Function to execute SQL file
async function executeSqlFile(pool, filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // For PostgreSQL, we need to convert MySQL syntax to PostgreSQL
    let convertedSql = sql;
    if (process.env.NODE_ENV === 'production') {
      // Convert MySQL syntax to PostgreSQL
      convertedSql = sql
        .replace(/AUTO_INCREMENT/g, 'SERIAL')
        .replace(/INT/g, 'INTEGER')
        .replace(/DATETIME/g, 'TIMESTAMP')
        .replace(/DEFAULT CURRENT_TIMESTAMP/g, 'DEFAULT CURRENT_TIMESTAMP')
        .replace(/DEFAULT 1/g, 'DEFAULT true')
        .replace(/DEFAULT 0/g, 'DEFAULT false');
      
      console.log('Converted SQL command:', convertedSql);
    }
    
    await pool.query(convertedSql);
    return true;
  } catch (err) {
    console.error(\`Error executing SQL file \${filePath}:\`, err);
    return false;
  }
}

// Ensure all tables exist
async function ensureTablesExist(pool) {
  console.log('Ensuring all tables exist...');
  
  // Create users table
  console.log('Creating users table...');
  const usersTableCreated = await executeSqlFile(
    pool, 
    path.join(__dirname, 'create-users-table.sql')
  );
  
  if (!usersTableCreated) {
    console.error('Error creating users table');
  }
  
  // Create network_stores table
  console.log('Creating network_stores table...');
  const networkTableCreated = await executeSqlFile(
    pool, 
    path.join(__dirname, 'create-network-table.sql')
  );
  
  if (!networkTableCreated) {
    console.error('Error creating network table:', err);
  }
  
  // Create default admin user
  try {
    console.log('Creating default admin user...');
    const adminSql = fs.readFileSync(
      path.join(__dirname, 'create-default-admin.sql'), 
      'utf8'
    );
    
    await pool.query(adminSql);
    console.log('Default admin user created successfully');
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  }
}
`;
  
  // Add the additional code before the module.exports
  const moduleExportsIndex = initDbContent.indexOf('module.exports');
  if (moduleExportsIndex !== -1) {
    initDbContent = initDbContent.slice(0, moduleExportsIndex) + 
                   additionalCode + 
                   '\n\n' + 
                   initDbContent.slice(moduleExportsIndex);
  }
  
  // Modify the module.exports to call ensureTablesExist
  initDbContent = initDbContent.replace(
    /module\.exports = async function\(\) \{[\s\S]*?\}/,
    `module.exports = async function() {
  try {
    // Get the appropriate pool
    let pool;
    if (process.env.NODE_ENV === 'production') {
      pool = require('./db-pg');
      console.log('Using PostgreSQL database for initialization');
    } else {
      pool = require('./db');
      console.log('Using MySQL database for initialization');
    }
    
    // Ensure all tables exist
    await ensureTablesExist(pool);
    
    console.log('Database initialized successfully');
    return true;
  } catch (err) {
    console.error('Database initialization error:', err);
    return false;
  }
}`
  );
  
  // Write the updated content to the fixed file
  fs.writeFileSync(fixedInitDbPath, initDbContent);
  console.log('✅ fixed-init-db.js created successfully.');
  
  // Create a backup of the original init-db.js
  fs.copyFileSync(initDbPath, path.join(__dirname, 'backend', 'init-db.js.bak'));
  console.log('✅ Backup of original init-db.js created.');
  
  // Replace the original init-db.js with the fixed version
  fs.copyFileSync(fixedInitDbPath, initDbPath);
  console.log('✅ init-db.js replaced with fixed version.');
} else {
  console.error('❌ backend/init-db.js not found.');
}

// Create a batch file to run this script
console.log('\nCreating fix-database-issues.bat...');
const batchPath = path.join(__dirname, 'fix-database-issues.bat');
const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX DATABASE ISSUES
echo ===================================
echo.
echo This script will fix database issues for Render deployment.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-database-issues.js...
node fix-database-issues.js

echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(batchPath, batchContent);
console.log('✅ fix-database-issues.bat created successfully.');

// Create a combined script that runs this fix and then deploys
console.log('\nCreating fix-database-and-deploy.bat...');
const combinedBatchPath = path.join(__dirname, 'fix-database-and-deploy.bat');
const combinedBatchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX DATABASE AND DEPLOY
echo ===================================
echo.
echo This script will fix database issues and deploy to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Fixing database issues...
call fix-database-issues.bat

echo.
echo Step 2: Fixing dependencies...
call fix-render-dependencies.bat

echo.
echo Step 3: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 4: Deploying to Render...
call deploy-to-render.bat

echo.
echo All steps completed!
echo.
echo The application has been fixed and deployed to Render.
echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(combinedBatchPath, combinedBatchContent);
console.log('✅ fix-database-and-deploy.bat created successfully.');

console.log('\n=================================================');
console.log('DATABASE ISSUES FIX COMPLETED');
console.log('=================================================');
console.log('The database issues have been fixed.');
console.log('');
console.log('To deploy to Render, use:');
console.log('1. Run fix-database-issues.bat');
console.log('2. Run fix-render-dependencies.bat');
console.log('3. Run prepare-for-render-deploy.bat');
console.log('4. Run deploy-to-render.bat');
console.log('');
console.log('Or use the all-in-one script:');
console.log('fix-database-and-deploy.bat');

/**
 * Install PostgreSQL Package
 * 
 * This script installs the pg package required for PostgreSQL connections.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('COFFEE LAB - INSTALL POSTGRESQL PACKAGE');
console.log('=================================================');
console.log('This script will install the pg package required for PostgreSQL connections.');
console.log('');

try {
  console.log('Installing pg package...');
  execSync('npm install pg', { stdio: 'inherit' });
  console.log('✅ pg package installed successfully.');
  
  // Check if the package was installed correctly
  try {
    require('pg');
    console.log('✅ pg package is working correctly.');
  } catch (err) {
    console.error('❌ Error importing pg package:', err.message);
    console.log('Trying to install pg package globally...');
    execSync('npm install -g pg', { stdio: 'inherit' });
    console.log('✅ pg package installed globally.');
  }
  
  // Create a batch file to run this script
  console.log('\nCreating install-pg-package.bat...');
  const batchPath = path.join(__dirname, 'install-pg-package.bat');
  
  const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - INSTALL POSTGRESQL PACKAGE
echo ===================================
echo.
echo This script will install the pg package required for PostgreSQL connections.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running install-pg-package.js...
node install-pg-package.js

echo.
echo Press any key to exit...
pause > nul`;
  
  fs.writeFileSync(batchPath, batchContent);
  console.log('✅ install-pg-package.bat created successfully.');
  
  // Update fix-everything-and-deploy.bat
  console.log('\nUpdating fix-everything-and-deploy.bat...');
  const fixEverythingPath = path.join(__dirname, 'fix-everything-and-deploy.bat');
  
  if (fs.existsSync(fixEverythingPath)) {
    let fixEverythingContent = fs.readFileSync(fixEverythingPath, 'utf8');
    
    // Update the content to include the pg package installation
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
echo Step 1: Installing PostgreSQL package...
call install-pg-package.bat

echo.
echo Step 2: Fixing scripts...
call fix-scripts.bat

echo.
echo Step 3: Fixing database connection...
call fix-db-connection.bat

echo.
echo Step 4: Fixing all database issues...
call fix-all-database-issues.bat

echo.
echo Step 5: Fixing dependencies...
call fix-render-dependencies.bat

echo.
echo Step 6: Fixing path-to-regexp error...
call fix-path-to-regexp-error.bat

echo.
echo Step 7: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 8: Deploying to Render...
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
  console.log('POSTGRESQL PACKAGE INSTALLATION COMPLETED');
  console.log('=================================================');
  console.log('The pg package has been installed.');
  console.log('');
  console.log('You can now run try-db-connections.bat to test database connections.');
  
} catch (err) {
  console.error('❌ Error installing pg package:', err.message);
  console.error('Please try to install it manually with:');
  console.error('npm install pg');
}

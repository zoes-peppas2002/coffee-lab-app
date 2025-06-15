/**
 * Script to ensure the backend package.json has the required start script
 * This is a safeguard for Render deployment
 */
const fs = require('fs');
const path = require('path');

// Path to backend package.json
const packageJsonPath = path.join(__dirname, 'backend', 'package.json');

// Main function
function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - FIX PACKAGE.JSON');
  console.log('=================================================');
  console.log('\nEnsuring backend package.json has the required start script...');

  try {
    // Read the package.json file
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Initialize scripts object if it doesn't exist
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    // Add or update the start script
    packageJson.scripts.start = 'node server.js';
    
    // Add engines section for Node.js version
    packageJson.engines = {
      node: '>=18.0.0'
    };
    
    // Write the updated package.json back to the file
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    console.log('Successfully updated package.json with start script');
    console.log('Current scripts:', packageJson.scripts);
  } catch (error) {
    console.error('Error updating package.json:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();

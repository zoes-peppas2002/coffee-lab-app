const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== COFFEE LAB - INSTALL DEPENDENCIES ===');
console.log('This script will install all required dependencies');

// Function to check if a package is installed
function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}

// Function to install a package
function installPackage(packageName) {
  console.log(`\nInstalling ${packageName}...`);
  try {
    execSync(`npm install ${packageName}`, { stdio: 'inherit' });
    console.log(`✅ ${packageName} installed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to install ${packageName}:`, error.message);
    return false;
  }
}

// Main function to install all required dependencies
function installDependencies() {
  const requiredPackages = ['axios', 'pg'];
  let allInstalled = true;
  
  for (const pkg of requiredPackages) {
    if (!isPackageInstalled(pkg)) {
      const success = installPackage(pkg);
      if (!success) {
        allInstalled = false;
      }
    } else {
      console.log(`✅ ${pkg} is already installed`);
    }
  }
  
  return allInstalled;
}

// Run the installation
const success = installDependencies();

if (success) {
  console.log('\nAll dependencies installed successfully!');
} else {
  console.error('\nSome dependencies failed to install. Please check the errors above.');
}

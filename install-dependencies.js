/**
 * Simple script to install dependencies for both backend and frontend
 * This replaces the previous install-dependencies.bat file
 */
const { spawn } = require('child_process');
const path = require('path');

// Function to run npm install in a specific directory
function installDependencies(directory, name) {
  return new Promise((resolve, reject) => {
    console.log(`Installing ${name} dependencies...`);
    
    const npm = spawn('npm', ['install'], {
      cwd: path.join(__dirname, directory),
      stdio: 'inherit',
      shell: true
    });

    npm.on('error', (err) => {
      console.error(`Failed to install ${name} dependencies:`, err);
      reject(err);
    });

    npm.on('close', (code) => {
      if (code === 0) {
        console.log(`${name} dependencies installed successfully.`);
        resolve();
      } else {
        console.error(`${name} dependencies installation failed with code ${code}.`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

// Main function to install all dependencies
async function installAll() {
  console.log('=================================================');
  console.log('COFFEE LAB - INSTALLING DEPENDENCIES');
  console.log('=================================================');
  
  try {
    // Install backend dependencies
    await installDependencies('backend', 'Backend');
    
    // Install frontend dependencies
    await installDependencies('my-web-app', 'Frontend');
    
    console.log('\nAll dependencies installed successfully!');
    console.log('You can now run the application with:');
    console.log('node start-app.js');
  } catch (error) {
    console.error('\nFailed to install all dependencies:', error.message);
    process.exit(1);
  }
}

// Start the installation process
installAll();

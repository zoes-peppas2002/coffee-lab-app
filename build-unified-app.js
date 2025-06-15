/**
 * Script to build the unified application for Render deployment
 * This script:
 * 1. Builds the frontend (React app)
 * 2. Copies the build files to the backend's frontend-build directory
 * 3. Creates a production .env file for the backend
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_DIR = path.join(__dirname, 'my-web-app');
const BACKEND_DIR = path.join(__dirname, 'backend');
const FRONTEND_BUILD_DIR = path.join(FRONTEND_DIR, 'dist');
const BACKEND_FRONTEND_DIR = path.join(BACKEND_DIR, 'frontend-build');

// Function to execute shell commands
function executeCommand(command, cwd = __dirname) {
  try {
    console.log(`Executing: ${command} in ${cwd}`);
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Function to copy directory recursively
function copyDirectory(source, destination) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Get all files and directories in the source directory
  const entries = fs.readdirSync(source, { withFileTypes: true });

  // Copy each entry to the destination
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy directories
      copyDirectory(sourcePath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

// Function to create production .env file for backend
function createProductionEnv() {
  const envContent = `# Production environment configuration

# Database configuration
# This will be set by Render environment variables
# DATABASE_URL=postgres://username:password@host:port/database

# Server configuration
PORT=10000
NODE_ENV=production

# No need for FRONTEND_URL in production since frontend is served by the same server
`;

  fs.writeFileSync(path.join(BACKEND_DIR, '.env.production'), envContent);
  console.log('Created production .env file for backend');
}

// Function to create production .env file for frontend
function createFrontendProductionEnv() {
  const envContent = `# API URL for production - using relative URL since frontend and backend are on the same server
VITE_API_URL=/api

# Environment
VITE_NODE_ENV=production
`;

  fs.writeFileSync(path.join(FRONTEND_DIR, '.env.production'), envContent);
  console.log('Created production .env file for frontend');
}

// Function to create Procfile for Render
function createProcfile() {
  const procfileContent = `web: node server.js
`;

  fs.writeFileSync(path.join(BACKEND_DIR, 'Procfile'), procfileContent);
  console.log('Created Procfile for Render');
}

// Main function
async function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - UNIFIED BUILD FOR RENDER');
  console.log('=================================================');

  // 1. Create production environment files
  console.log('\n1. Creating production environment files...');
  createProductionEnv();
  createFrontendProductionEnv();
  createProcfile();

  // 2. Install dependencies
  console.log('\n2. Installing dependencies...');
  executeCommand('npm install', FRONTEND_DIR);
  executeCommand('npm install', BACKEND_DIR);

  // 3. Build frontend
  console.log('\n3. Building frontend...');
  executeCommand('npm run build', FRONTEND_DIR);

  // 4. Copy frontend build to backend
  console.log('\n4. Copying frontend build to backend...');
  if (fs.existsSync(BACKEND_FRONTEND_DIR)) {
    console.log('Removing existing frontend-build directory...');
    fs.rmSync(BACKEND_FRONTEND_DIR, { recursive: true, force: true });
  }
  copyDirectory(FRONTEND_BUILD_DIR, BACKEND_FRONTEND_DIR);

  // 5. Create package.json for Render
  console.log('\n5. Creating package.json for Render...');
  const backendPackageJson = JSON.parse(fs.readFileSync(path.join(BACKEND_DIR, 'package.json'), 'utf8'));
  
  // Add engines section for Node.js version
  backendPackageJson.engines = {
    node: '>=18.0.0'
  };
  
  // Add scripts for Render
  if (!backendPackageJson.scripts) {
    backendPackageJson.scripts = {};
  }
  
  backendPackageJson.scripts = {
    ...backendPackageJson.scripts,
    start: 'node server.js'
  };
  
  console.log('Added start script to package.json:', backendPackageJson.scripts);
  
  fs.writeFileSync(
    path.join(BACKEND_DIR, 'package.json'),
    JSON.stringify(backendPackageJson, null, 2)
  );

  console.log('\nBuild completed successfully!');
  console.log('\nTo deploy to Render:');
  console.log('1. Push your code to GitHub');
  console.log('2. Create a new Web Service on Render');
  console.log('3. Connect to your GitHub repository');
  console.log('4. Set the Root Directory to "backend"');
  console.log('5. Set the Build Command to "npm install"');
  console.log('6. Set the Start Command to "npm start"');
  console.log('7. Add the DATABASE_URL environment variable from your PostgreSQL database');
}

// Run the main function
main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});

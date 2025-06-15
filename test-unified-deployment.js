/**
 * Script to test the unified deployment locally
 * This script:
 * 1. Builds the frontend
 * 2. Copies the build files to the backend's frontend-build directory
 * 3. Starts the backend server in production mode
 * 
 * This allows testing the unified deployment configuration locally
 * before deploying to Render.
 */
const { execSync, spawn } = require('child_process');
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

// Function to create test environment file for frontend
function createFrontendTestEnv() {
  const envContent = `# API URL for local production test - using relative URL
VITE_API_URL=/api

# Environment
VITE_NODE_ENV=production
`;

  fs.writeFileSync(path.join(FRONTEND_DIR, '.env.production.local'), envContent);
  console.log('Created test production .env file for frontend');
}

// Function to create test environment file for backend
function createBackendTestEnv() {
  const envContent = `# Test production environment configuration

# Database configuration - using local MySQL for testing
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Zoespeppas2025!
DB_NAME=coffee_lab_db

# Server configuration
PORT=5000
NODE_ENV=production

# No need for FRONTEND_URL in production since frontend is served by the same server
`;

  fs.writeFileSync(path.join(BACKEND_DIR, '.env.production.local'), envContent);
  console.log('Created test production .env file for backend');
}

// Main function
async function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - TEST UNIFIED DEPLOYMENT LOCALLY');
  console.log('=================================================');

  // 1. Create test environment files
  console.log('\n1. Creating test environment files...');
  createFrontendTestEnv();
  createBackendTestEnv();

  // 2. Build frontend
  console.log('\n2. Building frontend...');
  executeCommand('npm run build', FRONTEND_DIR);

  // 3. Copy frontend build to backend
  console.log('\n3. Copying frontend build to backend...');
  if (fs.existsSync(BACKEND_FRONTEND_DIR)) {
    console.log('Removing existing frontend-build directory...');
    fs.rmSync(BACKEND_FRONTEND_DIR, { recursive: true, force: true });
  }
  copyDirectory(FRONTEND_BUILD_DIR, BACKEND_FRONTEND_DIR);

  // 4. Start backend server in production mode
  console.log('\n4. Starting backend server in production mode...');
  console.log('\nPress Ctrl+C to stop the server\n');
  
  // Set NODE_ENV to production
  const env = { ...process.env, NODE_ENV: 'production' };
  
  // Start backend server
  const backendProcess = spawn('node', ['server.js'], {
    cwd: BACKEND_DIR,
    stdio: 'inherit',
    env: env
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Stopping server...');
    backendProcess.kill();
    process.exit();
  });
}

// Run the main function
main().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});

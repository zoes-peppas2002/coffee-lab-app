/**
 * Simple script to start the Coffee Lab application
 * This replaces all the previous .bat files
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to start the backend server
function startBackend() {
  console.log('Starting backend server...');
  const backend = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true
  });

  backend.on('error', (err) => {
    console.error('Failed to start backend:', err);
  });

  return backend;
}

// Function to start the frontend development server
function startFrontend() {
  console.log('Starting frontend development server...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'my-web-app'),
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (err) => {
    console.error('Failed to start frontend:', err);
  });

  return frontend;
}

// Main function to start both servers
function startApp() {
  console.log('=================================================');
  console.log('COFFEE LAB - STARTING APPLICATION');
  console.log('=================================================');
  
  // Start the backend first
  const backendProcess = startBackend();
  
  // Wait a bit before starting the frontend
  setTimeout(() => {
    const frontendProcess = startFrontend();
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Shutting down...');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    });
  }, 2000);
  
  console.log('\nPress Ctrl+C to stop both servers\n');
}

// Start the application
startApp();

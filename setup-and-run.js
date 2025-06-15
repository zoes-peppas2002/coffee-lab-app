const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to execute shell commands
function executeCommand(command, cwd = process.cwd()) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Function to clean up project
function cleanupProject() {
  console.log('\nCleaning up project...');
  
  // Remove node_modules
  if (fs.existsSync('node_modules')) {
    console.log('Removing root node_modules...');
    fs.rmSync('node_modules', { recursive: true, force: true });
  }
  
  // Remove backend node_modules
  if (fs.existsSync('backend/node_modules')) {
    console.log('Removing backend node_modules...');
    fs.rmSync('backend/node_modules', { recursive: true, force: true });
  }
  
  // Remove frontend node_modules
  if (fs.existsSync('my-web-app/node_modules')) {
    console.log('Removing frontend node_modules...');
    fs.rmSync('my-web-app/node_modules', { recursive: true, force: true });
  }
  
  console.log('Cleanup completed successfully.');
}

// Function to install dependencies
function installDependencies() {
  console.log('\nInstalling dependencies...');
  
  // Install root dependencies
  console.log('Installing root dependencies...');
  executeCommand('npm install');
  
  // Install backend dependencies
  console.log('Installing backend dependencies...');
  executeCommand('cd backend && npm install');
  
  // Install frontend dependencies
  console.log('Installing frontend dependencies...');
  executeCommand('cd my-web-app && npm install');
  
  console.log('Dependencies installed successfully.');
}

// Function to initialize database
function initializeDatabase() {
  console.log('\nInitializing database...');
  
  // Run database initialization script
  executeCommand('node init-database.js');
  
  console.log('Database initialized successfully.');
}

// Function to start application
function startApplication() {
  console.log('\nStarting backend server...');
  console.log('\nPress Ctrl+C to stop both servers\n');
  
  // Start backend server
  const backendProcess = require('child_process').spawn('node', ['backend/server.js'], {
    stdio: 'inherit'
  });
  
  // Start frontend development server
  console.log('Starting frontend development server...');
  const frontendProcess = require('child_process').spawn('npm', ['run', 'dev'], {
    cwd: path.join(process.cwd(), 'my-web-app'),
    stdio: 'inherit',
    shell: true
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Stopping servers...');
    backendProcess.kill();
    frontendProcess.kill();
    process.exit();
  });
}

// Function to build unified app for Render
function buildUnifiedApp() {
  console.log('\nBuilding unified app for Render...');
  
  // Run the build-unified-app.js script
  executeCommand('node build-unified-app.js');
  
  console.log('Unified app build completed.');
}

// Function to test unified deployment locally
function testUnifiedDeployment() {
  console.log('\nTesting unified deployment locally...');
  
  // Run the test-unified-deployment.js script
  executeCommand('node test-unified-deployment.js');
}

// Main function
function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - SETUP AND RUN');
  console.log('=================================================');
  
  rl.question('What would you like to do?\n1. Full setup (clean, install, init DB, start app)\n2. Clean up project\n3. Install dependencies\n4. Initialize database\n5. Start application\n6. Build unified app for Render\n7. Test unified deployment locally\nEnter choice (1-7): ', (choice) => {
    switch (choice) {
      case '1':
        cleanupProject();
        installDependencies();
        initializeDatabase();
        startApplication();
        break;
      case '2':
        cleanupProject();
        rl.close();
        break;
      case '3':
        installDependencies();
        rl.close();
        break;
      case '4':
        initializeDatabase();
        rl.close();
        break;
      case '5':
        startApplication();
        break;
      case '6':
        buildUnifiedApp();
        rl.close();
        break;
      case '7':
        testUnifiedDeployment();
        break;
      default:
        console.log('Invalid choice. Please enter a number between 1 and 7.');
        rl.close();
        break;
    }
  });
}

// Run the main function
main();

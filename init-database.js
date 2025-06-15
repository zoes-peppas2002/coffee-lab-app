/**
 * Script to initialize the database
 * This replaces the previous database initialization batch files
 */
const path = require('path');
const { spawn } = require('child_process');

// Function to run the database initialization
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    console.log('Initializing database...');
    
    const node = spawn('node', ['init-db.js'], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'inherit',
      shell: true
    });

    node.on('error', (err) => {
      console.error('Failed to initialize database:', err);
      reject(err);
    });

    node.on('close', (code) => {
      if (code === 0) {
        console.log('Database initialized successfully.');
        resolve();
      } else {
        console.error(`Database initialization failed with code ${code}.`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

// Main function
async function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - DATABASE INITIALIZATION');
  console.log('=================================================');
  
  try {
    await initializeDatabase();
    console.log('\nDatabase setup completed successfully!');
    console.log('You can now run the application with:');
    console.log('node start-app.js');
  } catch (error) {
    console.error('\nFailed to initialize database:', error.message);
    process.exit(1);
  }
}

// Start the database initialization
main();

/**
 * Fix Database URL Script
 * 
 * This script fixes the database URL format in the .env.production file
 * and ensures it's correctly used in the application.
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('COFFEE LAB - FIX DATABASE URL');
console.log('='.repeat(60));
console.log('This script will fix the database URL format in the .env.production file.');

// Function to update a file with new content
function updateFile(filePath, newContent) {
  try {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Updated ${filePath}`);
    return true;
  } catch (err) {
    console.error(`❌ Error updating ${filePath}:`, err.message);
    return false;
  }
}

// Function to check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// 1. Update backend/.env.production
console.log('\nStep 1: Updating backend/.env.production...');
const envProductionPath = path.join(__dirname, 'backend', '.env.production');

if (fileExists(envProductionPath)) {
  const envProductionContent = fs.readFileSync(envProductionPath, 'utf8');
  
  // Check if the DATABASE_URL is in the correct format
  const dbUrlRegex = /DATABASE_URL\s*=\s*(.*)/;
  const dbUrlMatch = envProductionContent.match(dbUrlRegex);
  
  if (dbUrlMatch) {
    const currentDbUrl = dbUrlMatch[1];
    console.log(`Current DATABASE_URL: ${currentDbUrl}`);
    
    // Fix the DATABASE_URL format if needed
    let updatedDbUrl = currentDbUrl;
    
    // Make sure it has the correct format with the hostname
    if (!updatedDbUrl.includes('frankfurt-postgres.render.com')) {
      // Extract user, password, and database from the URL
      const urlParts = updatedDbUrl.split('@');
      let credentials = '';
      let dbPart = '';
      
      if (urlParts.length === 2) {
        credentials = urlParts[0];
        dbPart = urlParts[1];
      } else {
        console.error('❌ Could not parse DATABASE_URL');
        dbPart = updatedDbUrl;
      }
      
      // Reconstruct the URL with the correct hostname
      updatedDbUrl = `${credentials}@dpg-d18qgkruibrs73duejs0-a.frankfurt-postgres.render.com/${dbPart}`;
      console.log(`Updated DATABASE_URL: ${updatedDbUrl}`);
    }
    
    // Make sure it starts with postgresql://
    if (!updatedDbUrl.startsWith('postgresql://')) {
      updatedDbUrl = `postgresql://${updatedDbUrl}`;
      console.log(`Added protocol to DATABASE_URL: ${updatedDbUrl}`);
    }
    
    // Update the .env.production file
    const updatedEnvProductionContent = envProductionContent.replace(
      dbUrlRegex,
      `DATABASE_URL=${updatedDbUrl}`
    );
    
    updateFile(envProductionPath, updatedEnvProductionContent);
  } else {
    console.log('❌ DATABASE_URL not found in .env.production');
    
    // Add the DATABASE_URL to the .env.production file
    const updatedEnvProductionContent = envProductionContent + 
      '\nDATABASE_URL=postgresql://coffee_lab_user:jz5x00jzGHaKyrqDWehqfsCu6vRb688b@dpg-d18qgkruibrs73duejs0-a.frankfurt-postgres.render.com/coffee_lab_db_dldc\n';
    
    updateFile(envProductionPath, updatedEnvProductionContent);
  }
} else {
  console.error(`❌ File not found: ${envProductionPath}`);
  
  // Create the .env.production file
  const envProductionContent = 
    'NODE_ENV=production\n' +
    'PORT=10000\n' +
    'DATABASE_URL=postgresql://coffee_lab_user:jz5x00jzGHaKyrqDWehqfsCu6vRb688b@dpg-d18qgkruibrs73duejs0-a.frankfurt-postgres.render.com/coffee_lab_db_dldc\n';
  
  updateFile(envProductionPath, envProductionContent);
}

// 2. Update backend/db-pg.js
console.log('\nStep 2: Updating backend/db-pg.js...');
const dbPgPath = path.join(__dirname, 'backend', 'db-pg.js');

if (fileExists(dbPgPath)) {
  const dbPgContent = fs.readFileSync(dbPgPath, 'utf8');
  
  // Update the db-pg.js file to handle the DATABASE_URL format
  const updatedDbPgContent = dbPgContent.replace(
    `const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});`,
    `const { Pool } = require('pg');

// Log the DATABASE_URL for debugging (without the password)
const dbUrlForLogging = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL.replace(/:[^:]*@/, ':***@') 
  : 'Not set';
console.log('PostgreSQL connection string:', dbUrlForLogging);

// Create a connection pool with the DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL database:', err.message);
    console.error('Database URL format might be incorrect.');
  } else {
    console.log('✅ Successfully connected to PostgreSQL database at:', res.rows[0].now);
  }
});`
  );
  
  updateFile(dbPgPath, updatedDbPgContent);
} else {
  console.error(`❌ File not found: ${dbPgPath}`);
}

// 3. Create a script to test the database connection
console.log('\nStep 3: Creating test-database-connection.js...');
const testDbPath = path.join(__dirname, 'test-database-connection.js');

const testDbContent = `/**
 * Test Database Connection Script
 * 
 * This script tests the connection to the PostgreSQL database on Render.
 */

require('dotenv').config({ path: './backend/.env.production' });
const { Pool } = require('pg');

console.log('='.repeat(60));
console.log('COFFEE LAB - TEST DATABASE CONNECTION');
console.log('='.repeat(60));

// Log the DATABASE_URL for debugging (without the password)
const dbUrlForLogging = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL.replace(/:[^:]*@/, ':***@') 
  : 'Not set';
console.log('PostgreSQL connection string:', dbUrlForLogging);

// Create a connection pool with the DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the database connection
async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Successfully connected to PostgreSQL database at:', res.rows[0].now);
    
    // Check if the users table exists
    try {
      const usersRes = await pool.query('SELECT * FROM users LIMIT 1');
      console.log('✅ Users table exists with', usersRes.rowCount, 'rows');
      
      if (usersRes.rows.length > 0) {
        console.log('Sample user:', JSON.stringify(usersRes.rows[0], null, 2));
      }
    } catch (tableErr) {
      console.error('❌ Error querying users table:', tableErr.message);
      
      // Create the users table if it doesn't exist
      try {
        console.log('Creating users table...');
        await pool.query(\`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        \`);
        console.log('✅ Users table created successfully');
        
        // Insert a default admin user
        await pool.query(\`
          INSERT INTO users (name, email, password, role)
          VALUES ('Admin', 'zp@coffeelab.gr', 'Zoespeppas2025!', 'admin')
          ON CONFLICT (email) DO NOTHING
        \`);
        console.log('✅ Default admin user created');
      } catch (createErr) {
        console.error('❌ Error creating users table:', createErr.message);
      }
    }
    
    // Close the connection pool
    await pool.end();
  } catch (err) {
    console.error('❌ Error connecting to PostgreSQL database:', err.message);
    console.error('Database URL format might be incorrect.');
    
    // Try to parse the DATABASE_URL to check for format issues
    try {
      const url = new URL(process.env.DATABASE_URL);
      console.log('URL protocol:', url.protocol);
      console.log('URL hostname:', url.hostname);
      console.log('URL pathname:', url.pathname);
    } catch (parseErr) {
      console.error('❌ Error parsing DATABASE_URL:', parseErr.message);
    }
  }
}

// Run the test
testConnection();
`;

updateFile(testDbPath, testDbContent);

// 4. Create a batch file to run the fix and test
console.log('\nStep 4: Creating fix-database-url.bat...');
const batchPath = path.join(__dirname, 'fix-database-url.bat');

const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX DATABASE URL
echo ===================================
echo.

echo Step 1: Running the fix script...
node fix-database-url.js
if %ERRORLEVEL% NEQ 0 (
  echo Error running fix script!
  exit /b %ERRORLEVEL%
)
echo.

echo Step 2: Testing database connection...
node test-database-connection.js
if %ERRORLEVEL% NEQ 0 (
  echo Warning: Database connection test failed, but continuing...
)
echo.

echo Step 3: Committing changes...
call commit-all-changes.bat "Fix database URL format"
if %ERRORLEVEL% NEQ 0 (
  echo Error committing changes!
  exit /b %ERRORLEVEL%
)
echo.

echo Step 4: Deploying to Render...
call deploy-to-render.bat
if %ERRORLEVEL% NEQ 0 (
  echo Error deploying to Render!
  exit /b %ERRORLEVEL%
)
echo.

echo All steps completed successfully!
echo Please check the Render dashboard for deployment status.
echo.

pause
`;

updateFile(batchPath, batchContent);

// 5. Create a summary file
console.log('\nStep 5: Creating database-url-fix-summary.md...');
const summaryPath = path.join(__dirname, 'database-url-fix-summary.md');

const summaryContent = `# Database URL Fix Summary

## Προβλήματα που Εντοπίστηκαν

1. **Λανθασμένη μορφή του DATABASE_URL**: Το DATABASE_URL στο αρχείο .env.production ενδέχεται να μην έχει τη σωστή μορφή.

2. **Προβλήματα σύνδεσης με τη βάση δεδομένων**: Τα logs δείχνουν ότι υπάρχουν συνδέσεις στη βάση δεδομένων, αλλά ενδέχεται να υπάρχουν προβλήματα με τα ερωτήματα SQL.

3. **Πιθανή απουσία του πίνακα users**: Ο πίνακας users ενδέχεται να μην υπάρχει ή να μην έχει τα σωστά δεδομένα.

## Λύσεις που Εφαρμόστηκαν

### 1. Διόρθωση του DATABASE_URL

- Ενημερώθηκε το αρχείο backend/.env.production με το σωστό DATABASE_URL:
  \`\`\`
  postgresql://coffee_lab_user:jz5x00jzGHaKyrqDWehqfsCu6vRb688b@dpg-d18qgkruibrs73duejs0-a.frankfurt-postgres.render.com/coffee_lab_db_dldc
  \`\`\`

### 2. Βελτίωση του backend/db-pg.js

- Προστέθηκε λεπτομερής καταγραφή του DATABASE_URL για αποσφαλμάτωση
- Προστέθηκε δοκιμή σύνδεσης με τη βάση δεδομένων κατά την εκκίνηση

### 3. Δημιουργία Script Δοκιμής Σύνδεσης

- Δημιουργήθηκε το \`test-database-connection.js\` για να δοκιμάζει τη σύνδεση με τη βάση δεδομένων
- Το script ελέγχει αν υπάρχει ο πίνακας users και τον δημιουργεί αν δεν υπάρχει
- Προσθέτει έναν προεπιλεγμένο χρήστη admin αν δεν υπάρχει

## Πώς να Δοκιμάσετε τις Διορθώσεις

1. Εκτελέστε το script \`fix-database-url.bat\` για να εφαρμόσετε όλες τις διορθώσεις και να αναπτύξετε στο Render:
   \`\`\`
   fix-database-url.bat
   \`\`\`

2. Δοκιμάστε τη σύνδεση με τα στοιχεία του admin:
   - Email: zp@coffeelab.gr
   - Password: Zoespeppas2025!

## Αντιμετώπιση Προβλημάτων

Αν εξακολουθείτε να αντιμετωπίζετε προβλήματα:

1. Ελέγξτε τα logs του Render για τυχόν σφάλματα
2. Βεβαιωθείτε ότι το DATABASE_URL είναι σωστό στις μεταβλητές περιβάλλοντος του Render
3. Δοκιμάστε να συνδεθείτε απευθείας στη βάση δεδομένων PostgreSQL μέσω του Render dashboard
4. Ελέγξτε αν υπάρχει ο πίνακας users και αν περιέχει τα σωστά δεδομένα
`;

updateFile(summaryPath, summaryContent);

console.log('\nAll fixes have been applied!');
console.log('To run the fix and deploy, execute:');
console.log('  fix-database-url.bat');
console.log('\nSee database-url-fix-summary.md for more details.');

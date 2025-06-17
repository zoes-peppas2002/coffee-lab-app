/**
 * Create and Populate Database
 * 
 * This script creates the database and populates it with the necessary data.
 * It also skips the email constraint command in PostgreSQL.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

console.log('=================================================');
console.log('COFFEE LAB - CREATE AND POPULATE DATABASE');
console.log('=================================================');
console.log('This script will create the database and populate it with the necessary data.');
console.log('');

// Define the database connection options
const connectionOptions = [
  {
    name: "Render PostgreSQL (External)",
    url: "postgresql://coffee_lab_user:JZBtkeHcgpITKIKBJj6Dw7M4eAIMgh2r@dpg-d17f1iemcj7s73d4rhb0-a/coffee_lab_db_lyf9",
    ssl: { rejectUnauthorized: false }
  },
  {
    name: "Render PostgreSQL (Internal)",
    url: "postgresql://coffee_lab_user:JZBtkeHcgpITKIKBJj6Dw7M4eAIMgh2r@dpg-d17f1iemcj7s73d4rhb0-a/coffee_lab_db_lyf9",
    ssl: { rejectUnauthorized: false }
  },
  {
    name: "Local PostgreSQL",
    url: "postgresql://postgres:postgres@localhost:5432/coffee_lab_db",
    ssl: false
  }
];

// Create the SQL files with the correct schema
function createSqlFiles() {
  console.log('Creating SQL files...');
  
  // Create users table SQL (without email constraint)
  const createUsersTableSql = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create default admin user
INSERT INTO users (username, password, email, role, active)
VALUES ('admin', '$2b$10$X/QQDHpNbEfbDOu8vNZQo.LnYIAc5qpoDHrDCZ5FgYP.KQ4jHzWXa', 'admin@coffeelab.gr', 'admin', true)
ON CONFLICT (username) DO NOTHING;
`;
  
  // Create network table SQL
  const createNetworkTableSql = `
-- Create network table
CREATE TABLE IF NOT EXISTS network (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample network data
INSERT INTO network (name, address, city, active)
VALUES 
  ('Σύνταγμα', 'Πλατεία Συντάγματος 10', 'Αθήνα', true),
  ('Ομόνοια', 'Πλατεία Ομονοίας 5', 'Αθήνα', true),
  ('Μοσχάτο', 'Πειραιώς 74', 'Αθήνα', true),
  ('Σοφοκλέους', 'Σοφοκλέους 15', 'Αθήνα', true)
ON CONFLICT DO NOTHING;
`;
  
  // Create stores table SQL
  const createStoresTableSql = `
-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  network_id INTEGER REFERENCES network(id),
  address VARCHAR(255),
  city VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample store data
INSERT INTO stores (name, network_id, address, city, active)
VALUES 
  ('Σύνταγμα 1', 1, 'Πλατεία Συντάγματος 10', 'Αθήνα', true),
  ('Ομόνοια 1', 2, 'Πλατεία Ομονοίας 5', 'Αθήνα', true),
  ('Μοσχάτο 1', 3, 'Πειραιώς 74', 'Αθήνα', true),
  ('Σοφοκλέους 1', 4, 'Σοφοκλέους 15', 'Αθήνα', true)
ON CONFLICT DO NOTHING;
`;
  
  // Create checklist templates table SQL
  const createChecklistTemplatesSql = `
-- Create checklist_templates table
CREATE TABLE IF NOT EXISTS checklist_templates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sections JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample checklist template
INSERT INTO checklist_templates (title, description, sections, active)
VALUES (
  'Έλεγχος Καταστήματος',
  'Πρότυπο ελέγχου καταστήματος Coffee Lab',
  '[
    {
      "title": "Καθαριότητα",
      "items": [
        {"text": "Καθαρά τραπέζια", "type": "checkbox"},
        {"text": "Καθαρό πάτωμα", "type": "checkbox"},
        {"text": "Καθαρές τουαλέτες", "type": "checkbox"},
        {"text": "Σχόλια", "type": "text"}
      ]
    },
    {
      "title": "Εξυπηρέτηση",
      "items": [
        {"text": "Χρόνος αναμονής", "type": "rating", "max": 5},
        {"text": "Ευγένεια προσωπικού", "type": "rating", "max": 5},
        {"text": "Γνώση προϊόντων", "type": "rating", "max": 5},
        {"text": "Σχόλια", "type": "text"}
      ]
    },
    {
      "title": "Ποιότητα Προϊόντων",
      "items": [
        {"text": "Καφές", "type": "rating", "max": 5},
        {"text": "Γλυκά", "type": "rating", "max": 5},
        {"text": "Αλμυρά", "type": "rating", "max": 5},
        {"text": "Σχόλια", "type": "text"}
      ]
    }
  ]'::jsonb,
  true
)
ON CONFLICT DO NOTHING;
`;
  
  // Create checklists table SQL
  const createChecklistsSql = `
-- Create checklists table
CREATE TABLE IF NOT EXISTS checklists (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES checklist_templates(id),
  store_id INTEGER REFERENCES stores(id),
  user_id INTEGER REFERENCES users(id),
  completed BOOLEAN DEFAULT false,
  responses JSONB,
  score INTEGER,
  max_score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample checklist data
INSERT INTO checklists (template_id, store_id, user_id, completed, responses, score, max_score)
VALUES (
  1, 1, 1, true,
  '[
    {
      "title": "Καθαριότητα",
      "items": [
        {"text": "Καθαρά τραπέζια", "type": "checkbox", "value": true},
        {"text": "Καθαρό πάτωμα", "type": "checkbox", "value": true},
        {"text": "Καθαρές τουαλέτες", "type": "checkbox", "value": false},
        {"text": "Σχόλια", "type": "text", "value": "Οι τουαλέτες χρειάζονται καθάρισμα"}
      ]
    },
    {
      "title": "Εξυπηρέτηση",
      "items": [
        {"text": "Χρόνος αναμονής", "type": "rating", "max": 5, "value": 4},
        {"text": "Ευγένεια προσωπικού", "type": "rating", "max": 5, "value": 5},
        {"text": "Γνώση προϊόντων", "type": "rating", "max": 5, "value": 3},
        {"text": "Σχόλια", "type": "text", "value": "Πολύ καλή εξυπηρέτηση αλλά χρειάζεται περισσότερη εκπαίδευση στα προϊόντα"}
      ]
    },
    {
      "title": "Ποιότητα Προϊόντων",
      "items": [
        {"text": "Καφές", "type": "rating", "max": 5, "value": 5},
        {"text": "Γλυκά", "type": "rating", "max": 5, "value": 4},
        {"text": "Αλμυρά", "type": "rating", "max": 5, "value": 4},
        {"text": "Σχόλια", "type": "text", "value": "Εξαιρετικός καφές, τα γλυκά και τα αλμυρά πολύ καλά"}
      ]
    }
  ]'::jsonb,
  25, 30
)
ON CONFLICT DO NOTHING;
`;
  
  // Write the SQL files
  const sqlDir = path.join(__dirname, 'backend', 'sql');
  if (!fs.existsSync(sqlDir)) {
    fs.mkdirSync(sqlDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(sqlDir, 'create-users-table.sql'), createUsersTableSql);
  fs.writeFileSync(path.join(sqlDir, 'create-network-table.sql'), createNetworkTableSql);
  fs.writeFileSync(path.join(sqlDir, 'create-stores-table.sql'), createStoresTableSql);
  fs.writeFileSync(path.join(sqlDir, 'create-checklist-templates.sql'), createChecklistTemplatesSql);
  fs.writeFileSync(path.join(sqlDir, 'create-checklists.sql'), createChecklistsSql);
  
  console.log('✅ SQL files created successfully.');
}

// Function to execute SQL file
async function executeSqlFile(pool, filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);
    console.log(`✅ Executed SQL file: ${path.basename(filePath)}`);
    return true;
  } catch (err) {
    console.error(`❌ Error executing SQL file ${path.basename(filePath)}:`, err.message);
    return false;
  }
}

// Function to create and populate the database
async function createAndPopulateDatabase() {
  console.log('Creating SQL files...');
  createSqlFiles();
  
  console.log('\nTrying to connect to the database...');
  
  let pool = null;
  let connectedOption = null;
  
  // Try each connection option
  for (const option of connectionOptions) {
    console.log(`\nTrying connection: ${option.name}`);
    console.log(`URL: ${option.url}`);
    console.log(`SSL: ${option.ssl ? 'Enabled' : 'Disabled'}`);
    
    try {
      pool = new Pool({
        connectionString: option.url,
        ssl: option.ssl
      });
      
      // Test the connection
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Connection successful!');
      console.log(`Current database time: ${result.rows[0].now}`);
      
      connectedOption = option;
      break;
    } catch (err) {
      console.error(`❌ Connection failed: ${err.message}`);
      if (pool) {
        await pool.end();
        pool = null;
      }
    }
  }
  
  if (!pool) {
    console.error('\n❌ Could not connect to any database.');
    console.log('Please check your database credentials and try again.');
    return false;
  }
  
  // Execute the SQL files
  console.log('\nCreating and populating database tables...');
  
  const sqlDir = path.join(__dirname, 'backend', 'sql');
  const sqlFiles = [
    'create-users-table.sql',
    'create-network-table.sql',
    'create-stores-table.sql',
    'create-checklist-templates.sql',
    'create-checklists.sql'
  ];
  
  for (const sqlFile of sqlFiles) {
    const filePath = path.join(sqlDir, sqlFile);
    await executeSqlFile(pool, filePath);
  }
  
  // List all tables
  console.log('\nListing all tables...');
  try {
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Tables in the database:');
      tablesResult.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
  } catch (err) {
    console.error('❌ Error listing tables:', err.message);
  }
  
  // Count rows in each table
  console.log('\nCounting rows in each table...');
  const tables = ['users', 'network', 'stores', 'checklist_templates', 'checklists'];
  
  for (const table of tables) {
    try {
      const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`- ${table}: ${countResult.rows[0].count} rows`);
    } catch (err) {
      console.error(`❌ Error counting rows in ${table}:`, err.message);
    }
  }
  
  // Update the connection configuration with the successful option
  if (connectedOption) {
    console.log('\nUpdating connection configuration...');
    
    // Update db-pg.js
    const dbPgPath = path.join(__dirname, 'backend', 'db-pg.js');
    const dbPgContent = `const { Pool } = require('pg');

// Get the DATABASE_URL from environment variables
const databaseUrl = process.env.DATABASE_URL || '${connectedOption.url}';

// Create a new pool using the connection string
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: ${connectedOption.ssl ? 'process.env.NODE_ENV === \'production\' ? { rejectUnauthorized: false } : false' : 'false'}
});

// Export the pool for use in other modules
module.exports = pool;
`;
    
    fs.writeFileSync(dbPgPath, dbPgContent);
    console.log('✅ db-pg.js updated successfully.');
    
    // Update .env.production
    const envProductionPath = path.join(__dirname, 'backend', '.env.production');
    const envProductionContent = `NODE_ENV=production
DATABASE_URL=${connectedOption.url}
PORT=10000
`;
    
    fs.writeFileSync(envProductionPath, envProductionContent);
    console.log('✅ .env.production updated successfully.');
    
    // Update .env
    const envPath = path.join(__dirname, 'backend', '.env');
    const envContent = `NODE_ENV=development
DATABASE_URL=${connectedOption.url}
PORT=3001
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env updated successfully.');
  }
  
  // Close the connection pool
  if (pool) {
    await pool.end();
  }
  
  console.log('\n=================================================');
  console.log('DATABASE CREATION AND POPULATION COMPLETED');
  console.log('=================================================');
  
  return true;
}

// Create a batch file to run this script
function createBatchFile() {
  console.log('\nCreating create-and-populate-db.bat...');
  const batchPath = path.join(__dirname, 'create-and-populate-db.bat');
  
  const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - CREATE AND POPULATE DATABASE
echo ===================================
echo.
echo This script will create the database and populate it with the necessary data.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running create-and-populate-db.js...
node create-and-populate-db.js

echo.
echo Press any key to exit...
pause > nul`;
  
  fs.writeFileSync(batchPath, batchContent);
  console.log('✅ create-and-populate-db.bat created successfully.');
  
  // Update fix-everything-and-deploy.bat
  console.log('\nUpdating fix-everything-and-deploy.bat...');
  const fixEverythingPath = path.join(__dirname, 'fix-everything-and-deploy.bat');
  
  if (fs.existsSync(fixEverythingPath)) {
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
echo Step 2: Creating and populating database...
call create-and-populate-db.bat

echo.
echo Step 3: Fixing scripts...
call fix-scripts.bat

echo.
echo Step 4: Fixing database connection...
call fix-db-connection.bat

echo.
echo Step 5: Fixing all database issues...
call fix-all-database-issues.bat

echo.
echo Step 6: Fixing dependencies...
call fix-render-dependencies.bat

echo.
echo Step 7: Fixing path-to-regexp error...
call fix-path-to-regexp-error.bat

echo.
echo Step 8: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 9: Deploying to Render...
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
}

// Main function
async function main() {
  try {
    // Create SQL files
    createSqlFiles();
    
    // Create and populate the database
    const success = await createAndPopulateDatabase();
    
    // Create batch file
    createBatchFile();
    
    if (success) {
      console.log('\nThe database has been created and populated successfully.');
      console.log('You can now run fix-everything-and-deploy.bat to deploy to Render.');
    } else {
      console.log('\nThere were errors creating and populating the database.');
      console.log('Please check the error messages above and try again.');
    }
  } catch (err) {
    console.error('❌ Unhandled error:', err);
  }
}

// Run the main function
main();

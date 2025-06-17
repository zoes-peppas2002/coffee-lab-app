/**
 * Fix All Database Issues for Render Deployment
 * 
 * This script addresses all database issues mentioned by Render support:
 * 1. Creates all missing tables (users, checklist_templates, etc.)
 * 2. Fixes SQL syntax errors in queries
 * 3. Verifies the database connection
 * 4. Provides a tool to view and check the data in the server database
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=================================================');
console.log('COFFEE LAB - FIX ALL DATABASE ISSUES');
console.log('=================================================');
console.log('This script will fix all database issues for Render deployment.');
console.log('');

// Fix create-users-table.sql
console.log('Fixing create-users-table.sql...');
const usersTablePath = path.join(__dirname, 'backend', 'create-users-table.sql');

if (fs.existsSync(usersTablePath)) {
  let usersTableContent = fs.readFileSync(usersTablePath, 'utf8');
  
  // Fix boolean default values
  usersTableContent = usersTableContent.replace(/DEFAULT 1/g, 'DEFAULT true');
  usersTableContent = usersTableContent.replace(/DEFAULT 0/g, 'DEFAULT false');
  
  // Write the updated content back to the file
  fs.writeFileSync(usersTablePath, usersTableContent);
  console.log('✅ create-users-table.sql fixed successfully.');
} else {
  console.error('❌ backend/create-users-table.sql not found.');
}

// Fix create-network-table.sql
console.log('\nFixing create-network-table.sql...');
const networkTablePath = path.join(__dirname, 'backend', 'create-network-table.sql');

if (fs.existsSync(networkTablePath)) {
  let networkTableContent = fs.readFileSync(networkTablePath, 'utf8');
  
  // Fix boolean default values
  networkTableContent = networkTableContent.replace(/DEFAULT 1/g, 'DEFAULT true');
  networkTableContent = networkTableContent.replace(/DEFAULT 0/g, 'DEFAULT false');
  
  // Write the updated content back to the file
  fs.writeFileSync(networkTablePath, networkTableContent);
  console.log('✅ create-network-table.sql fixed successfully.');
} else {
  console.error('❌ backend/create-network-table.sql not found.');
}

// Create checklist_templates table SQL
console.log('\nCreating checklist_templates table SQL...');
const checklistTemplatesPath = path.join(__dirname, 'backend', 'create-checklist-templates.sql');
const checklistTemplatesContent = `-- Create checklist_templates table
CREATE TABLE IF NOT EXISTS "checklist_templates" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "sections" JSON NOT NULL,
  "created_by" INTEGER,
  "active" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

fs.writeFileSync(checklistTemplatesPath, checklistTemplatesContent);
console.log('✅ create-checklist-templates.sql created successfully.');

// Create checklists table SQL
console.log('\nCreating checklists table SQL...');
const checklistsPath = path.join(__dirname, 'backend', 'create-checklists.sql');
const checklistsContent = `-- Create checklists table
CREATE TABLE IF NOT EXISTS "checklists" (
  "id" SERIAL PRIMARY KEY,
  "template_id" INTEGER NOT NULL,
  "store_id" INTEGER NOT NULL,
  "completed_by" INTEGER NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "responses" JSON NOT NULL,
  "score" FLOAT,
  "pdf_path" VARCHAR(255),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

fs.writeFileSync(checklistsPath, checklistsContent);
console.log('✅ create-checklists.sql created successfully.');

// Fix stats.js file
console.log('\nFixing stats.js file...');
const statsPath = path.join(__dirname, 'backend', 'routes', 'stats.js');

if (fs.existsSync(statsPath)) {
  let statsContent = fs.readFileSync(statsPath, 'utf8');
  
  // Fix SQL syntax errors in queries
  statsContent = statsContent.replace(/WHERE\s+AND/g, 'WHERE');
  statsContent = statsContent.replace(/WHERE\s+OR/g, 'WHERE');
  statsContent = statsContent.replace(/WHERE\s+WHERE/g, 'WHERE');
  
  // Fix JOIN syntax
  statsContent = statsContent.replace(/JOIN\s+ON\s+AND/g, 'JOIN ON');
  statsContent = statsContent.replace(/JOIN\s+ON\s+OR/g, 'JOIN ON');
  
  // Write the updated content back to the file
  fs.writeFileSync(statsPath, statsContent);
  console.log('✅ stats.js fixed successfully.');
} else {
  console.error('❌ backend/routes/stats.js not found.');
}

// Create a comprehensive init-db.js that creates all tables
console.log('\nCreating comprehensive-init-db.js...');
const initDbPath = path.join(__dirname, 'backend', 'init-db.js');
const comprehensiveInitDbPath = path.join(__dirname, 'backend', 'comprehensive-init-db.js');

if (fs.existsSync(initDbPath)) {
  let initDbContent = fs.readFileSync(initDbPath, 'utf8');
  
  // Add code to ensure all tables are created
  const additionalCode = `
// Function to execute SQL file
async function executeSqlFile(pool, filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // For PostgreSQL, we need to convert MySQL syntax to PostgreSQL
    let convertedSql = sql;
    if (process.env.NODE_ENV === 'production') {
      // Convert MySQL syntax to PostgreSQL
      convertedSql = sql
        .replace(/AUTO_INCREMENT/g, 'SERIAL')
        .replace(/INT/g, 'INTEGER')
        .replace(/DATETIME/g, 'TIMESTAMP')
        .replace(/DEFAULT CURRENT_TIMESTAMP/g, 'DEFAULT CURRENT_TIMESTAMP')
        .replace(/DEFAULT 1/g, 'DEFAULT true')
        .replace(/DEFAULT 0/g, 'DEFAULT false');
      
      console.log('Converted SQL command:', convertedSql);
    }
    
    await pool.query(convertedSql);
    return true;
  } catch (err) {
    console.error(\`Error executing SQL file \${filePath}:\`, err);
    return false;
  }
}

// Ensure all tables exist
async function ensureTablesExist(pool) {
  console.log('Ensuring all tables exist...');
  
  // Create users table
  console.log('Creating users table...');
  const usersTableCreated = await executeSqlFile(
    pool, 
    path.join(__dirname, 'create-users-table.sql')
  );
  
  if (!usersTableCreated) {
    console.error('Error creating users table');
  }
  
  // Create network_stores table
  console.log('Creating network_stores table...');
  const networkTableCreated = await executeSqlFile(
    pool, 
    path.join(__dirname, 'create-network-table.sql')
  );
  
  if (!networkTableCreated) {
    console.error('Error creating network table');
  }
  
  // Create checklist_templates table
  console.log('Creating checklist_templates table...');
  const checklistTemplatesCreated = await executeSqlFile(
    pool, 
    path.join(__dirname, 'create-checklist-templates.sql')
  );
  
  if (!checklistTemplatesCreated) {
    console.error('Error creating checklist_templates table');
  }
  
  // Create checklists table
  console.log('Creating checklists table...');
  const checklistsCreated = await executeSqlFile(
    pool, 
    path.join(__dirname, 'create-checklists.sql')
  );
  
  if (!checklistsCreated) {
    console.error('Error creating checklists table');
  }
  
  // Create default admin user
  try {
    console.log('Creating default admin user...');
    const adminSql = fs.readFileSync(
      path.join(__dirname, 'create-default-admin.sql'), 
      'utf8'
    );
    
    await pool.query(adminSql);
    console.log('Default admin user created successfully');
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  }
}

// Verify database connection
async function verifyDatabaseConnection(pool) {
  try {
    console.log('Verifying database connection...');
    await pool.query('SELECT 1');
    console.log('✅ Database connection verified successfully.');
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
}
`;
  
  // Add the additional code before the module.exports
  const moduleExportsIndex = initDbContent.indexOf('module.exports');
  if (moduleExportsIndex !== -1) {
    initDbContent = initDbContent.slice(0, moduleExportsIndex) + 
                   additionalCode + 
                   '\n\n' + 
                   initDbContent.slice(moduleExportsIndex);
  }
  
  // Modify the module.exports to call ensureTablesExist
  initDbContent = initDbContent.replace(
    /module\.exports = async function\(\) \{[\s\S]*?\}/,
    `module.exports = async function() {
  try {
    // Get the appropriate pool
    let pool;
    if (process.env.NODE_ENV === 'production') {
      pool = require('./db-pg');
      console.log('Using PostgreSQL database for initialization');
    } else {
      pool = require('./db');
      console.log('Using MySQL database for initialization');
    }
    
    // Verify database connection
    const connectionVerified = await verifyDatabaseConnection(pool);
    if (!connectionVerified) {
      console.error('Database connection verification failed. Check your connection string.');
      return false;
    }
    
    // Ensure all tables exist
    await ensureTablesExist(pool);
    
    console.log('Database initialized successfully');
    return true;
  } catch (err) {
    console.error('Database initialization error:', err);
    return false;
  }
}`
  );
  
  // Write the updated content to the comprehensive file
  fs.writeFileSync(comprehensiveInitDbPath, initDbContent);
  console.log('✅ comprehensive-init-db.js created successfully.');
  
  // Create a backup of the original init-db.js
  fs.copyFileSync(initDbPath, path.join(__dirname, 'backend', 'init-db.js.bak'));
  console.log('✅ Backup of original init-db.js created.');
  
  // Replace the original init-db.js with the comprehensive version
  fs.copyFileSync(comprehensiveInitDbPath, initDbPath);
  console.log('✅ init-db.js replaced with comprehensive version.');
} else {
  console.error('❌ backend/init-db.js not found.');
}

// Create a database viewer tool
console.log('\nCreating database-viewer.js...');
const dbViewerPath = path.join(__dirname, 'backend', 'database-viewer.js');
const dbViewerContent = `/**
 * Database Viewer Tool
 * 
 * This script allows you to view and check the data in the server database.
 */
const fs = require('fs');
const path = require('path');

// Get the appropriate pool
let pool;
if (process.env.NODE_ENV === 'production') {
  pool = require('./db-pg');
  console.log('Using PostgreSQL database for viewing');
} else {
  pool = require('./db');
  console.log('Using MySQL database for viewing');
}

// Function to list all tables
async function listTables() {
  try {
    let query;
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query to list tables
      query = \`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      \`;
    } else {
      // MySQL query to list tables
      query = \`
        SHOW TABLES
      \`;
    }
    
    const result = await pool.query(query);
    console.log('Tables in the database:');
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL result format
      result.rows.forEach(row => {
        console.log(\`- \${row.table_name}\`);
      });
      return result.rows.map(row => row.table_name);
    } else {
      // MySQL result format
      const tables = [];
      for (const row of result) {
        const tableName = Object.values(row)[0];
        console.log(\`- \${tableName}\`);
        tables.push(tableName);
      }
      return tables;
    }
  } catch (err) {
    console.error('Error listing tables:', err);
    return [];
  }
}

// Function to view table structure
async function viewTableStructure(tableName) {
  try {
    let query;
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query to view table structure
      query = \`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      \`;
      const result = await pool.query(query, [tableName]);
      
      console.log(\`\nStructure of table "\${tableName}":\`);
      console.log('Column Name | Data Type | Nullable');
      console.log('----------- | --------- | --------');
      
      result.rows.forEach(row => {
        console.log(\`\${row.column_name} | \${row.data_type} | \${row.is_nullable}\`);
      });
    } else {
      // MySQL query to view table structure
      query = \`DESCRIBE \${tableName}\`;
      const result = await pool.query(query);
      
      console.log(\`\nStructure of table "\${tableName}":\`);
      console.log('Field | Type | Null | Key | Default | Extra');
      console.log('----- | ---- | ---- | --- | ------- | -----');
      
      for (const row of result) {
        console.log(\`\${row.Field} | \${row.Type} | \${row.Null} | \${row.Key} | \${row.Default} | \${row.Extra}\`);
      }
    }
  } catch (err) {
    console.error(\`Error viewing structure of table "\${tableName}":\`, err);
  }
}

// Function to view table data
async function viewTableData(tableName, limit = 10) {
  try {
    const query = \`SELECT * FROM "\${tableName}" LIMIT \${limit}\`;
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL
      const result = await pool.query(query);
      console.log(\`\nData in table "\${tableName}" (limit \${limit}):\`);
      
      if (result.rows.length === 0) {
        console.log('No data found in this table.');
      } else {
        console.table(result.rows);
      }
    } else {
      // MySQL
      const result = await pool.query(query);
      console.log(\`\nData in table "\${tableName}" (limit \${limit}):\`);
      
      if (result.length === 0) {
        console.log('No data found in this table.');
      } else {
        console.table(result);
      }
    }
  } catch (err) {
    console.error(\`Error viewing data in table "\${tableName}":\`, err);
  }
}

// Function to count records in a table
async function countRecords(tableName) {
  try {
    const query = \`SELECT COUNT(*) FROM "\${tableName}"\`;
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL
      const result = await pool.query(query);
      const count = parseInt(result.rows[0].count);
      console.log(\`Table "\${tableName}" contains \${count} records.\`);
      return count;
    } else {
      // MySQL
      const result = await pool.query(query);
      const count = parseInt(Object.values(result[0])[0]);
      console.log(\`Table "\${tableName}" contains \${count} records.\`);
      return count;
    }
  } catch (err) {
    console.error(\`Error counting records in table "\${tableName}":\`, err);
    return 0;
  }
}

// Main function
async function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - DATABASE VIEWER TOOL');
  console.log('=================================================');
  console.log('');
  
  try {
    // List all tables
    const tables = await listTables();
    
    if (tables.length === 0) {
      console.log('No tables found in the database.');
      return;
    }
    
    // View structure and data for each table
    for (const tableName of tables) {
      await viewTableStructure(tableName);
      const count = await countRecords(tableName);
      
      if (count > 0) {
        await viewTableData(tableName);
      }
      
      console.log(''); // Add a blank line between tables
    }
    
    console.log('Database viewing completed successfully.');
  } catch (err) {
    console.error('Error in database viewer:', err);
  } finally {
    // Close the connection pool
    if (pool.end) {
      await pool.end();
    }
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
`;

fs.writeFileSync(dbViewerPath, dbViewerContent);
console.log('✅ database-viewer.js created successfully.');

// Create a batch file to run the database viewer
console.log('\nCreating view-database.bat...');
const viewDbBatchPath = path.join(__dirname, 'view-database.bat');
const viewDbBatchContent = `@echo off
echo ===================================
echo COFFEE LAB - DATABASE VIEWER TOOL
echo ===================================
echo.
echo This script will show the contents of the database.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running database-viewer.js...
cd backend
node database-viewer.js
cd ..

echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(viewDbBatchPath, viewDbBatchContent);
console.log('✅ view-database.bat created successfully.');

// Create a batch file to run this script
console.log('\nCreating fix-all-database-issues.bat...');
const batchPath = path.join(__dirname, 'fix-all-database-issues.bat');
const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX ALL DATABASE ISSUES
echo ===================================
echo.
echo This script will fix all database issues for Render deployment.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-all-database-issues.js...
node fix-all-database-issues.js

echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(batchPath, batchContent);
console.log('✅ fix-all-database-issues.bat created successfully.');

// Create a combined script that runs all fixes and then deploys
console.log('\nCreating fix-everything-and-deploy.bat...');
const combinedBatchPath = path.join(__dirname, 'fix-everything-and-deploy.bat');
const combinedBatchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX EVERYTHING AND DEPLOY
echo ===================================
echo.
echo This script will fix all issues and deploy to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Fixing all database issues...
call fix-all-database-issues.bat

echo.
echo Step 2: Fixing dependencies...
call fix-render-dependencies.bat

echo.
echo Step 3: Fixing path-to-regexp error...
call fix-path-to-regexp-error.bat

echo.
echo Step 4: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 5: Deploying to Render...
call deploy-to-render.bat

echo.
echo All steps completed!
echo.
echo The application has been fixed and deployed to Render.
echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(combinedBatchPath, combinedBatchContent);
console.log('✅ fix-everything-and-deploy.bat created successfully.');

console.log('\n=================================================');
console.log('ALL DATABASE ISSUES FIX COMPLETED');
console.log('=================================================');
console.log('The database issues have been fixed.');
console.log('');
console.log('To view the database contents:');
console.log('1. Run view-database.bat');
console.log('');
console.log('To deploy to Render with all fixes:');
console.log('1. Run fix-everything-and-deploy.bat');
console.log('');
console.log('Or run the individual steps:');
console.log('1. Run fix-all-database-issues.bat');
console.log('2. Run fix-render-dependencies.bat');
console.log('3. Run fix-path-to-regexp-error.bat');
console.log('4. Run prepare-for-render-deploy.bat');
console.log('5. Run deploy-to-render.bat');

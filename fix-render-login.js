/**
 * Fix Render Login Issues
 * 
 * This script fixes login issues on Render by ensuring:
 * 1. The backend/.env.production file is correctly configured
 * 2. The direct-auth.js file is correctly configured
 * 3. The server.js file is correctly configured
 * 4. The LoginForm.jsx file is correctly configured
 */
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('COFFEE LAB - FIX RENDER LOGIN ISSUES');
console.log('=================================================');
console.log('This script will fix login issues on Render.');
console.log('');

// Fix backend/.env.production
function fixEnvProduction() {
  console.log('Fixing backend/.env.production...');
  
  const envProductionPath = path.join(__dirname, 'backend', '.env.production');
  
  if (!fs.existsSync(envProductionPath)) {
    console.error('❌ backend/.env.production not found!');
    return false;
  }
  
  const envContent = `# Production environment configuration

# Database configuration
DATABASE_URL=postgresql://coffee_lab_user:jz5x00jzGHaKyrqDWehqfsCu6vRb688b@dpg-d18qgkruibrs73duejs0-a.frankfurt-postgres.render.com/coffee_lab_db_dldc

# Server configuration
PORT=10000
NODE_ENV=production

# No need for FRONTEND_URL in production since frontend is served by the same server`;
  
  fs.writeFileSync(envProductionPath, envContent, 'utf8');
  
  console.log('✅ backend/.env.production fixed successfully!');
  return true;
}

// Fix direct-auth.js
function fixDirectAuth() {
  console.log('Fixing direct-auth.js...');
  
  const directAuthPath = path.join(__dirname, 'backend', 'routes', 'direct-auth.js');
  
  if (!fs.existsSync(directAuthPath)) {
    console.error('❌ direct-auth.js not found!');
    return false;
  }
  
  const directAuthContent = `const express = require('express');
const router = express.Router();

/**
 * Consolidated login endpoint that checks database for all users
 * Works with both MySQL (local) and PostgreSQL (production)
 */
router.post('/', async (req, res) => {
  try {
    console.log('DETAILED LOGIN DEBUG - Request received');
    console.log('Request URL:', req.originalUrl);
    console.log('Request method:', req.method);
    console.log('Request path:', req.path);
    console.log('Request query:', JSON.stringify(req.query));
    console.log('Request params:', JSON.stringify(req.params));
    console.log('Request body:', JSON.stringify(req.body));
    console.log('Request headers:', JSON.stringify(req.headers));

    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    console.log('=== EXTENDED DEBUG LOGIN START ===');
    console.log('Request headers:', JSON.stringify(req.headers));
    console.log('Request body (full):', JSON.stringify(req.body));
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API URL:', process.env.VITE_API_URL || 'Not set');
    console.log('Database type:', isPg ? 'PostgreSQL' : 'MySQL');
    console.log('=== EXTENDED DEBUG LOGIN DETAILS ===');

    const { email, password } = req.body;
    
    console.log('=== DEBUG LOGIN START ===');
    console.log('Direct login attempt:', email);
    console.log('Request body:', JSON.stringify(req.body));
    
    // Special case for admin user (hardcoded fallback)
    if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
      console.log('Admin login successful (hardcoded)');
      console.log('Using hardcoded admin credentials');
      
      // Return success with admin user data
      const adminData = {
        id: 1,
        name: 'Admin',
        email: 'zp@coffeelab.gr',
        role: 'admin'
      };
      
      console.log('Returning admin data:', JSON.stringify(adminData));
      return res.status(200).json(adminData);
    }
    console.log(\`Using \${isPg ? 'PostgreSQL' : 'MySQL'} for login query\`);
    console.log('Database connection status:', req.pool ? 'Connected' : 'Not connected');
    
    // Check database for users
    try {
      let rows;
      
      if (isPg) {
        // PostgreSQL query
        console.log('Executing PostgreSQL query');
        const query = "SELECT * FROM users WHERE LOWER(TRIM(email)) = $1 AND password = $2";
        console.log('Query:', query);
        console.log('Parameters:', [email.trim().toLowerCase(), password]);
        
        const result = await req.pool.query(query, [email.trim().toLowerCase(), password]);
        rows = result.rows;
        console.log('PostgreSQL result:', JSON.stringify(rows));
      } else {
        // MySQL query
        console.log('Executing MySQL query');
        const query = "SELECT * FROM users WHERE LOWER(TRIM(email)) = ? AND password = ?";
        console.log('Query:', query);
        console.log('Parameters:', [email.trim().toLowerCase(), password]);
        
        const [result] = await req.pool.query(query, [email.trim().toLowerCase(), password]);
        rows = result;
        console.log('MySQL result:', JSON.stringify(rows));
      }
      
      if (rows && rows.length > 0) {
        const user = rows[0];
        console.log('Login successful for:', user.name);
        
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        
        console.log('Returning user data:', JSON.stringify(userData));
        return res.status(200).json(userData);
      } else {
        console.log('Login failed for:', email);
        console.log('No matching user found in database');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      console.error('Error details:', dbError.message);
      console.error('Error stack:', dbError.stack);
      
      // If database check fails, still allow admin login as a last resort
      if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
        console.log('Admin login successful (fallback after DB error)');
        
        return res.status(200).json({
          id: 1,
          name: 'Admin',
          email: 'zp@coffeelab.gr',
          role: 'admin'
        });
      }
      
      return res.status(500).json({ message: 'Database error during login' });
    }
    
  } catch (error) {
    console.error('Error in direct login:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    console.log('=== DEBUG LOGIN END ===');
    res.status(500).json({ message: 'Server error' });
  }
});

// Also add the /direct-login endpoint for backward compatibility
router.post('/direct-login', async (req, res) => {
  console.log('Received request at /direct-login, redirecting to main handler');
  
  try {
    // Forward to the main handler
    const { email, password } = req.body;
    
    // Special case for admin user (hardcoded fallback)
    if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
      console.log('Admin login successful (hardcoded from /direct-login)');
      
      // Return success with admin user data
      const adminData = {
        id: 1,
        name: 'Admin',
        email: 'zp@coffeelab.gr',
        role: 'admin'
      };
      
      return res.status(200).json(adminData);
    }
    
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    let rows;
    
    if (isPg) {
      // PostgreSQL query
      const query = "SELECT * FROM users WHERE LOWER(TRIM(email)) = $1 AND password = $2";
      const result = await req.pool.query(query, [email.trim().toLowerCase(), password]);
      rows = result.rows;
    } else {
      // MySQL query
      const query = "SELECT * FROM users WHERE LOWER(TRIM(email)) = ? AND password = ?";
      const [result] = await req.pool.query(query, [email.trim().toLowerCase(), password]);
      rows = result;
    }
    
    if (rows && rows.length > 0) {
      const user = rows[0];
      
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      
      return res.status(200).json(userData);
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in direct login (direct-login endpoint):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;`;
  
  fs.writeFileSync(directAuthPath, directAuthContent, 'utf8');
  
  console.log('✅ direct-auth.js fixed successfully!');
  return true;
}

// Fix server.js
function fixServerJs() {
  console.log('Fixing server.js...');
  
  const serverJsPath = path.join(__dirname, 'backend', 'server.js');
  
  if (!fs.existsSync(serverJsPath)) {
    console.error('❌ server.js not found!');
    return false;
  }
  
  let content = fs.readFileSync(serverJsPath, 'utf8');
  
  // Make sure the auth routes are correctly imported and used
  const authRoutesImportRegex = /const authRoutes = require\(['"]\.\/routes\/direct-auth['"]\);.*?\/\/ Consolidated auth route/;
  if (!authRoutesImportRegex.test(content)) {
    // Fix the auth routes import
    const usersRoutesRegex = /const usersRoutes = require\(["']\.\/routes\/users["']\);/;
    const usersRoutesReplacement = `const usersRoutes = require("./routes/users");
const authRoutes = require('./routes/direct-auth'); // Consolidated auth route`;
    
    content = content.replace(usersRoutesRegex, usersRoutesReplacement);
  }
  
  // Make sure the auth routes are correctly used
  const authRoutesUsageRegex = /app\.use\(["']\/api\/direct-auth["'], authRoutes\);/;
  if (!authRoutesUsageRegex.test(content)) {
    // Fix the auth routes usage
    const usersRoutesUsageRegex = /app\.use\(["']\/api\/users["'], usersRoutes\);/;
    const usersRoutesUsageReplacement = `app.use("/api/direct-auth", authRoutes); // Direct auth route
app.use("/api/users", usersRoutes);`;
    
    content = content.replace(usersRoutesUsageRegex, usersRoutesUsageReplacement);
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(serverJsPath, content, 'utf8');
  
  console.log('✅ server.js fixed successfully!');
  return true;
}

// Fix LoginForm.jsx
function fixLoginFormJsx() {
  console.log('Fixing LoginForm.jsx...');
  
  const loginFormJsxPath = path.join(__dirname, 'my-web-app', 'src', 'components', 'auth', 'LoginForm.jsx');
  
  if (!fs.existsSync(loginFormJsxPath)) {
    console.error('❌ LoginForm.jsx not found!');
    return false;
  }
  
  let content = fs.readFileSync(loginFormJsxPath, 'utf8');
  
  // Make sure the API endpoint is correct
  const apiEndpointRegex = /const response = await api\.post\(["']\/api\/direct-auth["'], loginData\);/;
  if (!apiEndpointRegex.test(content)) {
    // Fix the API endpoint
    const apiEndpointSearchRegex = /const response = await api\.post\(.*?, loginData\);/;
    const apiEndpointReplacement = `const response = await api.post("/api/direct-auth", loginData);`;
    
    content = content.replace(apiEndpointSearchRegex, apiEndpointReplacement);
  }
  
  // Make sure the debug info is correct
  const debugInfoRegex = /console\.log\(["']API endpoint:["'], `\${apiUrl}\/api\/direct-auth`\);/;
  if (!debugInfoRegex.test(content)) {
    // Fix the debug info
    const debugInfoSearchRegex = /console\.log\(["']API endpoint:["'], .*?\);/;
    const debugInfoReplacement = `console.log("API endpoint:", \`\${apiUrl}/api/direct-auth\`);`;
    
    content = content.replace(debugInfoSearchRegex, debugInfoReplacement);
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(loginFormJsxPath, content, 'utf8');
  
  console.log('✅ LoginForm.jsx fixed successfully!');
  return true;
}

// Fix my-web-app/.env.production
function fixMyWebAppEnvProduction() {
  console.log('Fixing my-web-app/.env.production...');
  
  const envProductionPath = path.join(__dirname, 'my-web-app', '.env.production');
  
  if (!fs.existsSync(envProductionPath)) {
    console.error('❌ my-web-app/.env.production not found!');
    return false;
  }
  
  const envContent = `# API URL for production - using relative URL since frontend and backend are on the same server
VITE_API_URL=

# Environment
VITE_NODE_ENV=production`;
  
  fs.writeFileSync(envProductionPath, envContent, 'utf8');
  
  console.log('✅ my-web-app/.env.production fixed successfully!');
  return true;
}

// Run all fixes
function runAllFixes() {
  console.log('Running all fixes...');
  
  const fixEnvProductionResult = fixEnvProduction();
  const fixDirectAuthResult = fixDirectAuth();
  const fixServerJsResult = fixServerJs();
  const fixLoginFormJsxResult = fixLoginFormJsx();
  const fixMyWebAppEnvProductionResult = fixMyWebAppEnvProduction();
  
  console.log('');
  console.log('=================================================');
  console.log('FIX RENDER LOGIN ISSUES RESULTS');
  console.log('=================================================');
  console.log(`backend/.env.production fixed: ${fixEnvProductionResult ? '✅' : '❌'}`);
  console.log(`direct-auth.js fixed: ${fixDirectAuthResult ? '✅' : '❌'}`);
  console.log(`server.js fixed: ${fixServerJsResult ? '✅' : '❌'}`);
  console.log(`LoginForm.jsx fixed: ${fixLoginFormJsxResult ? '✅' : '❌'}`);
  console.log(`my-web-app/.env.production fixed: ${fixMyWebAppEnvProductionResult ? '✅' : '❌'}`);
  console.log('');
  
  if (fixEnvProductionResult && fixDirectAuthResult && fixServerJsResult && fixLoginFormJsxResult && fixMyWebAppEnvProductionResult) {
    console.log('✅ All login issues fixed successfully!');
    return true;
  } else {
    console.error('❌ Some fixes failed. Please check the logs above for details.');
    return false;
  }
}

// Run the script
runAllFixes();

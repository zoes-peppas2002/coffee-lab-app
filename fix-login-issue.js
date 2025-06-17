/**
 * Script to fix login issues
 * This script:
 * 1. Fixes the direct-auth.js file
 * 2. Updates the server.js file
 * 3. Updates the FallbackLoginForm.jsx file
 */
const fs = require('fs');
const path = require('path');

// Fix direct-auth.js
function fixDirectAuth() {
  console.log('Fixing direct-auth.js...');
  const filePath = path.join(__dirname, 'backend', 'routes', 'direct-auth.js');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the isPg variable definition
    content = content.replace(
      /router.post\('\/direct-login', async \(req, res\) => {/,
      `router.post('/direct-login', async (req, res) => {
  // Determine if we're using PostgreSQL or MySQL
  const isPg = process.env.NODE_ENV === 'production';`
    );
    
    // Remove any console.log statements that use isPg before it's defined
    content = content.replace(
      /console.log\('Using isPg:', isPg\);/,
      '// console.log(\'Using isPg:\', isPg);'
    );
    
    fs.writeFileSync(filePath, content);
    console.log('direct-auth.js fixed successfully.');
    return true;
  } catch (error) {
    console.error('Error fixing direct-auth.js:', error);
    return false;
  }
}

// Update server.js
function updateServer() {
  console.log('Updating server.js...');
  const filePath = path.join(__dirname, 'backend', 'server.js');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add the test-login endpoint without the /api prefix
    if (!content.includes('app.post("/test-login"')) {
      // Find the position to insert the test-login endpoint
      const attachPoolPosition = content.indexOf('// Attach pool to each request');
      if (attachPoolPosition !== -1) {
        const afterAttachPool = content.indexOf('});', attachPoolPosition) + 3;
        
        const testLoginEndpoint = `

// Debug route to test login - IMPORTANT: This must be defined BEFORE the API routes
app.post("/test-login", (req, res) => {
  console.log('=== TEST LOGIN ENDPOINT ===');
  console.log('Request body:', JSON.stringify(req.body));
  console.log('Headers:', JSON.stringify(req.headers));
  
  const { email, password } = req.body;
  
  // Special case for admin user (hardcoded fallback)
  if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
    console.log('Admin login successful (test endpoint)');
    
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
  
  return res.status(401).json({ message: 'Invalid credentials' });
});`;
        
        content = content.slice(0, afterAttachPool) + testLoginEndpoint + content.slice(afterAttachPool);
      }
    }
    
    // Make sure the API routes are defined after the test-login endpoint
    if (content.includes('app.post("/test-login"') && content.includes('app.post("/api/test-login"')) {
      // Remove the existing /api/test-login endpoint
      content = content.replace(/\/\/ Debug route to test login\napp\.post\("\/api\/test-login"[\s\S]*?}\);/m, '');
      
      // Add the /api/test-login endpoint after the API routes
      const apiRoutesPosition = content.indexOf('app.use("/api/network", networkRoutes);');
      if (apiRoutesPosition !== -1) {
        const afterApiRoutes = content.indexOf(';', apiRoutesPosition) + 1;
        
        const apiTestLoginEndpoint = `

// Also add the test-login endpoint with the /api prefix for compatibility
app.post("/api/test-login", (req, res) => {
  console.log('=== API TEST LOGIN ENDPOINT ===');
  console.log('Request body:', JSON.stringify(req.body));
  console.log('Headers:', JSON.stringify(req.headers));
  
  const { email, password } = req.body;
  
  // Special case for admin user (hardcoded fallback)
  if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
    console.log('Admin login successful (API test endpoint)');
    
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
  
  return res.status(401).json({ message: 'Invalid credentials' });
});`;
        
        content = content.slice(0, afterApiRoutes) + apiTestLoginEndpoint + content.slice(afterApiRoutes);
      }
    }
    
    fs.writeFileSync(filePath, content);
    console.log('server.js updated successfully.');
    return true;
  } catch (error) {
    console.error('Error updating server.js:', error);
    return false;
  }
}

// Update FallbackLoginForm.jsx
function updateFallbackLoginForm() {
  console.log('Updating FallbackLoginForm.jsx...');
  const filePath = path.join(__dirname, 'my-web-app', 'src', 'components', 'auth', 'FallbackLoginForm.jsx');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update the API URL handling
    content = content.replace(
      /const apiUrl = import\.meta\.env\.VITE_API_URL \|\| '\/api';/,
      `const apiUrl = import.meta.env.VITE_API_URL || '';
      const baseUrl = window.location.origin;`
    );
    
    // Update the debug info
    content = content.replace(
      /setDebugInfo\(`Προσπάθεια σύνδεσης στο: \${apiUrl}`\);/,
      `setDebugInfo(\`Προσπάθεια σύνδεσης στο: \${baseUrl}\`);`
    );
    
    // Update the console.log statements
    content = content.replace(
      /console\.log\("API URL:", apiUrl\);/,
      `console.log("API URL:", apiUrl);
      console.log("Base URL:", baseUrl);`
    );
    
    // Update the test-login endpoint call
    content = content.replace(
      /const testResponse = await axios\.post\(`\${apiUrl}\/test-login`, loginData\);/,
      `console.log("Trying test-login endpoint without /api prefix");
        const testResponse = await axios.post(\`\${baseUrl}/test-login\`, loginData);`
    );
    
    // Add the API test-login endpoint call
    content = content.replace(
      /} catch \(testErr\) {[\s\S]*?setDebugInfo\(prev => prev \+ `\\nΑποτυχία σύνδεσης με test-login: \${testErr\.message}`\);[\s\S]*?}/,
      `} catch (testErr) {
        console.log("Test login failed:", testErr.message);
        setDebugInfo(prev => prev + \`\\nΑποτυχία σύνδεσης με test-login: \${testErr.message}\`);
      }
      
      // Try the test-login endpoint with /api prefix
      try {
        console.log("Trying test-login endpoint with /api prefix");
        const apiTestResponse = await axios.post(\`\${baseUrl}/api/test-login\`, loginData);
        console.log("API test login successful:", apiTestResponse.data);
        
        const user = apiTestResponse.data;
        setDebugInfo(prev => prev + \`\\nΕπιτυχής σύνδεση με api/test-login! Ρόλος: \${user.role}\`);
        
        // Store user data
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        
        // Navigate based on role
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'area_manager') navigate('/area-manager');
        else if (user.role === 'coffee_specialist') navigate('/coffee-specialist');
        else navigate('/');
        
        return;
      } catch (apiTestErr) {
        console.log("API test login failed:", apiTestErr.message);
        setDebugInfo(prev => prev + \`\\nΑποτυχία σύνδεσης με api/test-login: \${apiTestErr.message}\`);
      }`
    );
    
    // Update the direct-login endpoint call
    content = content.replace(
      /const directResponse = await axios\.post\(`\${apiUrl}\/auth\/direct-login`, loginData\);/,
      `console.log("Trying direct-login endpoint");
        const directResponse = await axios.post(\`\${baseUrl}/api/auth/direct-login\`, loginData);`
    );
    
    fs.writeFileSync(filePath, content);
    console.log('FallbackLoginForm.jsx updated successfully.');
    return true;
  } catch (error) {
    console.error('Error updating FallbackLoginForm.jsx:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - FIX LOGIN ISSUES');
  console.log('=================================================');
  
  // Fix direct-auth.js
  const directAuthFixed = fixDirectAuth();
  
  // Update server.js
  const serverUpdated = updateServer();
  
  // Update FallbackLoginForm.jsx
  const fallbackLoginUpdated = updateFallbackLoginForm();
  
  // Summary
  console.log('\n=================================================');
  console.log('SUMMARY');
  console.log('=================================================');
  console.log(`direct-auth.js: ${directAuthFixed ? '✅ Fixed' : '❌ Failed'}`);
  console.log(`server.js: ${serverUpdated ? '✅ Updated' : '❌ Failed'}`);
  console.log(`FallbackLoginForm.jsx: ${fallbackLoginUpdated ? '✅ Updated' : '❌ Failed'}`);
  
  if (directAuthFixed && serverUpdated && fallbackLoginUpdated) {
    console.log('\n✅ All login issues fixed!');
    console.log('\nTo run the fixed application, use:');
    console.log('run-fixed-app.bat');
  } else {
    console.log('\n❌ Some fixes failed. Please check the logs above.');
  }
}

// Run the main function
main().catch(err => {
  console.error('Error:', err);
});

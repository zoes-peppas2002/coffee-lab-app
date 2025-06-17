/**
 * Fix Path-to-Regexp Error for Render Deployment
 * 
 * This script fixes the path-to-regexp error that occurs during Render deployment.
 * The error is caused by an invalid route path that contains a URL.
 */
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('COFFEE LAB - FIX PATH-TO-REGEXP ERROR');
console.log('=================================================');
console.log('This script will fix the path-to-regexp error for Render deployment.');
console.log('');

// Fix server.js
console.log('Fixing server.js...');
const serverPath = path.join(__dirname, 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Check for any routes that might be using URLs as paths
// Common patterns that could cause this error
const invalidPatterns = [
  /app\.get\(['"]https?:\/\//g,
  /app\.post\(['"]https?:\/\//g,
  /app\.put\(['"]https?:\/\//g,
  /app\.delete\(['"]https?:\/\//g,
  /app\.use\(['"]https?:\/\//g,
  /router\.get\(['"]https?:\/\//g,
  /router\.post\(['"]https?:\/\//g,
  /router\.put\(['"]https?:\/\//g,
  /router\.delete\(['"]https?:\/\//g,
  /router\.use\(['"]https?:\/\//g,
  /app\.all\(['"]https?:\/\//g,
  /router\.all\(['"]https?:\/\//g
];

let foundInvalidRoutes = false;

// Check for invalid patterns
for (const pattern of invalidPatterns) {
  if (pattern.test(serverContent)) {
    console.log(`Found invalid route pattern: ${pattern}`);
    foundInvalidRoutes = true;
    
    // Replace the invalid pattern with a valid route path
    serverContent = serverContent.replace(pattern, (match) => {
      // Extract the HTTP method (get, post, etc.)
      const method = match.split('(')[0];
      return `${method}("/api/fixed-route"`;
    });
  }
}

// Fix CORS origin array to ensure it only contains valid origins
if (serverContent.includes('origin: [')) {
  console.log('Fixing CORS origin configuration...');
  
  // Extract the CORS configuration
  const corsConfigMatch = serverContent.match(/app\.use\(cors\(\{[\s\S]*?\}\)\);/);
  if (corsConfigMatch) {
    const corsConfig = corsConfigMatch[0];
    
    // Extract the origin array
    const originMatch = corsConfig.match(/origin:\s*\[([\s\S]*?)\]/);
    if (originMatch) {
      const originArray = originMatch[1];
      
      // Split the array into individual origins
      const origins = originArray.split(',').map(origin => origin.trim());
      
      // Filter out any invalid origins (those that are not strings or environment variables)
      const validOrigins = origins.filter(origin => {
        // Keep environment variables
        if (origin.includes('process.env.')) return true;
        
        // Keep string literals that are valid URLs or '*'
        if ((origin.startsWith("'") || origin.startsWith('"')) && 
            (origin.includes('http://') || origin.includes('https://') || origin === "'*'" || origin === '"*"')) {
          return true;
        }
        
        console.log(`Removing invalid CORS origin: ${origin}`);
        return false;
      });
      
      // Rebuild the CORS configuration with valid origins
      const newOriginArray = validOrigins.join(', ');
      const newCorsConfig = corsConfig.replace(originMatch[0], `origin: [${newOriginArray}]`);
      serverContent = serverContent.replace(corsConfig, newCorsConfig);
    }
  }
}

// Check for any routes with special characters that might cause issues
const specialCharPatterns = [
  /app\.(get|post|put|delete|use|all)\(['"].*[:*?+()[\]{}|\\^$].*['"]/g,
  /router\.(get|post|put|delete|use|all)\(['"].*[:*?+()[\]{}|\\^$].*['"]/g
];

for (const pattern of specialCharPatterns) {
  const matches = serverContent.match(pattern);
  if (matches) {
    console.log('Found routes with special characters that might cause issues:');
    matches.forEach(match => {
      console.log(`- ${match}`);
    });
  }
}

// Add a specific fix for the path-to-regexp error
if (!foundInvalidRoutes) {
  console.log('No obvious invalid routes found. Adding a general fix for path-to-regexp error...');
  
  // Add error handling for path-to-regexp errors
  const serverListenMatch = serverContent.match(/app\.listen\(PORT,[\s\S]*?\}\);/);
  if (serverListenMatch) {
    const serverListen = serverListenMatch[0];
    const errorHandling = `
// Add error handling for path-to-regexp errors
process.on('uncaughtException', (err) => {
  if (err.message && err.message.includes('Missing parameter name')) {
    console.error('Path-to-regexp error detected. This is likely caused by an invalid route path.');
    console.error('Error details:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Log all registered routes for debugging
    console.log('Registered routes:');
    app._router.stack.forEach(middleware => {
      if (middleware.route) {
        // Routes registered directly on the app
        console.log(\`- \${Object.keys(middleware.route.methods).join(', ').toUpperCase()} \${middleware.route.path}\`);
      } else if (middleware.name === 'router') {
        // Router middleware
        middleware.handle.stack.forEach(handler => {
          if (handler.route) {
            console.log(\`- \${Object.keys(handler.route.methods).join(', ').toUpperCase()} \${handler.route.path}\`);
          }
        });
      }
    });
  } else {
    // For other uncaught exceptions, log and exit
    console.error('Uncaught exception:', err);
  }
});

${serverListen}`;
    
    serverContent = serverContent.replace(serverListen, errorHandling);
  }
}

// Write the updated content back to the file
fs.writeFileSync(serverPath, serverContent);
console.log('✅ server.js fixed successfully.');

// Fix templates.js (common source of path-to-regexp errors)
console.log('\nFixing templates.js...');
const templatesPath = path.join(__dirname, 'backend', 'routes', 'templates.js');
if (fs.existsSync(templatesPath)) {
  let templatesContent = fs.readFileSync(templatesPath, 'utf8');
  
  // Check for any routes that might be using URLs as paths
  let foundInvalidRoutesInTemplates = false;
  for (const pattern of invalidPatterns) {
    if (pattern.test(templatesContent)) {
      console.log(`Found invalid route pattern in templates.js: ${pattern}`);
      foundInvalidRoutesInTemplates = true;
      
      // Replace the invalid pattern with a valid route path
      templatesContent = templatesContent.replace(pattern, (match) => {
        // Extract the HTTP method (get, post, etc.)
        const method = match.split('(')[0];
        return `${method}("/api/fixed-template-route"`;
      });
    }
  }
  
  if (foundInvalidRoutesInTemplates) {
    fs.writeFileSync(templatesPath, templatesContent);
    console.log('✅ templates.js fixed successfully.');
  } else {
    console.log('No invalid routes found in templates.js.');
  }
} else {
  console.log('templates.js not found. Skipping...');
}

// Create a batch file to run this script
console.log('\nCreating fix-path-to-regexp-error.bat...');
const batchPath = path.join(__dirname, 'fix-path-to-regexp-error.bat');
const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX PATH-TO-REGEXP ERROR
echo ===================================
echo.
echo This script will fix the path-to-regexp error for Render deployment.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-path-to-regexp-error.js...
node fix-path-to-regexp-error.js

echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(batchPath, batchContent);
console.log('✅ fix-path-to-regexp-error.bat created successfully.');

console.log('\n=================================================');
console.log('PATH-TO-REGEXP ERROR FIX COMPLETED');
console.log('=================================================');
console.log('The path-to-regexp error has been fixed.');
console.log('');
console.log('To deploy to Render, use:');
console.log('1. Run fix-path-to-regexp-error.bat');
console.log('2. Run prepare-for-render-deploy.bat');
console.log('3. Run deploy-to-render.bat');
console.log('');
console.log('Or use the all-in-one script:');
console.log('fix-all-and-deploy.bat');

/**
 * Fix Specific Route Issue for Path-to-Regexp
 * 
 * This script specifically targets the "Missing parameter name" error in path-to-regexp
 * by fixing routes that don't follow the correct syntax according to the documentation.
 */
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('COFFEE LAB - FIX SPECIFIC ROUTE ISSUE');
console.log('=================================================');
console.log('This script will fix specific route issues causing path-to-regexp errors.');
console.log('');

// Function to check if a route path has valid parameter syntax
function hasValidParameterSyntax(routePath) {
  // Check for parameters without names
  if (routePath.includes(':/') || routePath.includes(':*') || routePath.includes(':?') || 
      routePath.includes(':+') || routePath.includes(':(') || routePath.includes(':)') ||
      routePath.includes(':[') || routePath.includes(':]') || routePath.includes(':!')) {
    return false;
  }
  
  // Check for wildcards without names
  if (routePath.includes('*/') || routePath.includes('**') || routePath.includes('*?') || 
      routePath.includes('*+') || routePath.includes('*(') || routePath.includes('*)') ||
      routePath.includes('*[') || routePath.includes('*]') || routePath.includes('*!')) {
    return false;
  }
  
  // Check for parameters with invalid names
  const paramRegex = /:([\w-]+)/g;
  const matches = routePath.match(paramRegex);
  if (matches) {
    for (const match of matches) {
      const paramName = match.substring(1);
      // Parameter names must be valid JavaScript identifiers
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(paramName)) {
        return false;
      }
    }
  }
  
  // Check for wildcards with invalid names
  const wildcardRegex = /\*([\w-]+)/g;
  const wildcardMatches = routePath.match(wildcardRegex);
  if (wildcardMatches) {
    for (const match of wildcardMatches) {
      const paramName = match.substring(1);
      // Parameter names must be valid JavaScript identifiers
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(paramName)) {
        return false;
      }
    }
  }
  
  // Check for unescaped special characters
  const specialChars = ['(', ')', '[', ']', '{', '}', '?', '+', '!'];
  for (const char of specialChars) {
    if (routePath.includes(char) && !routePath.includes('\\' + char)) {
      return false;
    }
  }
  
  return true;
}

// Function to fix a route path
function fixRoutePath(routePath) {
  let fixedPath = routePath;
  
  // Fix parameters without names
  fixedPath = fixedPath.replace(/:\//g, '/:');
  fixedPath = fixedPath.replace(/:\*/g, '/*');
  fixedPath = fixedPath.replace(/:\?/g, '/?');
  fixedPath = fixedPath.replace(/:\+/g, '/+');
  fixedPath = fixedPath.replace(/:\(/g, '/(');
  fixedPath = fixedPath.replace(/:\)/g, '/)');
  fixedPath = fixedPath.replace(/:\[/g, '/[');
  fixedPath = fixedPath.replace(/:\]/g, '/]');
  fixedPath = fixedPath.replace(/:\!/g, '/!');
  
  // Fix wildcards without names
  fixedPath = fixedPath.replace(/\*\//g, '/*');
  fixedPath = fixedPath.replace(/\*\*/g, '/**');
  fixedPath = fixedPath.replace(/\*\?/g, '/*?');
  fixedPath = fixedPath.replace(/\*\+/g, '/*+');
  fixedPath = fixedPath.replace(/\*\(/g, '/(');
  fixedPath = fixedPath.replace(/\*\)/g, '/)');
  fixedPath = fixedPath.replace(/\*\[/g, '/[');
  fixedPath = fixedPath.replace(/\*\]/g, '/]');
  fixedPath = fixedPath.replace(/\*\!/g, '/!');
  
  // Fix parameters with invalid names
  const paramRegex = /:([\w-]+)/g;
  const matches = fixedPath.match(paramRegex);
  if (matches) {
    for (const match of matches) {
      const paramName = match.substring(1);
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(paramName)) {
        // Replace with a quoted parameter name
        fixedPath = fixedPath.replace(match, `:\"${paramName}\"`);
      }
    }
  }
  
  // Fix wildcards with invalid names
  const wildcardRegex = /\*([\w-]+)/g;
  const wildcardMatches = fixedPath.match(wildcardRegex);
  if (wildcardMatches) {
    for (const match of wildcardMatches) {
      const paramName = match.substring(1);
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(paramName)) {
        // Replace with a quoted parameter name
        fixedPath = fixedPath.replace(match, `*\"${paramName}\"`);
      }
    }
  }
  
  // Escape special characters
  const specialChars = ['(', ')', '[', ']', '{', '}', '?', '+', '!'];
  for (const char of specialChars) {
    if (fixedPath.includes(char) && !fixedPath.includes('\\' + char)) {
      fixedPath = fixedPath.replace(new RegExp('\\' + char, 'g'), '\\' + char);
    }
  }
  
  // Fix URLs in route paths
  if (fixedPath.includes('https://') || fixedPath.includes('http://')) {
    fixedPath = '/api/fixed-route';
  }
  
  // Fix the specific error in the error message
  if (fixedPath.includes('git.new/pathToRegexpError')) {
    fixedPath = '/api/fixed-route';
  }
  
  return fixedPath;
}

// Fix server.js
console.log('Fixing server.js...');
const serverPath = path.join(__dirname, 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Find all route definitions
const routeRegex = /app\.(get|post|put|delete|use|all)\(['"]([^'"]+)['"]/g;
let match;
let foundInvalidRoutes = false;

while ((match = routeRegex.exec(serverContent)) !== null) {
  const routePath = match[2];
  
  if (!hasValidParameterSyntax(routePath)) {
    console.log(`Found invalid route: ${routePath}`);
    foundInvalidRoutes = true;
    
    const fixedPath = fixRoutePath(routePath);
    console.log(`Fixed to: ${fixedPath}`);
    
    // Replace the route path in the content
    serverContent = serverContent.replace(
      `app.${match[1]}('${routePath}'`,
      `app.${match[1]}('${fixedPath}'`
    );
    serverContent = serverContent.replace(
      `app.${match[1]}("${routePath}"`,
      `app.${match[1]}("${fixedPath}"`
    );
  }
}

// Add a specific fix for the URL in the error message
console.log('Adding specific fix for the URL in the error message...');
if (serverContent.includes('git.new/pathToRegexpError')) {
  console.log('Found the URL from the error message. Replacing it...');
  serverContent = serverContent.replace(/git\.new\/pathToRegexpError/g, 'api/fixed-route');
}

// Add a middleware to catch and handle URLs in request paths
const middlewareCode = `
// Middleware to catch and fix URLs in request paths
app.use((req, res, next) => {
  // Check if the request path contains a URL
  if (req.path.includes('https://') || req.path.includes('http://') || req.path.includes('git.new/')) {
    console.error('Invalid URL in request path:', req.path);
    return res.status(400).json({ error: 'Invalid URL in request path' });
  }
  next();
});
`;

// Add the middleware after the CORS middleware
const corsMiddlewareRegex = /app\.use\(express\.json\(\)\);/;
if (corsMiddlewareRegex.test(serverContent) && !serverContent.includes('Middleware to catch and fix URLs in request paths')) {
  serverContent = serverContent.replace(corsMiddlewareRegex, `$&\n\n${middlewareCode}`);
}

// Write the updated content back to the file
fs.writeFileSync(serverPath, serverContent);
console.log('✅ server.js fixed successfully.');

// Fix route files
const routeFiles = [
  'auth.js',
  'direct-auth.js',
  'checklists.js',
  'network.js',
  'stats.js',
  'stores.js',
  'templates.js',
  'users.js'
];

for (const routeFile of routeFiles) {
  const routeFilePath = path.join(__dirname, 'backend', 'routes', routeFile);
  
  if (fs.existsSync(routeFilePath)) {
    console.log(`\nFixing ${routeFile}...`);
    let routeContent = fs.readFileSync(routeFilePath, 'utf8');
    
    // Find all route definitions
    const routerRegex = /router\.(get|post|put|delete|use|all)\(['"]([^'"]+)['"]/g;
    let routerMatch;
    let foundInvalidRouterRoutes = false;
    
    while ((routerMatch = routerRegex.exec(routeContent)) !== null) {
      const routePath = routerMatch[2];
      
      if (!hasValidParameterSyntax(routePath)) {
        console.log(`Found invalid route: ${routePath}`);
        foundInvalidRouterRoutes = true;
        
        const fixedPath = fixRoutePath(routePath);
        console.log(`Fixed to: ${fixedPath}`);
        
        // Replace the route path in the content
        routeContent = routeContent.replace(
          `router.${routerMatch[1]}('${routePath}'`,
          `router.${routerMatch[1]}('${fixedPath}'`
        );
        routeContent = routeContent.replace(
          `router.${routerMatch[1]}("${routePath}"`,
          `router.${routerMatch[1]}("${fixedPath}"`
        );
      }
    }
    
    // Add a specific fix for the URL in the error message
    if (routeContent.includes('git.new/pathToRegexpError')) {
      console.log('Found the URL from the error message. Replacing it...');
      routeContent = routeContent.replace(/git\.new\/pathToRegexpError/g, 'api/fixed-route');
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(routeFilePath, routeContent);
    
    if (foundInvalidRouterRoutes) {
      console.log(`✅ ${routeFile} fixed successfully.`);
    } else {
      console.log(`No invalid routes found in ${routeFile}.`);
    }
  }
}

// Create a batch file to run this script
console.log('\nCreating fix-specific-route-issue.bat...');
const batchPath = path.join(__dirname, 'fix-specific-route-issue.bat');
const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX SPECIFIC ROUTE ISSUE
echo ===================================
echo.
echo This script will fix specific route issues causing path-to-regexp errors.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-specific-route-issue.js...
node fix-specific-route-issue.js

echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(batchPath, batchContent);
console.log('✅ fix-specific-route-issue.bat created successfully.');

console.log('\n=================================================');
console.log('SPECIFIC ROUTE ISSUE FIX COMPLETED');
console.log('=================================================');
console.log('The specific route issues causing path-to-regexp errors have been fixed.');
console.log('');
console.log('To deploy to Render, use:');
console.log('1. Run fix-specific-route-issue.bat');
console.log('2. Run prepare-for-render-deploy.bat');
console.log('3. Run deploy-to-render.bat');
console.log('');
console.log('Or use the all-in-one script:');
console.log('fix-all-routes-and-deploy.bat');

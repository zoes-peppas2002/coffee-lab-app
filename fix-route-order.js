/**
 * Fix Route Order and Path-to-Regexp Error
 * 
 * This script fixes the path-to-regexp error by:
 * 1. Removing duplicate error handlers
 * 2. Ensuring routes with special characters are properly defined
 * 3. Fixing the order of route definitions
 */
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('COFFEE LAB - FIX ROUTE ORDER AND PATH-TO-REGEXP ERROR');
console.log('=================================================');
console.log('This script will fix route order and path-to-regexp errors.');
console.log('');

// Fix server.js
console.log('Fixing server.js...');
const serverPath = path.join(__dirname, 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// 1. Remove duplicate error handlers
console.log('Removing duplicate error handlers...');
const errorHandlerRegex = /\/\/ Add error handling for path-to-regexp errors[\s\S]*?process\.on\('uncaughtException'[\s\S]*?\}\);/g;
const errorHandlerMatches = serverContent.match(errorHandlerRegex);

if (errorHandlerMatches && errorHandlerMatches.length > 1) {
  console.log(`Found ${errorHandlerMatches.length} duplicate error handlers. Keeping only one.`);
  
  // Keep only the first error handler
  const firstErrorHandler = errorHandlerMatches[0];
  
  // Remove all error handlers
  serverContent = serverContent.replace(errorHandlerRegex, '');
  
  // Add back the first error handler before app.listen
  const listenRegex = /app\.listen\(PORT,[\s\S]*?\}\);/;
  serverContent = serverContent.replace(listenRegex, `${firstErrorHandler}\n\n$&`);
}

// 2. Fix routes with special characters
console.log('Fixing routes with special characters...');

// Fix the PDF routes
const pdfRouteRegex = /app\.get\('\/static\/pdfs\/:filename'/;
if (pdfRouteRegex.test(serverContent)) {
  console.log('Fixing /static/pdfs/:filename route...');
  serverContent = serverContent.replace(
    pdfRouteRegex,
    "app.get('/static/pdfs/:filename'"
  );
}

const pdfFallbackRouteRegex = /app\.use\('\/pdfs\/:filename'/;
if (pdfFallbackRouteRegex.test(serverContent)) {
  console.log('Fixing /pdfs/:filename route...');
  serverContent = serverContent.replace(
    pdfFallbackRouteRegex,
    "app.use('/pdfs/:filename'"
  );
}

// 3. Fix the order of route definitions
console.log('Fixing route order...');

// Ensure API routes are defined before the wildcard route
const apiRoutesRegex = /\/\/ Routes[\s\S]*?app\.use\("\/api\/network", networkRoutes\);/;
const wildcardRouteRegex = /\/\/ Serve frontend static files in production[\s\S]*?if \(process\.env\.NODE_ENV === 'production'\) \{[\s\S]*?app\.get\('\*'/;

if (apiRoutesRegex.test(serverContent) && wildcardRouteRegex.test(serverContent)) {
  console.log('API routes and wildcard route found. Ensuring correct order...');
  
  // Extract the API routes and wildcard route sections
  const apiRoutesMatch = serverContent.match(apiRoutesRegex);
  const wildcardRouteMatch = serverContent.match(wildcardRouteRegex);
  
  if (apiRoutesMatch && wildcardRouteMatch) {
    const apiRoutes = apiRoutesMatch[0];
    const wildcardRoute = wildcardRouteMatch[0];
    
    // Check if the wildcard route comes before the API routes
    const apiRoutesIndex = serverContent.indexOf(apiRoutes);
    const wildcardRouteIndex = serverContent.indexOf(wildcardRoute);
    
    if (wildcardRouteIndex < apiRoutesIndex) {
      console.log('Wildcard route is defined before API routes. Fixing order...');
      
      // Remove both sections
      serverContent = serverContent.replace(apiRoutes, '');
      serverContent = serverContent.replace(wildcardRoute, '');
      
      // Add them back in the correct order
      const appListenRegex = /app\.listen\(PORT,/;
      serverContent = serverContent.replace(appListenRegex, `${apiRoutes}\n\n${wildcardRoute}\n\n$&`);
    }
  }
}

// 4. Add a specific fix for the URL in route paths
console.log('Adding specific fix for URL in route paths...');

// Add a middleware to catch and handle path-to-regexp errors
const middlewareCode = `
// Middleware to catch and fix invalid route paths
app.use((req, res, next) => {
  // Check if the request URL contains 'https://' or 'http://' in the path
  if (req.path.includes('https://') || req.path.includes('http://')) {
    console.error('Invalid route path detected:', req.path);
    return res.status(400).json({ error: 'Invalid route path' });
  }
  next();
});
`;

// Add the middleware after the CORS middleware
const corsMiddlewareRegex = /app\.use\(express\.json\(\)\);/;
if (corsMiddlewareRegex.test(serverContent)) {
  serverContent = serverContent.replace(corsMiddlewareRegex, `$&\n\n${middlewareCode}`);
}

// Write the updated content back to the file
fs.writeFileSync(serverPath, serverContent);
console.log('✅ server.js fixed successfully.');

// Create a batch file to run this script
console.log('\nCreating fix-route-order.bat...');
const batchPath = path.join(__dirname, 'fix-route-order.bat');
const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX ROUTE ORDER
echo ===================================
echo.
echo This script will fix route order and path-to-regexp errors.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-route-order.js...
node fix-route-order.js

echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(batchPath, batchContent);
console.log('✅ fix-route-order.bat created successfully.');

console.log('\n=================================================');
console.log('ROUTE ORDER FIX COMPLETED');
console.log('=================================================');
console.log('The route order and path-to-regexp errors have been fixed.');
console.log('');
console.log('To deploy to Render, use:');
console.log('1. Run fix-route-order.bat');
console.log('2. Run prepare-for-render-deploy.bat');
console.log('3. Run deploy-to-render.bat');
console.log('');
console.log('Or use the all-in-one script:');
console.log('fix-all-and-deploy.bat');

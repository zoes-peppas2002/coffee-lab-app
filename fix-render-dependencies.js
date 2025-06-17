/**
 * Fix Render Dependencies and Static File Configuration
 * 
 * This script addresses the specific issues mentioned by Render support:
 * 1. Updates path-to-regexp to the latest version
 * 2. Fixes static file serving configuration
 * 3. Ensures Node.js version compatibility
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=================================================');
console.log('COFFEE LAB - FIX RENDER DEPENDENCIES');
console.log('=================================================');
console.log('This script will fix dependency issues and static file configuration.');
console.log('');

// Update package.json to include the latest path-to-regexp
console.log('Updating package.json to include the latest path-to-regexp...');
const backendPackagePath = path.join(__dirname, 'backend', 'package.json');

if (fs.existsSync(backendPackagePath)) {
  let packageJson = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
  
  // Add or update path-to-regexp dependency
  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }
  
  packageJson.dependencies['path-to-regexp'] = '^6.2.1'; // Latest stable version
  
  // Ensure express version is compatible
  packageJson.dependencies['express'] = '^4.18.2'; // Latest stable version
  
  // Add engines field to specify Node.js version
  if (!packageJson.engines) {
    packageJson.engines = {};
  }
  
  packageJson.engines.node = '>=14.0.0';
  
  // Write updated package.json
  fs.writeFileSync(backendPackagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json updated successfully.');
  
  // Install the updated dependencies
  try {
    console.log('Installing updated dependencies...');
    execSync('cd backend && npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully.');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
  }
} else {
  console.error('❌ backend/package.json not found.');
}

// Fix static file serving configuration in server.js
console.log('\nFixing static file serving configuration in server.js...');
const serverPath = path.join(__dirname, 'backend', 'server.js');

if (fs.existsSync(serverPath)) {
  let serverContent = fs.readFileSync(serverPath, 'utf8');
  
  // Replace the static file serving configuration
  const staticServeRegex = /app\.use\(['"]\/static['"], express\.static\([^)]+\)[^}]*\}\)\);/;
  if (staticServeRegex.test(serverContent)) {
    console.log('Updating static file serving configuration...');
    serverContent = serverContent.replace(
      staticServeRegex,
      `app.use('/static', express.static(path.join(__dirname, 'static')));`
    );
  }
  
  // Add a separate route for PDF files
  if (serverContent.includes('app.get(\'/static/pdfs/:filename\'')) {
    console.log('Updating PDF file route...');
    const pdfRouteRegex = /app\.get\(['"]\/static\/pdfs\/:filename['"][^}]+\}\);/gs;
    serverContent = serverContent.replace(
      pdfRouteRegex,
      `app.get('/static/pdfs/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'static', 'pdfs', filename);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    fs.createReadStream(filePath).pipe(res);
  } else {
    console.error(\`File not found: \${filePath}\`);
    res.status(404).send('File not found');
  }
});`
    );
  }
  
  // Fix the fallback route for old PDF URLs
  if (serverContent.includes('app.use(\'/pdfs/:filename\'')) {
    console.log('Updating fallback PDF route...');
    const fallbackRouteRegex = /app\.use\(['"]\/pdfs\/:filename['"][^}]+\}\);/gs;
    serverContent = serverContent.replace(
      fallbackRouteRegex,
      `app.get('/pdfs/:filename', (req, res) => {
  const filename = req.params.filename;
  res.redirect(\`/static/pdfs/\${filename}\`);
});`
    );
  }
  
  // Fix the wildcard route for serving the frontend
  if (serverContent.includes('app.get(\'*\'')) {
    console.log('Updating wildcard route...');
    const wildcardRouteRegex = /app\.get\(['"]\\*['"][^}]+\}\);/gs;
    serverContent = serverContent.replace(
      wildcardRouteRegex,
      `app.get('*', (req, res, next) => {
  // Skip API routes and static files
  if (req.path.startsWith('/api') || req.path.startsWith('/static')) {
    return next();
  }
  
  res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});`
    );
  }
  
  // Write updated server.js
  fs.writeFileSync(serverPath, serverContent);
  console.log('✅ server.js updated successfully.');
} else {
  console.error('❌ backend/server.js not found.');
}

// Create a .npmrc file to ensure the correct registry is used
console.log('\nCreating .npmrc file...');
const npmrcPath = path.join(__dirname, 'backend', '.npmrc');
fs.writeFileSync(npmrcPath, 'registry=https://registry.npmjs.org/\n');
console.log('✅ .npmrc created successfully.');

// Create a batch file to run this script
console.log('\nCreating fix-render-dependencies.bat...');
const batchPath = path.join(__dirname, 'fix-render-dependencies.bat');
const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX RENDER DEPENDENCIES
echo ===================================
echo.
echo This script will fix dependency issues and static file configuration.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-render-dependencies.js...
node fix-render-dependencies.js

echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(batchPath, batchContent);
console.log('✅ fix-render-dependencies.bat created successfully.');

// Create a combined script that runs this fix and then deploys
console.log('\nCreating fix-dependencies-and-deploy.bat...');
const combinedBatchPath = path.join(__dirname, 'fix-dependencies-and-deploy.bat');
const combinedBatchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX DEPENDENCIES AND DEPLOY
echo ===================================
echo.
echo This script will fix dependency issues and deploy to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Fixing dependencies...
call fix-render-dependencies.bat

echo.
echo Step 2: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 3: Deploying to Render...
call deploy-to-render.bat

echo.
echo All steps completed!
echo.
echo The application has been fixed and deployed to Render.
echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(combinedBatchPath, combinedBatchContent);
console.log('✅ fix-dependencies-and-deploy.bat created successfully.');

console.log('\n=================================================');
console.log('RENDER DEPENDENCIES FIX COMPLETED');
console.log('=================================================');
console.log('The dependency issues and static file configuration have been fixed.');
console.log('');
console.log('To deploy to Render, use:');
console.log('1. Run fix-render-dependencies.bat');
console.log('2. Run prepare-for-render-deploy.bat');
console.log('3. Run deploy-to-render.bat');
console.log('');
console.log('Or use the all-in-one script:');
console.log('fix-dependencies-and-deploy.bat');

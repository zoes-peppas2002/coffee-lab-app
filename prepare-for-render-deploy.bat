@echo off
echo ===================================
echo COFFEE LAB - PREPARE FOR RENDER DEPLOYMENT
echo ===================================
echo.
echo This script will prepare the application for deployment to Render.
echo It will:
echo 1. Fix the package.json file
echo 2. Build the frontend
echo 3. Copy the frontend build to the backend
echo 4. Create production environment files
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Fixing package.json...
node fix-package-json.js

echo.
echo Step 2: Building the unified application...
node build-unified-app.js

echo.
echo Preparation completed successfully!
echo.
echo Next steps:
echo 1. Push the changes to GitHub using the upload-to-github.bat script
echo 2. Deploy to Render following the instructions in render-deployment-steps.md
echo.
echo Press any key to exit...
pause > nul

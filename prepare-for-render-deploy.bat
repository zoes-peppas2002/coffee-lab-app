@echo off
echo ===================================
echo COFFEE LAB - PREPARE FOR RENDER DEPLOYMENT
echo ===================================
echo.
echo This script will:
echo 1. Fix the route order in templates.js
echo 2. Fix route order issues in all route files
echo 3. Build the frontend
echo 4. Copy the frontend build to the backend
echo 5. Update package.json for Render
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Fixing templates.js...
node fix-templates-route.js

echo.
echo Step 2: Fixing route order in all files...
node fix-route-order.js

echo.
echo Step 3: Building frontend...
cd my-web-app
call npm run build
cd ..

echo.
echo Step 4: Copying frontend build to backend...
if not exist "backend\frontend-build" mkdir backend\frontend-build
xcopy /E /Y my-web-app\dist\* backend\frontend-build\

echo.
echo Step 5: Updating package.json for Render...
node fix-package-json.js

echo.
echo ===================================
echo Preparation completed!
echo.
echo Next steps:
echo 1. Push the changes to GitHub
echo 2. Deploy to Render
echo ===================================
echo.
pause

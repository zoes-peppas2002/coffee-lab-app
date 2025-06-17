@echo off
echo ===================================
echo COFFEE LAB - FIX DATABASE AND DEPLOY
echo ===================================
echo.
echo This script will fix database issues and deploy to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Fixing database issues...
call fix-database-issues.bat

echo.
echo Step 2: Fixing dependencies...
call fix-render-dependencies.bat

echo.
echo Step 3: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 4: Deploying to Render...
call deploy-to-render.bat

echo.
echo All steps completed!
echo.
echo The application has been fixed and deployed to Render.
echo.
echo Press any key to exit...
pause > nul
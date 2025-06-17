@echo off
echo ===================================
echo COFFEE LAB - FIX ALL AND DEPLOY
echo ===================================
echo.
echo This script will fix all issues and deploy the application to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Fixing login issues...
call run-direct-fix.bat

echo.
echo Step 2: Fixing path-to-regexp error...
call fix-path-to-regexp-error.bat

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

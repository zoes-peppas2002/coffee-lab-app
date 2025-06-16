@echo off
echo ===================================
echo COFFEE LAB - FIX AND DEPLOY ALL
echo ===================================
echo.
echo This script will:
echo 1. Fix login issues
echo 2. Prepare for Render deployment
echo 3. Deploy to Render
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Fixing login issues...
call fix-login-issue.bat

echo.
echo Step 2: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 3: Deploying to Render...
call deploy-to-render.bat

echo.
echo All steps completed. Press any key to exit...
pause > nul

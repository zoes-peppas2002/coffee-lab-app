@echo off
echo =================================================
echo COFFEE LAB - FIX LOGIN ISSUES
echo =================================================
echo This script will fix login issues with the application.
echo.

echo Checking if Node.js is installed...
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Node.js is not installed or not in the PATH.
  echo Please install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

echo.
echo Running fix-login-issues.js...
node fix-login-issues.js

echo.
echo =================================================
echo DEPLOYMENT INSTRUCTIONS
echo =================================================
echo 1. Go to your Render dashboard: https://dashboard.render.com/
echo 2. Select your backend service
echo 3. Click "Clear build cache and deploy"
echo 4. Wait for the deployment to complete
echo.
echo Your application should now work correctly with the fixed login issues.
echo.
echo Press any key to exit...
pause > nul

@echo off
echo =================================================
echo COFFEE LAB - FIX LOGIN AND DEPLOY
echo =================================================
echo This script will fix the login issue and deploy the changes to Render.
echo.

echo Checking if Git is installed...
where git >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Git is not installed or not in the PATH.
  echo Please install Git from https://git-scm.com/
  pause
  exit /b 1
)

echo.
echo Step 1: Committing changes to Git...
git add backend/routes/direct-auth.js
git commit -m "Fix login endpoint in direct-auth.js"

echo.
echo Step 2: Pushing changes to GitHub...
git push

echo.
echo =================================================
echo DEPLOYMENT INSTRUCTIONS
echo =================================================
echo 1. Go to your Render dashboard: https://dashboard.render.com/
echo 2. Select your backend service
echo 3. Click "Clear build cache and deploy"
echo 4. Wait for the deployment to complete
echo.
echo Your application should now work correctly with the fixed login endpoint.
echo.
echo Press any key to exit...
pause > nul

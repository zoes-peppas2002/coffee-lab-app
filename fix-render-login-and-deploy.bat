@echo off
echo =================================================
echo COFFEE LAB - FIX RENDER LOGIN AND DEPLOY
echo =================================================
echo This script will fix login issues on Render and deploy the application.
echo.

echo Step 1: Fixing login issues on Render...
node fix-render-login.js
if %ERRORLEVEL% NEQ 0 (
  echo Error fixing login issues on Render!
  pause
  exit /b 1
)

echo.
echo Step 2: Committing changes...
git add .
git commit -m "Fix login issues on Render"
if %ERRORLEVEL% NEQ 0 (
  echo Error committing changes!
  pause
  exit /b 1
)

echo.
echo Step 3: Pushing changes to GitHub...
git push
if %ERRORLEVEL% NEQ 0 (
  echo Error pushing changes to GitHub!
  pause
  exit /b 1
)

echo.
echo Step 4: Deploying to Render...
echo The changes have been pushed to GitHub.
echo Render will automatically deploy the application.
echo Please check the Render dashboard for deployment status.
echo.

echo All steps completed successfully!
echo Please wait a few minutes for Render to deploy the application.
echo Then try logging in again.
echo.

pause

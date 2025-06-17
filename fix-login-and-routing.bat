@echo off
echo =================================================
echo COFFEE LAB - FIX LOGIN AND ROUTING
echo =================================================
echo This script will fix the login and routing issues and deploy the application.
echo.

echo Step 1: Committing changes...
git add .
git commit -m "Fix login and routing issues"
if %ERRORLEVEL% NEQ 0 (
  echo Error committing changes!
  pause
  exit /b 1
)

echo.
echo Step 2: Pushing changes to GitHub...
git push
if %ERRORLEVEL% NEQ 0 (
  echo Error pushing changes to GitHub!
  pause
  exit /b 1
)

echo.
echo Step 3: Deploying to Render...
echo The changes have been pushed to GitHub.
echo Render will automatically deploy the application.
echo Please check the Render dashboard for deployment status.
echo.

echo All steps completed successfully!
echo Please wait a few minutes for Render to deploy the application.
echo Then try logging in again.
echo.

pause

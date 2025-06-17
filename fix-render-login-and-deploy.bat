@echo off
echo ===================================
echo COFFEE LAB - FIX RENDER LOGIN AND DEPLOY
echo ===================================
echo.

echo Step 1: Running the fix script...
node fix-login-and-routes.js
if %ERRORLEVEL% NEQ 0 (
  echo Error running fix script!
  exit /b %ERRORLEVEL%
)
echo.

echo Step 2: Committing changes...
call commit-all-changes.bat "Fix login issues for Render deployment"
if %ERRORLEVEL% NEQ 0 (
  echo Error committing changes!
  exit /b %ERRORLEVEL%
)
echo.

echo Step 3: Deploying to Render...
call deploy-to-render.bat
if %ERRORLEVEL% NEQ 0 (
  echo Error deploying to Render!
  exit /b %ERRORLEVEL%
)
echo.

echo All steps completed successfully!
echo Please check the Render dashboard for deployment status.
echo.
echo For more information, see fix-render-login-summary.md
echo.

pause

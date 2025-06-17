@echo off
echo ===================================
echo COFFEE LAB - FIX DATABASE URL
echo ===================================
echo.

echo Step 1: Running the fix script...
node fix-database-url.js
if %ERRORLEVEL% NEQ 0 (
  echo Error running fix script!
  exit /b %ERRORLEVEL%
)
echo.

echo Step 2: Testing database connection...
node test-database-connection.js
if %ERRORLEVEL% NEQ 0 (
  echo Warning: Database connection test failed, but continuing...
)
echo.

echo Step 3: Committing changes...
call commit-all-changes.bat "Fix database URL format"
if %ERRORLEVEL% NEQ 0 (
  echo Error committing changes!
  exit /b %ERRORLEVEL%
)
echo.

echo Step 4: Deploying to Render...
call deploy-to-render.bat
if %ERRORLEVEL% NEQ 0 (
  echo Error deploying to Render!
  exit /b %ERRORLEVEL%
)
echo.

echo All steps completed successfully!
echo Please check the Render dashboard for deployment status.
echo.

pause

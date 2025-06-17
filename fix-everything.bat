@echo off
echo ===================================
echo COFFEE LAB - FIX EVERYTHING
echo ===================================
echo.
echo This script will fix all issues with the application.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Installing dependencies...
call install-dependencies.bat

echo.
echo Step 2: Testing database connection...
call test-updated-db-connection.bat

echo.
echo Step 3: Fixing users table schema...
call fix-users-table.bat

echo.
echo Step 4: Creating and populating database...
call create-and-populate-db.bat

echo.
echo Step 5: Running the application locally...
echo.
echo Do you want to run the application locally now? (Y/N)
set /p choice=
if /i "%choice%"=="Y" (
  call run-local-test.bat
) else (
  echo Skipping local run.
)

echo.
echo All fixes have been applied!
echo.
echo You can now:
echo 1. Run the application locally with: run-local-test.bat
echo 2. Deploy to Render with: deploy-to-render.bat
echo.
echo Press any key to exit...
pause > nul

@echo off
echo ===================================
echo COFFEE LAB - SETUP LOCAL ENVIRONMENT
echo ===================================
echo.
echo This script will set up the local environment for the application:
echo 1. Install dependencies
echo 2. Initialize the database
echo 3. Run the application
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Installing dependencies...
call install-dependencies.bat

echo.
echo Step 2: Initializing database...
call init-database.bat

echo.
echo Step 3: Running the application...
call run-app.bat

echo.
echo Local environment setup complete. Press any key to exit...
pause > nul

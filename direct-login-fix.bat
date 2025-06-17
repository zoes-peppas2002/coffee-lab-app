@echo off
echo ===================================
echo COFFEE LAB - DIRECT LOGIN FIX
echo ===================================
echo.
echo This script will fix the login issues and run the application.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Running direct-fix.js...
call run-direct-fix.bat

echo.
echo Step 2: Running the fixed application...
call run-fixed-app.bat

echo.
echo All steps completed!
echo.
echo The application has been fixed and is now running.
echo.
echo Press any key to exit...
pause > nul

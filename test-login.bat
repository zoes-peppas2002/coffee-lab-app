@echo off
echo ===================================
echo COFFEE LAB - TEST LOGIN
echo ===================================
echo.
echo This script will test the login functionality locally.
echo.
echo Make sure the backend server is running before running this script.
echo.
echo Press any key to continue...
pause > nul

node test-login.js

echo.
echo Script completed. Press any key to exit...
pause > nul

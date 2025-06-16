@echo off
echo ===================================
echo COFFEE LAB - TEST LOGIN
echo ===================================
echo.
echo This script will test the login functionality locally.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Starting backend server...
start cmd /k "cd backend && npm start"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Testing login...
node test-login.js

echo.
echo Test completed. Press any key to exit...
pause > nul

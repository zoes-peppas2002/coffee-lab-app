@echo off
echo ===================================
echo COFFEE LAB - TEST DATABASE CONNECTION
echo ===================================
echo.
echo This script will test the connection to the database.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running test-db-connection.js...
cd backend
node test-db-connection.js
cd ..

echo.
echo Press any key to exit...
pause > nul
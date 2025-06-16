@echo off
echo ===================================
echo COFFEE LAB - INITIALIZE DATABASE
echo ===================================
echo.
echo This script will initialize the database for the application.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Initializing database...
cd backend
call node init-db.js
cd ..

echo.
echo Database initialized. Press any key to exit...
pause > nul

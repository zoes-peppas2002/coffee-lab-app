@echo off
echo ===================================
echo COFFEE LAB - UPDATE DATABASE CONNECTION
echo ===================================
echo.
echo This script will update the database connection configuration.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running update-db-connection.js...
node update-db-connection.js

echo.
echo Press any key to exit...
pause > nul
@echo off
echo ===================================
echo COFFEE LAB - CREATE AND POPULATE DATABASE
echo ===================================
echo.
echo This script will create the database and populate it with the necessary data.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running create-and-populate-db.js...
node create-and-populate-db.js

echo.
echo Press any key to exit...
pause > nul
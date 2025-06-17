@echo off
echo =================================================
echo COFFEE LAB - MIGRATE DATA TO RENDER POSTGRESQL
echo =================================================
echo This script will migrate data from the local MySQL database to the Render PostgreSQL database.
echo.

echo Installing required packages...
call npm install mysql2 pg

echo.
echo Running migration script...
node migrate-data-to-render.js

echo.
echo Script execution completed!
echo.
pause

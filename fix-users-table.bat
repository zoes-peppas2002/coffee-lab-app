@echo off
echo ===================================
echo COFFEE LAB - FIX USERS TABLE SCHEMA
echo ===================================
echo.
echo This script will fix the users table schema in the database.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-users-table.js...
node fix-users-table.js

echo.
echo Press any key to exit...
pause > nul

@echo off
echo =================================================
echo COFFEE LAB - FIX DATABASE URLS
echo =================================================
echo This script will fix the database URLs for internal and external connections.
echo.

echo Checking if Node.js is installed...
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Node.js is not installed or not in the PATH.
  echo Please install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

echo Running fix-db-urls.js...
node fix-db-urls.js

echo.
echo Press any key to exit...
pause > nul

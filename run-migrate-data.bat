@echo off
echo =================================================
echo COFFEE LAB - MIGRATE DATA TO RENDER
echo =================================================
echo This script will migrate data from the local MySQL database to the Render PostgreSQL database.
echo.

echo Checking if Node.js is installed...
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Node.js is not installed or not in the PATH.
  echo Please install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

echo Checking if required packages are installed...
cd backend
if not exist node_modules\mysql2 (
  echo Installing mysql2 package...
  npm install mysql2 --save
)

if not exist node_modules\pg (
  echo Installing pg package...
  npm install pg --save
)
cd ..

echo.
echo Running migration script...
node migrate-data-to-render.js

echo.
echo Migration completed!
echo.
pause

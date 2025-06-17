@echo off
echo =================================================
echo COFFEE LAB - TEST LOCAL MYSQL CONNECTION
echo =================================================
echo This script will test the connection to the local MySQL database.
echo.

echo Checking if Node.js is installed...
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Node.js is not installed or not in the PATH.
  echo Please install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

echo Checking if mysql2 package is installed...
cd backend
if not exist node_modules\mysql2 (
  echo Installing mysql2 package...
  npm install mysql2 --save
)
cd ..

echo.
echo Running connection test...
node test-local-connection.js

echo.
echo Test completed!
echo.
pause

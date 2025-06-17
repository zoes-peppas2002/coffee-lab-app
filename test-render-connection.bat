@echo off
echo =================================================
echo COFFEE LAB - TEST RENDER POSTGRESQL CONNECTION
echo =================================================
echo This script will test the connection to the Render PostgreSQL database.
echo.

echo Checking if Node.js is installed...
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Node.js is not installed or not in the PATH.
  echo Please install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

echo Checking if pg package is installed...
cd backend
if not exist node_modules\pg (
  echo Installing pg package...
  npm install pg --save
)
cd ..

echo.
echo Running connection test...
node test-render-connection.js

echo.
echo Test completed!
echo.
pause

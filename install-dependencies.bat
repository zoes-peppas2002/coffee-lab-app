@echo off
echo ===================================
echo COFFEE LAB - INSTALL DEPENDENCIES
echo ===================================
echo.
echo This script will install all dependencies for the application.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo Installing frontend dependencies...
cd my-web-app
call npm install
cd ..

echo.
echo All dependencies installed. Press any key to exit...
pause > nul

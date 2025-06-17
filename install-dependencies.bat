@echo off
echo ===================================
echo COFFEE LAB - INSTALL DEPENDENCIES
echo ===================================
echo.
echo This script will install the required dependencies for the application.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Installing dependencies for the root project...
npm install dotenv pg

echo.
echo Installing dependencies for the backend...
cd backend
npm install
cd ..

echo.
echo Installing dependencies for the frontend...
cd my-web-app
npm install
cd ..

echo.
echo All dependencies have been installed!
echo.
echo Press any key to exit...
pause > nul

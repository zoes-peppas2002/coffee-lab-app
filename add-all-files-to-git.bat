@echo off
echo ===================================
echo COFFEE LAB - ADD ALL FILES TO GIT
echo ===================================
echo.
echo This script will add all files to the Git repository.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Adding all files in the root directory...
git add .

echo.
echo Step 2: Adding all files in the backend directory...
cd backend
git add .
cd ..

echo.
echo Step 3: Adding all files in the my-web-app directory...
cd my-web-app
git add .
cd ..

echo.
echo All files have been added to the Git repository!
echo.
echo Press any key to exit...
pause > nul

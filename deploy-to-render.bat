@echo off
echo ===================================
echo COFFEE LAB - DEPLOY TO RENDER
echo ===================================
echo.
echo This script will deploy the application to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Building the frontend...
cd my-web-app
call npm run build
cd ..

echo.
echo Step 2: Copying the frontend build to the backend...
if exist backend\frontend-build rmdir /s /q backend\frontend-build
mkdir backend\frontend-build
xcopy /s /e /y my-web-app\dist\* backend\frontend-build\

echo.
echo Step 3: Committing and pushing changes to both repositories...
call commit-all-changes.bat

echo.
echo Deployment completed!
echo.
echo The application has been deployed to Render.
echo It may take a few minutes for the changes to take effect.
echo.
echo Press any key to exit...
pause > nul

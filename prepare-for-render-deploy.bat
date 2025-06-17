@echo off
echo ===================================
echo COFFEE LAB - PREPARE FOR RENDER DEPLOYMENT
echo ===================================
echo.
echo This script will prepare the application for deployment to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Building frontend...
cd my-web-app
call npm run build
cd ..

echo.
echo Creating frontend-build directory in backend...
if not exist backend\frontend-build mkdir backend\frontend-build

echo.
echo Copying frontend build to backend...
xcopy /E /Y my-web-app\dist\* backend\frontend-build\

echo.
echo Copying production environment files...
copy my-web-app\.env.production my-web-app\.env
copy backend\.env.production backend\.env

echo.
echo Application is now ready for deployment to Render!
echo.
echo Press any key to exit...
pause > nul

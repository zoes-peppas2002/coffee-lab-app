@echo off
echo ===================================
echo COFFEE LAB - FIX AND DEPLOY
echo ===================================
echo.
echo This script will fix route order issues and deploy to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Fixing route order...
call fix-route-order.bat

echo.
echo Step 2: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 3: Deploying to Render...
call deploy-to-render.bat

echo.
echo All steps completed!
echo.
echo The application has been fixed and deployed to Render.
echo.
echo Press any key to exit...
pause > nul

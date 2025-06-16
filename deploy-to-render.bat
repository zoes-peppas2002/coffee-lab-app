@echo off
echo ===================================
echo COFFEE LAB - DEPLOY TO RENDER
echo ===================================
echo.
echo This script will deploy the application to Render by:
echo 1. Committing the changes to GitHub
echo 2. Pushing the changes to GitHub
echo 3. Triggering a deployment on Render
echo.
echo Press any key to continue...
pause > nul

echo.
echo Committing changes to GitHub...
git add .
git commit -m "Fix login issues and prepare for Render deployment"

echo.
echo Pushing changes to GitHub...
git push

echo.
echo Deployment triggered. Render will automatically deploy the application.
echo Please check the Render dashboard for deployment status.
echo.
echo Press any key to exit...
pause > nul

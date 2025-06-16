@echo off
echo ===================================
echo COFFEE LAB - DEPLOY TO RENDER
echo ===================================
echo.
echo This script will guide you through the process of deploying the application to Render.
echo.
echo Before proceeding, make sure you have:
echo 1. Fixed the login issues using fix-login-issue.bat
echo 2. Prepared the application for deployment using prepare-for-render-deploy.bat
echo 3. Pushed the changes to GitHub using upload-to-github.bat
echo.
echo Press any key to continue...
pause > nul

echo.
echo Opening the Render deployment guide...
start render-deployment-steps.md

echo.
echo Please follow the instructions in the deployment guide to deploy the application to Render.
echo.
echo After deploying, you can test the application by opening the URL provided by Render.
echo.
echo Press any key to exit...
pause > nul

@echo off
echo ===================================
echo COFFEE LAB - DEPLOY TO RENDER
echo ===================================
echo.
echo This script will:
echo 1. Prepare the application for Render deployment
echo 2. Push the changes to GitHub
echo 3. Guide you through deploying to Render
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 2: Pushing changes to GitHub...
git add .
set /p commit_message=Enter commit message (e.g., "Fix route order issues and prepare for Render deployment"): 
git commit -m "%commit_message%"
git push

echo.
echo Step 3: Deploying to Render...
echo.
echo Please follow these steps to deploy to Render:
echo 1. Go to your Render dashboard: https://dashboard.render.com
echo 2. Select your web service
echo 3. Go to "Manual Deploy" and select "Clear build cache & deploy"
echo 4. Wait for the deployment to complete
echo.
echo ===================================
echo Process completed!
echo.
echo Your changes have been pushed to GitHub.
echo Don't forget to manually deploy on Render.
echo ===================================
echo.
pause

@echo off
echo ===================================
echo COFFEE LAB - PUSH AND DEPLOY
echo ===================================
echo.
echo This script will help you push your changes to GitHub and deploy to Render.
echo.
echo Before continuing, make sure you have:
echo 1. Run fix-package-json.bat to ensure the package.json file is correct
echo 2. Run prepare-for-render.bat to build the frontend
echo.
echo Press any key to continue...
pause > nul

echo.
echo Adding all files to Git...
git add .

echo.
echo Committing changes...
set /p commit_message=Enter commit message (e.g., "Fix package.json for Render"): 
git commit -m "%commit_message%"

echo.
echo Pushing to GitHub...
git push

echo.
echo ===================================
echo Process completed!
echo.
echo Next steps:
echo 1. Go to your Render dashboard: https://dashboard.render.com
echo 2. Select your web service
echo 3. Go to Settings and update the Start Command to: node server.js
echo 4. Click "Save Changes"
echo 5. Go to "Manual Deploy" and select "Clear build cache & deploy"
echo ===================================
echo.
pause

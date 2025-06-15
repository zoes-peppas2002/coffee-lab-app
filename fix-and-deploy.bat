@echo off
echo ===================================
echo COFFEE LAB - FIX ROUTES AND DEPLOY
echo ===================================
echo.
echo This script will:
echo 1. Fix route order issues in all route files
echo 2. Push the changes to GitHub
echo 3. Deploy to Render
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Running fix-route-order.js...
node fix-route-order.js

echo.
echo Step 2: Testing the server locally...
echo Starting the server. Press Ctrl+C to stop after a few seconds if everything looks good.
echo.
start /wait cmd /c "cd backend && node server.js"

echo.
echo Step 3: Pushing changes to GitHub...
git add .
set /p commit_message=Enter commit message (e.g., "Fix route order issues"): 
git commit -m "%commit_message%"
git push

echo.
echo Step 4: Deploying to Render...
echo.
echo Please follow these steps to deploy to Render:
echo 1. Go to your Render dashboard: https://dashboard.render.com
echo 2. Select your web service
echo 3. Go to "Manual Deploy" and select "Clear build cache & deploy"
echo.
echo ===================================
echo Process completed!
echo.
echo Your changes have been pushed to GitHub.
echo Don't forget to deploy manually on Render.
echo ===================================
echo.
pause

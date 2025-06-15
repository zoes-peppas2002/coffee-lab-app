@echo off
echo ===================================
echo COFFEE LAB - FIX GITHUB REPOSITORY
echo ===================================
echo.
echo This script will help you fix the GitHub repository structure.
echo.
echo It seems that the backend folder is not properly uploaded to GitHub.
echo This script will create a new commit with the correct structure.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Adding all files to Git...
git add .

echo.
echo Committing changes...
git commit -m "Fix repository structure and add backend folder"

echo.
echo Pushing to GitHub...
git push

echo.
echo ===================================
echo Process completed!
echo.
echo Next steps:
echo 1. Go to your GitHub repository and verify that the backend folder is now visible
echo 2. Go to your Render dashboard: https://dashboard.render.com
echo 3. Select your web service
echo 4. Go to Settings and update the Start Command to: node server.js
echo 5. Click "Save Changes"
echo 6. Go to "Manual Deploy" and select "Clear build cache & deploy"
echo ===================================
echo.
pause

@echo off
echo ===================================
echo COFFEE LAB - FIX GIT STRUCTURE
echo ===================================
echo.
echo This script will fix the Git repository structure by removing the nested .git directory.
echo.
echo It seems that the backend folder has its own .git repository, which is causing issues.
echo This script will remove the nested .git directory and add everything to the main repository.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Removing the nested .git directory from the backend folder...
rmdir /s /q backend\.git
echo Done!

echo.
echo Adding all files to Git...
git add .

echo.
echo Committing changes...
git commit -m "Fix repository structure by removing nested .git directory"

echo.
echo Pushing to GitHub...
git push

echo.
echo ===================================
echo Process completed!
echo.
echo Next steps:
echo 1. Go to your GitHub repository and verify that the backend folder is now visible and contains all files
echo 2. Go to your Render dashboard: https://dashboard.render.com
echo 3. Select your web service
echo 4. Go to Settings and update the Start Command to: node server.js
echo 5. Click "Save Changes"
echo 6. Go to "Manual Deploy" and select "Clear build cache & deploy"
echo ===================================
echo.
pause

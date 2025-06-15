@echo off
echo ===================================
echo COFFEE LAB - RESET GITHUB REPOSITORY
echo ===================================
echo.
echo This script will completely remove the backend folder from the GitHub repository
echo and then add it back as a regular folder.
echo.
echo WARNING: This will delete the backend folder from GitHub and then re-add it.
echo Make sure you have a backup of your code before proceeding.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Removing the nested .git directory from the backend folder...
rmdir /s /q backend\.git
echo Done!

echo.
echo Step 2: Removing the backend folder from the GitHub repository...
git rm -r --cached backend
echo Done!

echo.
echo Step 3: Committing the removal...
git commit -m "Remove backend folder from repository"

echo.
echo Step 4: Pushing the changes to GitHub...
git push

echo.
echo Step 5: Adding the backend folder back to the repository...
git add backend
echo Done!

echo.
echo Step 6: Committing the addition...
git commit -m "Add backend folder as regular directory"

echo.
echo Step 7: Pushing the changes to GitHub...
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

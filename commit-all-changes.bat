@echo off
echo ===================================
echo COFFEE LAB - COMMIT ALL CHANGES
echo ===================================
echo.
echo This script will commit and push all changes to both frontend and backend repositories.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Committing and pushing changes to the frontend repository...
cd my-web-app
git add .
git commit -m "Update frontend configuration and fix login issues"
git push
cd ..

echo.
echo Step 2: Committing and pushing changes to the backend repository...
cd backend
git add .
git commit -m "Update database connection details and fix login issues"
git push
cd ..

echo.
echo All changes have been committed and pushed!
echo.
echo Press any key to exit...
pause > nul

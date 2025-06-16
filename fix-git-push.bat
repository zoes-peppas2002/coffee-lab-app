@echo off
echo ===================================
echo COFFEE LAB - FIX GIT PUSH
echo ===================================
echo.
echo This script will fix git push issues by creating a new file to test if git push works.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Creating a new file to test if git push works...
node fix-git-push.js

echo.
echo Running git add...
git add fix-git-push.js

echo.
echo Running git commit...
git commit -m "Fix git push issues"

echo.
echo Running git push...
git push

echo.
echo Script completed. Press any key to exit...
pause > nul

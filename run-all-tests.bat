@echo off
echo ===================================
echo COFFEE LAB - RUN ALL TESTS
echo ===================================
echo.
echo This script will run all the tests:
echo 1. Test login locally
echo 2. Test login on Render
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Testing login locally...
call test-login.bat

echo.
echo Step 2: Testing login on Render...
call test-render-login.bat

echo.
echo All tests completed. Press any key to exit...
pause > nul

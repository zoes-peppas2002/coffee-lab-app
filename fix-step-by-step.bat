@echo off
echo ===================================
echo COFFEE LAB - FIX STEP BY STEP
echo ===================================
echo.
echo This script will guide you through fixing the application step by step.
echo.
echo Press any key to continue...
pause > nul

:menu
cls
echo ===================================
echo COFFEE LAB - FIX STEP BY STEP
echo ===================================
echo.
echo Choose what you want to fix:
echo.
echo 1. Install dependencies
echo 2. Test database connection
echo 3. Fix users table schema
echo 4. Fix user management issues
echo 5. Fix database URLs
echo 6. Add all files to Git
echo 7. Configure for local MySQL database
echo 8. Configure for Render PostgreSQL database
echo 9. Run the application locally
echo 10. Deploy to Render
echo 11. Exit
echo.
set /p choice=Enter your choice (1-8): 

if "%choice%"=="1" goto install_dependencies
if "%choice%"=="2" goto test_db_connection
if "%choice%"=="3" goto fix_users_table
if "%choice%"=="4" goto fix_user_management
if "%choice%"=="5" goto fix_db_urls
if "%choice%"=="6" goto add_all_files_to_git
if "%choice%"=="7" goto use_local_mysql
if "%choice%"=="8" goto use_render_postgres
if "%choice%"=="9" goto run_local
if "%choice%"=="10" goto deploy_render
if "%choice%"=="11" goto end

echo.
echo Invalid choice. Please try again.
timeout /t 2 > nul
goto menu

:install_dependencies
cls
echo ===================================
echo STEP 1: INSTALL DEPENDENCIES
echo ===================================
echo.
echo This step will install all required dependencies for the application.
echo.
echo Press any key to continue...
pause > nul

call install-dependencies.bat

echo.
echo Dependencies installed successfully!
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:test_db_connection
cls
echo ===================================
echo STEP 2: TEST DATABASE CONNECTION
echo ===================================
echo.
echo This step will test the connection to the database.
echo.
echo Which database do you want to test?
echo 1. Local MySQL database
echo 2. Render PostgreSQL database
echo.
set /p db_choice=Enter your choice (1-2): 

if "%db_choice%"=="1" (
  echo.
  echo Configuring to use local MySQL database...
  call use-local-mysql.bat
) else if "%db_choice%"=="2" (
  echo.
  echo Configuring to use Render PostgreSQL database...
  call use-render-postgres.bat
) else (
  echo.
  echo Invalid choice. Returning to menu...
  timeout /t 2 > nul
  goto menu
)

echo.
echo Testing database connection...
call test-updated-db-connection.bat

echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:fix_users_table
cls
echo ===================================
echo STEP 3: FIX USERS TABLE SCHEMA
echo ===================================
echo.
echo This step will fix the users table schema by adding the name column.
echo.
echo Which database do you want to fix?
echo 1. Local MySQL database
echo 2. Render PostgreSQL database
echo.
set /p db_choice=Enter your choice (1-2): 

if "%db_choice%"=="1" (
  echo.
  echo Configuring to use local MySQL database...
  call use-local-mysql.bat
) else if "%db_choice%"=="2" (
  echo.
  echo Configuring to use Render PostgreSQL database...
  call use-render-postgres.bat
) else (
  echo.
  echo Invalid choice. Returning to menu...
  timeout /t 2 > nul
  goto menu
)

echo.
echo Fixing users table schema...
call fix-users-table.bat

echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:fix_user_management
cls
echo ===================================
echo STEP 4: FIX USER MANAGEMENT ISSUES
echo ===================================
echo.
echo This step will fix issues with user management in the database.
echo.
echo Which database do you want to fix?
echo 1. Local MySQL database
echo 2. Render PostgreSQL database
echo.
set /p db_choice=Enter your choice (1-2): 

if "%db_choice%"=="1" (
  echo.
  echo Configuring to use local MySQL database...
  call use-local-mysql.bat
) else if "%db_choice%"=="2" (
  echo.
  echo Configuring to use Render PostgreSQL database...
  call use-render-postgres.bat
) else (
  echo.
  echo Invalid choice. Returning to menu...
  timeout /t 2 > nul
  goto menu
)

echo.
echo Fixing user management issues...
call fix-user-management.bat

echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:fix_db_urls
cls
echo ===================================
echo STEP 5: FIX DATABASE URLS
echo ===================================
echo.
echo This step will fix the database URLs for internal and external connections.
echo.
echo Press any key to continue...
pause > nul

call fix-db-urls.bat

echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:add_all_files_to_git
cls
echo ===================================
echo STEP 6: ADD ALL FILES TO GIT
echo ===================================
echo.
echo This step will add all files to the Git repository.
echo.
echo Press any key to continue...
pause > nul

call add-all-files-to-git.bat

echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:use_local_mysql
cls
echo ===================================
echo STEP 7: CONFIGURE FOR LOCAL MYSQL DATABASE
echo ===================================
echo.
echo This step will configure the application to use the local MySQL database.
echo.
echo Press any key to continue...
pause > nul

call use-local-mysql.bat

echo.
echo Configuration completed!
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:use_render_postgres
cls
echo ===================================
echo STEP 8: CONFIGURE FOR RENDER POSTGRESQL DATABASE
echo ===================================
echo.
echo This step will configure the application to use the Render PostgreSQL database.
echo.
echo Press any key to continue...
pause > nul

call use-render-postgres.bat

echo.
echo Configuration completed!
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:run_local
cls
echo ===================================
echo STEP 9: RUN THE APPLICATION LOCALLY
echo ===================================
echo.
echo This step will run the application locally.
echo.
echo Which database do you want to use?
echo 1. Local MySQL database
echo 2. Render PostgreSQL database
echo.
set /p db_choice=Enter your choice (1-2): 

if "%db_choice%"=="1" (
  echo.
  echo Configuring to use local MySQL database...
  call use-local-mysql.bat
) else if "%db_choice%"=="2" (
  echo.
  echo Configuring to use Render PostgreSQL database...
  call use-render-postgres.bat
) else (
  echo.
  echo Invalid choice. Returning to menu...
  timeout /t 2 > nul
  goto menu
)

echo.
echo Starting the backend server...
start cmd /k "cd backend && npm start"

echo.
echo Starting the frontend development server...
start cmd /k "cd my-web-app && npm run dev"

echo.
echo Both servers are now running!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo You can now test the login functionality with the following credentials:
echo.
echo Admin User:
echo Email: zp@coffeelab.gr
echo Password: Zoespeppas2025!
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:deploy_render
cls
echo ===================================
echo STEP 10: DEPLOY TO RENDER
echo ===================================
echo.
echo This step will deploy the application to Render.
echo.
echo Press any key to continue...
pause > nul

call deploy-to-render.bat

echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:end
cls
echo ===================================
echo COFFEE LAB - FIX STEP BY STEP
echo ===================================
echo.
echo Thank you for using the step-by-step fix script!
echo.
echo Press any key to exit...
pause > nul
exit

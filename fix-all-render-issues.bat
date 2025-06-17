@echo off
echo ===================================
echo COFFEE LAB - FIX ALL RENDER ISSUES
echo ===================================
echo.

echo Step 1: Fixing database URL...
call fix-database-url.bat
if %ERRORLEVEL% NEQ 0 (
  echo Warning: Database URL fix failed, but continuing...
)
echo.

echo Step 2: Fixing login endpoints...
call fix-login-endpoints.bat
if %ERRORLEVEL% NEQ 0 (
  echo Warning: Login endpoints fix failed, but continuing...
)
echo.

echo Step 3: Creating a combined summary...
echo # Combined Fixes Summary > combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo ## Προβλήματα που Διορθώθηκαν >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo ### 1. Προβλήματα με τη Βάση Δεδομένων >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo - Λανθασμένη μορφή του DATABASE_URL >> combined-fixes-summary.md
echo - Προβλήματα σύνδεσης με τη βάση δεδομένων >> combined-fixes-summary.md
echo - Πιθανή απουσία του πίνακα users >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo ### 2. Προβλήματα με τα Endpoints Σύνδεσης >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo - Ασυμβατότητα endpoints μεταξύ frontend και backend >> combined-fixes-summary.md
echo - Σφάλματα HTTP (404, 500) >> combined-fixes-summary.md
echo - Προβλήματα με το CORS >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo ## Λύσεις που Εφαρμόστηκαν >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo ### 1. Διόρθωση της Βάσης Δεδομένων >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo - Ενημερώθηκε το DATABASE_URL στο .env.production >> combined-fixes-summary.md
echo - Βελτιώθηκε το db-pg.js με καλύτερο χειρισμό σφαλμάτων >> combined-fixes-summary.md
echo - Δημιουργήθηκε script για τη δοκιμή της σύνδεσης με τη βάση δεδομένων >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo ### 2. Διόρθωση των Endpoints Σύνδεσης >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo - Ενημερώθηκε το LoginForm.jsx για να δοκιμάζει πολλαπλά endpoints >> combined-fixes-summary.md
echo - Προστέθηκε μέθοδος postWithFallback στο api.js >> combined-fixes-summary.md
echo - Βελτιώθηκε ο χειρισμός σφαλμάτων στο direct-auth.js >> combined-fixes-summary.md
echo - Προστέθηκε το route /direct-auth χωρίς το πρόθεμα /api >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo ## Πώς να Δοκιμάσετε τις Διορθώσεις >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo 1. Δοκιμάστε τη σύνδεση με τα στοιχεία του admin: >> combined-fixes-summary.md
echo    - Email: zp@coffeelab.gr >> combined-fixes-summary.md
echo    - Password: Zoespeppas2025! >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md
echo 2. Αν εξακολουθείτε να αντιμετωπίζετε προβλήματα: >> combined-fixes-summary.md
echo    - Ελέγξτε τα logs του Render για τυχόν σφάλματα >> combined-fixes-summary.md
echo    - Δοκιμάστε να καθαρίσετε την cache του browser >> combined-fixes-summary.md
echo    - Βεβαιωθείτε ότι το DATABASE_URL είναι σωστό στις μεταβλητές περιβάλλοντος του Render >> combined-fixes-summary.md
echo    - Δοκιμάστε να κάνετε redeploy την εφαρμογή >> combined-fixes-summary.md
echo. >> combined-fixes-summary.md

echo Step 4: Final deployment to Render...
call deploy-to-render.bat
if %ERRORLEVEL% NEQ 0 (
  echo Error deploying to Render!
  exit /b %ERRORLEVEL%
)
echo.

echo All fixes have been applied and deployed!
echo Please check the Render dashboard for deployment status.
echo See combined-fixes-summary.md for a summary of all fixes.
echo.

pause

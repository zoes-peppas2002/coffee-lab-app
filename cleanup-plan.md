# Σχέδιο Καθαρισμού του Coffee Lab Web App

Αυτό το σχέδιο θα σας βοηθήσει να οργανώσετε το project και να αφαιρέσετε τα διπλότυπα αρχεία.

## 1. Αρχεία Batch που μπορούν να αφαιρεθούν

Τα παρακάτω batch αρχεία δημιουργήθηκαν για προσωρινές διορθώσεις και μπορούν να αφαιρεθούν:

```
backend/commit-and-push.bat
backend/cleanup-temp-files.bat
backend/run-drop-index.bat
backend/run-check-login.bat
backend/run-fix-local-db.bat
backend/run-check-mysql.bat
backend/run-update-db-credentials.bat
my-web-app/commit-frontend-fix.bat
backend/run-direct-fix.bat
my-web-app/run-frontend-fix.bat
backend/run-emergency-fix.bat
fix-everything.bat
backend/commit-direct-login-fix.bat
my-web-app/commit-direct-login-frontend.bat
direct-login-fix.bat
my-web-app/commit-routing-fix.bat
my-web-app/commit-debug-login.bat
run-local.bat
install-dependencies.bat
setup-local-environment.bat
my-web-app/commit-fallback-login.bat
complete-fix.bat
backend/run-fix-postgres-index.bat
backend/commit-db-fix.bat
backend/commit-login-fix.bat
backend/run-local-test.bat
backend/run-render-test.bat
backend/install-dependencies.bat
backend/commit-all-changes.bat
```

## 2. Αρχεία JavaScript που μπορούν να αφαιρεθούν

Τα παρακάτω JavaScript αρχεία δημιουργήθηκαν για προσωρινές διορθώσεις και μπορούν να αντικατασταθούν από το `setup-and-run.js`:

```
backend/check-admin-login.js
backend/drop-index.js
backend/check-login.js
backend/fix-local-db.js
backend/check-mysql.js
backend/update-db-credentials.js
backend/direct-fix.js
my-web-app/direct-frontend-fix.js
backend/emergency-fix.js
backend/fix-postgres-index.js
backend/test-local-login.js
backend/check-render-login.js
install-dependencies.js
start-app.js
```

## 3. Ενοποίηση των αρχείων περιβάλλοντος

Τα αρχεία περιβάλλοντος μπορούν να ενοποιηθούν:

1. Διατηρήστε το `my-web-app/.env.development` για τοπική ανάπτυξη
2. Διατηρήστε το `my-web-app/.env.production` για παραγωγή
3. Διατηρήστε το `backend/.env` για το backend

## 4. Ενοποίηση των αρχείων βάσης δεδομένων

Τα αρχεία βάσης δεδομένων μπορούν να ενοποιηθούν:

1. Διατηρήστε το `backend/db.js` για MySQL (τοπική ανάπτυξη)
2. Διατηρήστε το `backend/db-pg.js` για PostgreSQL (παραγωγή)
3. Διατηρήστε το `backend/init-db.js` για αρχικοποίηση της βάσης δεδομένων

## 5. Ενοποίηση των αρχείων SQL

Τα SQL αρχεία μπορούν να ενοποιηθούν σε ένα αρχείο `init-database.sql`:

```sql
-- Δημιουργία πίνακα χρηστών
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'area_manager', 'coffee_specialist') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Δημιουργία προεπιλεγμένου διαχειριστή
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'zp@coffeelab.gr', 'Zoespeppas2025!', 'admin')
ON DUPLICATE KEY UPDATE name = 'Admin';

-- Δημιουργία πίνακα καταστημάτων δικτύου
CREATE TABLE IF NOT EXISTS network_stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  area_manager INT,
  coffee_specialist INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (area_manager) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (coffee_specialist) REFERENCES users(id) ON DELETE SET NULL
);
```

## 6. Προτεινόμενη δομή αρχείων

Μετά τον καθαρισμό, η δομή αρχείων θα πρέπει να είναι:

```
/
├── README.md
├── setup-and-run.js
├── render-deployment-guide.md
├── init-database.js
├── init-database.sql
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── db.js
│   ├── db-pg.js
│   ├── init-db.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── checklists.js
│   │   ├── network.js
│   │   ├── stats.js
│   │   ├── stores.js
│   │   ├── templates.js
│   │   └── users.js
│   ├── static/
│   │   ├── images/
│   │   └── pdfs/
│   └── fonts/
└── my-web-app/
    ├── .env.development
    ├── .env.production
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── public/
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── assets/
        ├── components/
        │   ├── admin/
        │   ├── areaManager/
        │   ├── auth/
        │   ├── coffeeSpecialist/
        │   └── common/
        └── utils/
            └── api.js
```

## 7. Βήματα καθαρισμού

1. **Δημιουργήστε αντίγραφο ασφαλείας**:
   ```
   xcopy /E /I /H C:\Projects\MyWebApp C:\Projects\MyWebApp_backup
   ```

2. **Αφαιρέστε τα περιττά αρχεία batch**:
   ```
   del backend\*.bat
   del my-web-app\*.bat
   del *.bat
   ```

3. **Αφαιρέστε τα περιττά JavaScript αρχεία**:
   ```
   del backend\check-admin-login.js
   del backend\drop-index.js
   del backend\check-login.js
   del backend\fix-local-db.js
   del backend\check-mysql.js
   del backend\update-db-credentials.js
   del backend\direct-fix.js
   del my-web-app\direct-frontend-fix.js
   del backend\emergency-fix.js
   del backend\fix-postgres-index.js
   del backend\test-local-login.js
   del backend\check-render-login.js
   del install-dependencies.js
   del start-app.js
   ```

4. **Ενοποιήστε τα SQL αρχεία**:
   - Δημιουργήστε το αρχείο `init-database.sql` με το περιεχόμενο που προτείνεται παραπάνω
   - Αφαιρέστε τα περιττά SQL αρχεία:
     ```
     del backend\create-users-table.sql
     del backend\create-default-admin.sql
     del backend\create-network-table.sql
     del backend\reset-stores.sql
     ```

5. **Ενημερώστε το `init-database.js` για να χρησιμοποιεί το νέο SQL αρχείο**

6. **Ενημερώστε το `README.md` με οδηγίες για το πώς να χρησιμοποιήσετε το `setup-and-run.js`**

## 8. Συμβουλές για μελλοντική συντήρηση

1. **Χρησιμοποιήστε το Git για έλεγχο εκδόσεων**:
   - Αρχικοποιήστε ένα Git repository
   - Δημιουργήστε ξεχωριστά branches για νέες λειτουργίες
   - Χρησιμοποιήστε το Git για να παρακολουθείτε τις αλλαγές

2. **Χρησιμοποιήστε το `setup-and-run.js` για όλες τις εργασίες διαχείρισης**:
   - Εγκατάσταση εξαρτήσεων
   - Αρχικοποίηση βάσης δεδομένων
   - Εκκίνηση εφαρμογής

3. **Διατηρήστε ενημερωμένα τα αρχεία τεκμηρίωσης**:
   - README.md
   - render-deployment-guide.md
   - Σχόλια στον κώδικα

4. **Χρησιμοποιήστε το `.env` για όλες τις μεταβλητές περιβάλλοντος**:
   - Μην κωδικοποιείτε διαπιστευτήρια στον κώδικα
   - Χρησιμοποιήστε διαφορετικά αρχεία `.env` για διαφορετικά περιβάλλοντα

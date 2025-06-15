# Οδηγός Ανάπτυξης στο Render.com (Ενοποιημένη Έκδοση)

Αυτός ο οδηγός θα σας βοηθήσει να αναπτύξετε την ενοποιημένη εφαρμογή Coffee Lab στο Render.com.

## Προετοιμασία

Πριν ξεκινήσετε, βεβαιωθείτε ότι:

1. Έχετε λογαριασμό στο [Render.com](https://render.com)
2. Έχετε δημιουργήσει ένα repository στο GitHub με τον κώδικα της εφαρμογής
3. Η εφαρμογή λειτουργεί σωστά τοπικά

## Βήμα 1: Δημιουργία της ενοποιημένης έκδοσης

1. Τρέξτε το script `setup-and-run.js` και επιλέξτε την επιλογή 6 "Build unified app for Render"
2. Το script θα:
   - Δημιουργήσει τα απαραίτητα αρχεία περιβάλλοντος για παραγωγή
   - Κάνει build το frontend
   - Αντιγράψει τα αρχεία του frontend στον φάκελο `backend/frontend-build`
   - Προετοιμάσει το `package.json` του backend για το Render

## Βήμα 2: Ρύθμιση της PostgreSQL βάσης δεδομένων

1. Συνδεθείτε στο Render.com
2. Πηγαίνετε στο Dashboard και κάντε κλικ στο "New +"
3. Επιλέξτε "PostgreSQL"
4. Συμπληρώστε τα ακόλουθα στοιχεία:
   - Name: `coffee-lab-db`
   - Database: `coffee_lab_db`
   - User: `coffee_lab_user`
   - Region: Επιλέξτε την πλησιέστερη περιοχή (π.χ. Frankfurt)
   - PostgreSQL Version: 14
5. Κάντε κλικ στο "Create Database"
6. Περιμένετε μέχρι να δημιουργηθεί η βάση δεδομένων (θα πάρει λίγα λεπτά)
7. Αφού δημιουργηθεί, σημειώστε τις ακόλουθες πληροφορίες:
   - Internal Database URL
   - PSQL Command

## Βήμα 3: Ανάπτυξη της ενοποιημένης εφαρμογής

1. Στο Dashboard του Render, κάντε κλικ στο "New +" και επιλέξτε "Web Service"
2. Συνδέστε το GitHub repository σας
3. Συμπληρώστε τα ακόλουθα στοιχεία:
   - Name: `coffee-lab-app`
   - Region: Επιλέξτε την ίδια περιοχή με τη βάση δεδομένων
   - Branch: `main` (ή όποιο branch χρησιμοποιείτε)
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Στην ενότητα "Environment Variables", προσθέστε τις ακόλουθες μεταβλητές:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: (Χρησιμοποιήστε το Internal Database URL από το βήμα 2)
5. Κάντε κλικ στο "Create Web Service"

## Βήμα 4: Αρχικοποίηση της βάσης δεδομένων

Για να αρχικοποιήσετε τη βάση δεδομένων στο Render, θα χρειαστεί να εκτελέσετε τα SQL scripts μέσω του PSQL Command:

1. Συνδεθείτε στη βάση δεδομένων χρησιμοποιώντας το PSQL Command που σας παρέχεται από το Render
2. Εκτελέστε τα ακόλουθα SQL scripts:
   - `create-users-table.sql`
   - `create-default-admin.sql`
   - `create-network-table.sql`

Εναλλακτικά, η βάση δεδομένων θα αρχικοποιηθεί αυτόματα κατά την πρώτη εκκίνηση του server, καθώς το `init-db.js` εκτελείται κατά την εκκίνηση.

## Βήμα 5: Έλεγχος της εφαρμογής

1. Περιμένετε μέχρι να ολοκληρωθεί η ανάπτυξη της εφαρμογής
2. Επισκεφθείτε το URL της εφαρμογής: `https://coffee-lab-app.onrender.com`
3. Συνδεθείτε με τα διαπιστευτήρια του admin:
   - Email: `zp@coffeelab.gr`
   - Password: `Zoespeppas2025!`

## Αντιμετώπιση προβλημάτων

### Πρόβλημα: Δεν μπορώ να συνδεθώ

1. Ελέγξτε τα logs της εφαρμογής στο Render για τυχόν σφάλματα
2. Βεβαιωθείτε ότι η βάση δεδομένων έχει αρχικοποιηθεί σωστά
3. Ελέγξτε ότι η μεταβλητή `DATABASE_URL` είναι σωστά ρυθμισμένη

### Πρόβλημα: Η εφαρμογή φορτώνει αλλά δεν μπορώ να δω τα δεδομένα

1. Ελέγξτε τα logs της εφαρμογής για σφάλματα σύνδεσης με τη βάση δεδομένων
2. Βεβαιωθείτε ότι η βάση δεδομένων είναι προσβάσιμη από την εφαρμογή
3. Ελέγξτε ότι τα API endpoints λειτουργούν σωστά

## Σημειώσεις

- Το Render.com προσφέρει δωρεάν tier για όλες τις υπηρεσίες, αλλά με περιορισμούς:
  - Οι δωρεάν web services τερματίζονται μετά από 15 λεπτά αδράνειας
  - Οι δωρεάν βάσεις δεδομένων έχουν περιορισμένο χώρο αποθήκευσης
  - Τα δεδομένα στις δωρεάν βάσεις δεδομένων διατηρούνται για 90 ημέρες
- Για παραγωγικό περιβάλλον, συνιστάται η αναβάθμιση σε πληρωμένο πλάνο:
  - Οι πληρωμένες υπηρεσίες λειτουργούν συνεχώς χωρίς διακοπές
  - Τα δεδομένα διατηρούνται μόνιμα
  - Παρέχονται αυτόματα backups

## Χρήσιμοι σύνδεσμοι

- [Render Dashboard](https://dashboard.render.com/)
- [Render Docs: PostgreSQL](https://render.com/docs/databases)
- [Render Docs: Web Services](https://render.com/docs/web-services)
- [Render Docs: Environment Variables](https://render.com/docs/environment-variables)

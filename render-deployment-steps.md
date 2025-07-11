# Βήματα Ανάπτυξης στο Render (Free Plan)

Αυτός ο οδηγός περιγράφει βήμα προς βήμα τη διαδικασία ανάπτυξης της εφαρμογής Coffee Lab στο Render χρησιμοποιώντας το δωρεάν πλάνο.

## Προετοιμασία

### Βήμα 1: Προετοιμασία της ενοποιημένης εφαρμογής

1. Κλείστε την εφαρμογή αν τρέχει (πατήστε Ctrl+C στο τερματικό)
2. Κάντε διπλό κλικ στο αρχείο `prepare-for-render.bat`
3. Περιμένετε να ολοκληρωθεί η διαδικασία build
4. Βεβαιωθείτε ότι το αρχείο `backend/package.json` περιέχει το script "start":
   - **Επιλογή 1**: Κάντε διπλό κλικ στο αρχείο `fix-package-json.bat` για αυτόματη διόρθωση
   - **Επιλογή 2**: Ανοίξτε το αρχείο `backend/package.json` και ελέγξτε χειροκίνητα:
     - Βεβαιωθείτε ότι υπάρχει η ενότητα "scripts" και περιέχει το "start": "node server.js"
     - Αν δεν υπάρχει, προσθέστε το χειροκίνητα:
     ```json
     "scripts": {
       "start": "node server.js"
     }
     ```

### Βήμα 2: Δημιουργία λογαριασμού στο Render

1. Επισκεφθείτε το [Render.com](https://render.com)
2. Κάντε κλικ στο "Sign Up" και δημιουργήστε έναν λογαριασμό
   - Μπορείτε να συνδεθείτε με GitHub, GitLab, Google ή να δημιουργήσετε λογαριασμό με email

## Δημιουργία της Βάσης Δεδομένων

### Βήμα 3: Δημιουργία PostgreSQL βάσης δεδομένων

1. Συνδεθείτε στο [Render Dashboard](https://dashboard.render.com)
2. Κάντε κλικ στο "New +" στην πάνω δεξιά γωνία
3. Επιλέξτε "PostgreSQL"
4. Συμπληρώστε τα ακόλουθα στοιχεία:
   - **Name**: `coffee-lab-db`
   - **Database**: `coffee_lab_db`
   - **User**: `coffee_lab_user`
   - **Region**: Επιλέξτε "Frankfurt EU Central" (ή την πλησιέστερη περιοχή)
   - **PostgreSQL Version**: 14
   - **Instance Type**: Αφήστε το προεπιλεγμένο "Free"
5. Κάντε κλικ στο "Create Database"
6. Περιμένετε μέχρι να δημιουργηθεί η βάση δεδομένων (θα πάρει λίγα λεπτά)
7. Μόλις δημιουργηθεί, κάντε κλικ στη βάση δεδομένων για να δείτε τις λεπτομέρειες
8. Σημειώστε το **Internal Database URL** - θα το χρειαστείτε αργότερα

## Ανέβασμα του Κώδικα στο GitHub

### Βήμα 4: Δημιουργία GitHub repository

1. Συνδεθείτε στο [GitHub](https://github.com)
2. Κάντε κλικ στο "+" στην πάνω δεξιά γωνία και επιλέξτε "New repository"
3. Δώστε ένα όνομα στο repository (π.χ. `coffee-lab-app`)
4. Αφήστε το repository ως "Public" για ευκολότερη πρόσβαση από το Render
5. Κάντε κλικ στο "Create repository"

### Βήμα 5: Ανέβασμα του κώδικα στο GitHub

1. Ανοίξτε ένα τερματικό στον φάκελο του project
2. Εκτελέστε τις ακόλουθες εντολές:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/coffee-lab-app.git
git push -u origin main
```

Αντικαταστήστε το `YOUR_USERNAME` με το username σας στο GitHub.

## Ανάπτυξη της Εφαρμογής στο Render

### Βήμα 6: Δημιουργία Web Service στο Render

1. Επιστρέψτε στο [Render Dashboard](https://dashboard.render.com)
2. Κάντε κλικ στο "New +" και επιλέξτε "Web Service"
3. Κάντε κλικ στο "Build and deploy from a Git repository"
4. Συνδέστε το GitHub account σας αν δεν το έχετε κάνει ήδη
5. Επιλέξτε το repository `coffee-lab-app` που μόλις δημιουργήσατε
6. Συμπληρώστε τα ακόλουθα στοιχεία:
   - **Name**: `coffee-lab-app`
   - **Region**: Επιλέξτε την ίδια περιοχή με τη βάση δεδομένων (π.χ. "Frankfurt EU Central")
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` (ΣΗΜΑΝΤΙΚΟ: Χρησιμοποιήστε αυτό αντί για `npm start`)
   - **Instance Type**: Αφήστε το προεπιλεγμένο "Free"

7. Στην ενότητα "Environment Variables", κάντε κλικ στο "Add Environment Variable" και προσθέστε τις ακόλουθες μεταβλητές:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: (Χρησιμοποιήστε το Internal Database URL από το βήμα 3)

8. Κάντε κλικ στο "Create Web Service"

### Βήμα 7: Παρακολούθηση της διαδικασίας ανάπτυξης

1. Θα μεταφερθείτε στη σελίδα του web service
2. Παρακολουθήστε τα logs για να δείτε την πρόοδο της ανάπτυξης
3. Η διαδικασία θα διαρκέσει μερικά λεπτά
4. Μόλις ολοκληρωθεί, θα δείτε ένα μήνυμα επιτυχίας και ένα URL για την εφαρμογή σας

### Βήμα 8: Δοκιμή της εφαρμογής

1. Κάντε κλικ στο URL της εφαρμογής (θα είναι κάτι σαν `https://coffee-lab-app.onrender.com`)
2. Θα εμφανιστεί η σελίδα σύνδεσης της εφαρμογής
3. Συνδεθείτε με τα ακόλουθα στοιχεία:
   - Email: `zp@coffeelab.gr`
   - Password: `Zoespeppas2025!`

## Σημειώσεις για το Free Plan του Render

- **Αδράνεια**: Στο δωρεάν πλάνο, το web service θα τερματιστεί μετά από 15 λεπτά αδράνειας
- **Επανεκκίνηση**: Όταν επισκεφθείτε ξανά την εφαρμογή μετά από αδράνεια, θα χρειαστεί περίπου 30-45 δευτερόλεπτα για να ξεκινήσει
- **Περιορισμοί**: Το δωρεάν πλάνο έχει περιορισμένους πόρους και μπορεί να είναι πιο αργό από ένα πληρωμένο πλάνο
- **Διάρκεια**: Τα δεδομένα στις δωρεάν βάσεις δεδομένων διατηρούνται για 90 ημέρες

## Αναβάθμιση σε Πληρωμένο Πλάνο

Αν η εφαρμογή λειτουργεί σωστά και θέλετε να την αναβαθμίσετε σε πληρωμένο πλάνο:

1. Επισκεφθείτε το [Render Dashboard](https://dashboard.render.com)
2. Επιλέξτε το web service `coffee-lab-app`
3. Κάντε κλικ στο "Change Plan" στην ενότητα "Instance Type"
4. Επιλέξτε το κατάλληλο πλάνο για τις ανάγκες σας
5. Κάντε το ίδιο για τη βάση δεδομένων αν χρειάζεται

Τα πληρωμένα πλάνα προσφέρουν:
- Συνεχή λειτουργία χωρίς διακοπές λόγω αδράνειας
- Καλύτερη απόδοση και περισσότερους πόρους
- Μόνιμη αποθήκευση δεδομένων
- Αυτόματα backups

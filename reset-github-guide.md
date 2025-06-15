# Οδηγός Επαναφοράς του GitHub Repository

Αυτός ο οδηγός θα σας βοηθήσει να επιλύσετε το πρόβλημα με το GitHub repository, διαγράφοντας εντελώς τον φάκελο `backend` από το repository και προσθέτοντάς τον ξανά ως κανονικό φάκελο.

## Το Πρόβλημα

Ο φάκελος `backend` έχει το δικό του `.git` directory, που σημαίνει ότι είναι ένα ξεχωριστό Git repository. Αυτός είναι ο λόγος που δεν ανεβαίνει σωστά στο κύριο repository και το Render δεν μπορεί να βρει το αρχείο `server.js`.

## Η Λύση

### Βήμα 1: Επαναφορά του GitHub Repository

1. Κάντε διπλό κλικ στο αρχείο `reset-github-repo.bat`
2. Αυτό το script θα:
   - Αφαιρέσει το ένθετο `.git` directory από τον φάκελο `backend`
   - Αφαιρέσει τον φάκελο `backend` από το GitHub repository
   - Προσθέσει τον φάκελο `backend` ξανά ως κανονικό φάκελο
   - Ανεβάσει τις αλλαγές στο GitHub
3. Περιμένετε να ολοκληρωθεί η διαδικασία
4. Επισκεφθείτε το GitHub repository σας και βεβαιωθείτε ότι ο φάκελος `backend` είναι πλέον ορατός και περιέχει όλα τα αρχεία

### Βήμα 2: Ενημέρωση του Render

1. Επισκεφθείτε το [Render Dashboard](https://dashboard.render.com)
2. Επιλέξτε το web service `coffee-lab-app`
3. Πηγαίνετε στο "Settings"
4. Βεβαιωθείτε ότι το "Root Directory" είναι ρυθμισμένο σε `backend`
5. Βρείτε το πεδίο "Start Command" και αλλάξτε το σε: `node server.js`
6. Κάντε κλικ στο "Save Changes"
7. Πηγαίνετε στο "Manual Deploy" και επιλέξτε "Clear build cache & deploy"

## Εναλλακτική Λύση: Χειροκίνητη Διαδικασία

Αν το script δεν λειτουργήσει, μπορείτε να ακολουθήσετε τα παρακάτω βήματα χειροκίνητα:

1. Ανοίξτε ένα τερματικό στον φάκελο του project
2. Εκτελέστε τις ακόλουθες εντολές:

```bash
# Αφαιρέστε το ένθετο .git directory
rmdir /s /q backend\.git

# Αφαιρέστε τον φάκελο backend από το repository
git rm -r --cached backend

# Δημιουργήστε ένα commit για την αφαίρεση
git commit -m "Remove backend folder from repository"

# Ανεβάστε τις αλλαγές στο GitHub
git push

# Προσθέστε τον φάκελο backend ξανά στο repository
git add backend

# Δημιουργήστε ένα commit για την προσθήκη
git commit -m "Add backend folder as regular directory"

# Ανεβάστε τις αλλαγές στο GitHub
git push
```

## Εναλλακτική Λύση: Δημιουργία Νέου Repository

Αν εξακολουθείτε να αντιμετωπίζετε προβλήματα, μπορείτε να δημιουργήσετε ένα εντελώς νέο repository:

1. Δημιουργήστε ένα νέο repository στο GitHub
2. Αντιγράψτε τον φάκελο `backend` σε έναν νέο φάκελο
3. Αρχικοποιήστε ένα νέο Git repository σε αυτόν τον φάκελο:

```bash
cd path/to/new/folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/NEW_REPO_NAME.git
git push -u origin main
```

4. Στο Render, δημιουργήστε ένα νέο web service που συνδέεται με αυτό το νέο repository
5. Ρυθμίστε το "Root Directory" σε `.` (τελεία)
6. Ρυθμίστε το "Start Command" σε `node server.js`
7. Προσθέστε τις απαραίτητες μεταβλητές περιβάλλοντος

## Επιπλέον Σημειώσεις

- Βεβαιωθείτε ότι ο φάκελος `backend/frontend-build` περιέχει τα σωστά αρχεία του frontend
- Βεβαιωθείτε ότι το αρχείο `backend/package.json` περιέχει το script "start": "node server.js"
- Αν χρησιμοποιείτε Git για πρώτη φορά, ίσως χρειαστεί να ρυθμίσετε το όνομα και το email σας με τις εντολές:
  ```
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"

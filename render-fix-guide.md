# Οδηγός Επίλυσης Προβλημάτων Ανάπτυξης στο Render

Αυτός ο οδηγός θα σας βοηθήσει να επιλύσετε το πρόβλημα με το "npm start" στο Render.

## Βήματα Επίλυσης

### Βήμα 1: Διόρθωση του package.json

1. Κάντε διπλό κλικ στο αρχείο `fix-package-json.bat`
2. Περιμένετε να ολοκληρωθεί η διαδικασία

### Βήμα 2: Προετοιμασία της εφαρμογής για το Render

1. Κάντε διπλό κλικ στο αρχείο `prepare-for-render.bat`
2. Περιμένετε να ολοκληρωθεί η διαδικασία build

### Βήμα 3: Ανέβασμα των αλλαγών στο GitHub

1. Κάντε διπλό κλικ στο αρχείο `push-and-deploy.bat`
2. Ακολουθήστε τις οδηγίες στο παράθυρο του τερματικού
3. Δώστε ένα μήνυμα για το commit (π.χ. "Fix package.json for Render")

### Βήμα 4: Ενημέρωση του Render

1. Επισκεφθείτε το [Render Dashboard](https://dashboard.render.com)
2. Επιλέξτε το web service `coffee-lab-app`
3. Πηγαίνετε στο "Settings"
4. Βρείτε το πεδίο "Start Command" και αλλάξτε το σε: `node server.js`
5. Κάντε κλικ στο "Save Changes"
6. Πηγαίνετε στο "Manual Deploy" και επιλέξτε "Clear build cache & deploy"

### Βήμα 5: Παρακολούθηση της διαδικασίας ανάπτυξης

1. Πηγαίνετε στην καρτέλα "Logs" για να δείτε την πρόοδο της ανάπτυξης
2. Περιμένετε μέχρι να ολοκληρωθεί η διαδικασία
3. Μόλις ολοκληρωθεί, επισκεφθείτε το URL της εφαρμογής σας

## Επιπλέον Σημειώσεις

- Βεβαιωθείτε ότι έχετε ορίσει τη μεταβλητή περιβάλλοντος `DATABASE_URL` στο Render
- Αν εξακολουθείτε να αντιμετωπίζετε προβλήματα, δοκιμάστε να αλλάξετε το "Build Command" σε: `npm install && cd ../my-web-app && npm install && npm run build && cd ../backend && mkdir -p frontend-build && cp -r ../my-web-app/dist/* frontend-build/`
- Αν χρειάζεστε περισσότερη βοήθεια, ανατρέξτε στο [Render Troubleshooting Guide](https://render.com/docs/troubleshooting-deploys)

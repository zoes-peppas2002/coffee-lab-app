# Οδηγός για το DATABASE_URL στο Render

Το DATABASE_URL είναι μια συμβολοσειρά σύνδεσης που περιέχει όλες τις απαραίτητες πληροφορίες για τη σύνδεση με τη βάση δεδομένων PostgreSQL στο Render.

## Πού θα βρείτε το DATABASE_URL

Στο Render, μπορείτε να βρείτε το DATABASE_URL με τους εξής τρόπους:

### 1. Από τον πίνακα ελέγχου της βάσης δεδομένων PostgreSQL

1. Συνδεθείτε στο λογαριασμό σας στο Render (https://dashboard.render.com)
2. Πηγαίνετε στην ενότητα "PostgreSQL" στο αριστερό μενού
3. Επιλέξτε τη βάση δεδομένων που δημιουργήσατε για την εφαρμογή Coffee Lab
4. Στη σελίδα λεπτομερειών της βάσης δεδομένων, θα δείτε την ενότητα "Connections"
5. Εκεί θα βρείτε το "External Database URL" ή το "Internal Database URL"

### 2. Από την εικόνα που παρέχετε

Βλέπω ότι έχετε ήδη πρόσβαση στις πληροφορίες της βάσης δεδομένων. Από την εικόνα που παρέχετε, το DATABASE_URL είναι το "External Database URL" που φαίνεται στην εικόνα:

```
postgresql://coffee_lab_user:JZBtkeHcgpITKIKBJj6Dw7M4eAIMgh2r@dpg-d17f1i0cmk4c73cq1j50-a.oregon-postgres.render.com/coffee_lab_db_lyf9
```

## Μορφή του DATABASE_URL

Το DATABASE_URL έχει την εξής μορφή:

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

Όπου:
- `USERNAME`: Το όνομα χρήστη της βάσης δεδομένων (στην περίπτωσή σας: `coffee_lab_user`)
- `PASSWORD`: Ο κωδικός πρόσβασης της βάσης δεδομένων (στην περίπτωσή σας: `JZBtkeHcgpITKIKBJj6Dw7M4eAIMgh2r`)
- `HOST`: Ο διακομιστής που φιλοξενεί τη βάση δεδομένων (στην περίπτωσή σας: `dpg-d17f1i0cmk4c73cq1j50-a.oregon-postgres.render.com`)
- `PORT`: Η θύρα της βάσης δεδομένων (συνήθως `5432` για PostgreSQL)
- `DATABASE`: Το όνομα της βάσης δεδομένων (στην περίπτωσή σας: `coffee_lab_db_lyf9`)

## Πώς να χρησιμοποιήσετε το DATABASE_URL

Όταν εκτελείτε το script `deploy-to-render.bat`, θα σας ζητηθεί να εισάγετε το DATABASE_URL. Απλά αντιγράψτε και επικολλήστε το "External Database URL" από το Render.

Για παράδειγμα, όταν το script σας ρωτήσει:

```
Please enter your Render PostgreSQL database URL:
DATABASE_URL:
```

Θα πρέπει να επικολλήσετε:

```
postgresql://coffee_lab_user:JZBtkeHcgpITKIKBJj6Dw7M4eAIMgh2r@dpg-d17f1i0cmk4c73cq1j50-a.oregon-postgres.render.com/coffee_lab_db_lyf9
```

## Σημείωση Ασφαλείας

Το DATABASE_URL περιέχει ευαίσθητες πληροφορίες, συμπεριλαμβανομένου του κωδικού πρόσβασης της βάσης δεδομένων. Μην το μοιράζεστε δημόσια και βεβαιωθείτε ότι αποθηκεύεται με ασφάλεια στα αρχεία περιβάλλοντος (`.env`) της εφαρμογής σας.

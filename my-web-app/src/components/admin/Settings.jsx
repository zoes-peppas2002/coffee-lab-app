import React, { useState } from 'react';
import AdminLayout from './AdminLayout';

const Settings = () => {
  const [systemTitle, setSystemTitle] = useState("CheckList Management");
  const [welcomeMessage, setWelcomeMessage] = useState("Καλωσήρθατε στο Σύστημα");

  const handleSave = () => {
    alert("Οι ρυθμίσεις αποθηκεύτηκαν (mock)");
  };

  return (
    <AdminLayout onBack={() => window.location.href = '/admin'} onLogout={() => window.location.href = '/login'}>
      <div style={{ padding: 20 }}>
        <h2>Ρυθμίσεις Συστήματος</h2>

        <div style={{ backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10, marginBottom: 20 }}>
          <label>Τίτλος Εφαρμογής:</label>
          <input type="text" value={systemTitle} onChange={(e) => setSystemTitle(e.target.value)} style={{ width: '100%', marginBottom: 10 }} />

          <label>Μήνυμα Καλωσορίσματος:</label>
          <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} style={{ width: '100%', height: '100px' }} />

          <button onClick={handleSave} style={{ marginTop: 20, backgroundColor: 'green', color: '#fff', padding: '10px 20px', borderRadius: 5 }}>
            Αποθήκευση Ρυθμίσεων
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Settings;
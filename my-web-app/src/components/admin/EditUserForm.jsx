import React, { useState } from 'react';

function EditUserForm({ user, onSave, onCancel }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !role) {
      alert('Συμπλήρωσε όλα τα πεδία.');
      return;
    }
    onSave({ ...user, name, email, role });
  };

  const formStyle = {
    backgroundColor: '#f1f1f1',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px'
  };

  const buttonContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px'
  };

  const saveButtonStyle = {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer'
  };

  const cancelButtonStyle = {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer'
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Επεξεργασία Χρήστη</h3>

      <input 
        type="text" 
        placeholder="Όνομα" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        style={inputStyle} 
      />

      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        style={inputStyle} 
      />

      <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
        <option value="">Επιλογή Ρόλου</option>
        <option value="Admin">Admin</option>
        <option value="Χαλκιάς">Χαλκιάς</option>
        <option value="Area Manager">Area Manager</option>
        <option value="Coffee Specialist">Coffee Specialist</option>
        <option value="Ομάδα Κρούσης">Ομάδα Κρούσης</option>
      </select>

      <div style={buttonContainer}>
        <button type="submit" style={saveButtonStyle}>Αποθήκευση</button>
        <button type="button" style={cancelButtonStyle} onClick={onCancel}>Άκυρο</button>
      </div>
    </form>
  );
}

export default EditUserForm;
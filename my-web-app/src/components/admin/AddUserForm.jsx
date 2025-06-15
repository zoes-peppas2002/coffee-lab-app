import React, { useState } from 'react';

function AddUserForm({ onAddUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      alert('Συμπλήρωσε όλα τα πεδία.');
      return;
    }
    onAddUser({ name, email, password, role });
    setName('');
    setEmail('');
    setPassword('');
    setRole('');
  };

  const formStyle = {
    backgroundColor: '#f9f9f9',
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

  const buttonStyle = {
    padding: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    width: '100%',
    marginTop: '10px'
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Προσθήκη Νέου Χρήστη</h3>

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

      <input 
        type="password" 
        placeholder="Κωδικός" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
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

      <button type="submit" style={buttonStyle}>Προσθήκη</button>
    </form>
  );
}

export default AddUserForm;
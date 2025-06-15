import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';

const roles = ['admin', 'area_manager', 'coffee_specialist'];


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users", err);
      alert("Σφάλμα φόρτωσης χρηστών");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      alert("Συμπλήρωσε όλα τα πεδία!");
      return;
    }

    // Αν ο ρόλος είναι admin, ζητάμε επιβεβαίωση με κωδικό
    if (newUser.role === 'admin') {
      setShowAdminPasswordModal(true);
      return;
    }

    // Για άλλους ρόλους, προχωράμε κανονικά
    try {
      await api.post("/api/users", newUser);
      setNewUser({ name: '', email: '', password: '', role: '' });
      fetchUsers();
    } catch (err) {
      console.error("Error adding user", err);
      alert("Αποτυχία προσθήκης χρήστη");
    }
  };

  const confirmAdminUser = async () => {
    // Έλεγχος αν ο κωδικός είναι σωστός
    if (adminPassword !== 'Luckyone!') {
      alert('Λάθος κωδικός επιβεβαίωσης! Η προσθήκη admin απορρίφθηκε.');
      setShowAdminPasswordModal(false);
      setAdminPassword('');
      return;
    }

    try {
      await api.post("/api/users", newUser);
      setNewUser({ name: '', email: '', password: '', role: '' });
      fetchUsers();
      setShowAdminPasswordModal(false);
      setAdminPassword('');
    } catch (err) {
      console.error("Error adding admin user", err);
      alert("Αποτυχία προσθήκης admin");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Είσαι σίγουρος;")) return;
    try {
      await api.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/api/users/${editUser.id}`, editUser);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user", err);
    }
  };

  return (
    <AdminLayout onBack={() => window.location.href = '/admin'} onLogout={() => window.location.href = '/login'}>
      <div style={{ padding: 20 }}>
        {/* Modal για επιβεβαίωση προσθήκης admin */}
        {showAdminPasswordModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '80%',
              maxWidth: 400
            }}>
              <h3>Επιβεβαίωση Προσθήκης Admin</h3>
              <p>Για να προσθέσετε χρήστη με ρόλο admin, απαιτείται κωδικός επιβεβαίωσης:</p>
              <input 
                type="password" 
                placeholder="Κωδικός επιβεβαίωσης" 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                style={{ width: '100%', marginBottom: 10, padding: 8 }} 
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button 
                  onClick={() => {
                    setShowAdminPasswordModal(false);
                    setAdminPassword('');
                  }} 
                  style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: 5 }}
                >
                  Ακύρωση
                </button>
                <button 
                  onClick={confirmAdminUser} 
                  style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: 5 }}
                >
                  Επιβεβαίωση
                </button>
              </div>
            </div>
          </div>
        )}
        <h2>Διαχείριση Χρηστών</h2>

        {/* Προσθήκη νέου χρήστη */}
        <div style={{ backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10, marginBottom: 30 }}>
          <h3>Προσθήκη Νέου Χρήστη</h3>
          <input name="name" placeholder="Όνομα" value={newUser.name} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <input name="email" placeholder="Email" value={newUser.email} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <input name="password" placeholder="Κωδικός" value={newUser.password} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
          <select name="role" value={newUser.role} onChange={handleChange} style={{ width: '100%', marginBottom: 10 }}>
            <option value="">Επιλογή Ρόλου</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          <button onClick={handleAddUser} style={{ padding: '10px 20px', backgroundColor: 'green', color: '#fff' }}>Προσθήκη</button>
        </div>

        {/* Λίστα χρηστών */}
        {users.map(user => (
          <div key={user.id} style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <h3>{user.name}</h3>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Ρόλος:</b> {user.role}</p>
            <p><b>Κωδικός:</b> {user.password}</p>

            <button onClick={() => handleEditUser(user)} style={{ marginRight: 10, backgroundColor: '#007bff', color: '#fff', padding: '8px 16px', borderRadius: 5 }}>Επεξεργασία</button>
            <button onClick={() => handleDeleteUser(user.id)} style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '8px 16px', borderRadius: 5 }}>Διαγραφή</button>
          </div>
        ))}

        {/* Επεξεργασία */}
        {editUser && (
          <div style={{ backgroundColor: '#f0f0f0', padding: 20, borderRadius: 10 }}>
            <h3>Επεξεργασία Χρήστη</h3>
            <input name="name" value={editUser.name} onChange={handleEditChange} style={{ width: '100%', marginBottom: 10 }} />
            <input name="email" value={editUser.email} onChange={handleEditChange} style={{ width: '100%', marginBottom: 10 }} />
            <input name="password" value={editUser.password} onChange={handleEditChange} style={{ width: '100%', marginBottom: 10 }} />
            <select name="role" value={editUser.role} onChange={handleEditChange} style={{ width: '100%', marginBottom: 10 }}>
              <option value="">Επιλογή Ρόλου</option>
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <button onClick={handleSaveEdit} style={{ padding: '10px 20px', backgroundColor: 'green', color: '#fff' }}>Αποθήκευση</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;

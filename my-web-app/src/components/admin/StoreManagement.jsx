
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StoreManagement = () => {
  const navigate = useNavigate();

  const allowedRoles = ['area_manager', 'coffee_specialist'];
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [newStore, setNewStore] = useState({ name: '' });

  useEffect(() => {
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Failed to fetch users', err));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      axios.get(`/api/stores/assigned/${selectedUser}`)
        .then(res => setStores(res.data))
        .catch(err => console.error("Failed to fetch stores", err));
    } else {
      setStores([]);
    }
  }, [selectedUser]);

  const handleAddStore = async () => {
    if (!selectedUser || !newStore.name) {
      alert("Συμπληρώστε όλα τα πεδία!");
      return;
    }

    try {
      await axios.post("/api/stores", {
  name: newStore.name,
  assigned_to: selectedUser
}).then(res => {
  setStores([...stores, { id: res.data.id, name: newStore.name }]);
  setNewStore({ name: '' });
});

    } catch (err) {
      console.error("Error adding store:", err);
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      await axios.delete(`/api/stores/${id}`);
      setStores(stores.filter(s => s.id !== id));
    } catch (err) {
      console.error("Error deleting store:", err);
    }
  };

  const filteredUsers = users.filter(u => allowedRoles.includes(u.role));
  const roleFilteredUsers = filteredUsers.filter(user => user.role === selectedRole);

  return (
    <AdminLayout
      onBack={() => navigate('/admin')}
      onLogout={() => navigate('/login')}
    >
      <h2>Διαχείριση Καταστημάτων</h2>

      <div style={styles.selectorBox}>
        <label>Επιλογή Ρόλου:</label>
        <select style={styles.select} value={selectedRole} onChange={(e) => {
          setSelectedRole(e.target.value);
          setSelectedUser('');
        }}>
          <option value="">-- Επιλέξτε Ρόλο --</option>
          {allowedRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>

        {selectedRole && (
          <>
            <label>Επιλογή Υπευθύνου:</label>
            <select style={styles.select} value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">-- Επιλέξτε Υπεύθυνο --</option>
              {roleFilteredUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {selectedUser && (
        <>
          <div style={styles.form}>
            <h3>Προσθήκη Καταστήματος</h3>
            <input
              style={styles.input}
              type="text"
              placeholder="Όνομα Καταστήματος"
              value={newStore.name}
              onChange={(e) => setNewStore({ name: e.target.value })}
            />
            <button style={styles.addButton} onClick={handleAddStore}>Προσθήκη</button>
          </div>

          <div style={styles.list}>
            <h3>Καταστήματα Υπευθύνου</h3>
            {stores.map(store => (
              <div key={store.id} style={styles.card}>
                <h4>{store.name}</h4>
                <button style={styles.deleteButton} onClick={() => handleDeleteStore(store.id)}>
                  Διαγραφή
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

const styles = {
  selectorBox: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '8px',
    fontSize: '16px'
  },
  form: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '8px',
    fontSize: '16px'
  },
  addButton: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  list: {
    marginTop: '20px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginBottom: '15px'
  },
  deleteButton: {
    marginTop: '10px',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: '#fff',
    cursor: 'pointer'
  }
};

export default StoreManagement;

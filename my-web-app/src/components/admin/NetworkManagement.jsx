import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLayout.css'; // Προσθήκη του CSS για να διορθωθεί το πρόβλημα με το αριστερό μενού

const NetworkManagement = () => {
  const navigate = useNavigate();
  
  // State για τα καταστήματα και τους χρήστες
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  
  // State για το φιλτράρισμα
  const [filterRole, setFilterRole] = useState('');
  const [filterUser, setFilterUser] = useState('');
  
  // State για την επιλογή πολλαπλών καταστημάτων
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // State για το νέο κατάστημα
  const [newStore, setNewStore] = useState({
    name: '',
    area_manager: '',
    coffee_specialist: ''
  });
  
  // State για την επεξεργασία καταστήματος
  const [editingStore, setEditingStore] = useState(null);
  
  // Φόρτωση χρηστών κατά την αρχικοποίηση
  useEffect(() => {
    axios.get('/api/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => console.error('Failed to fetch users', err));
      
    // Φόρτωση καταστημάτων
    fetchStores();
  }, []);
  
  // Φόρτωση καταστημάτων
  const fetchStores = () => {
    axios.get('/api/network')
      .then(res => {
        setStores(res.data);
        setFilteredStores(res.data);
      })
      .catch(err => console.error('Failed to fetch stores', err));
  };
  
  // Φιλτράρισμα καταστημάτων με βάση το ρόλο και τον χρήστη
  // Αφαιρούμε το αυτόματο φιλτράρισμα και το κάνουμε μόνο με το κουμπί αναζήτησης
  useEffect(() => {
    // Αρχικά εμφανίζουμε όλα τα καταστήματα
    setFilteredStores(stores);
    // Καθαρίζουμε τις επιλογές όταν αλλάζουν τα καταστήματα
    setSelectedStores([]);
    setSelectAll(false);
  }, [stores]);
  
  // Ενημέρωση του selectAll όταν αλλάζουν τα επιλεγμένα καταστήματα
  useEffect(() => {
    if (filteredStores.length > 0 && selectedStores.length === filteredStores.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedStores, filteredStores]);
  
  // Προσθήκη νέου καταστήματος
  const handleAddStore = async () => {
    if (!newStore.name) {
      alert('Παρακαλώ συμπληρώστε το όνομα του καταστήματος');
      return;
    }
    
    // Αφαιρούμε τους ελέγχους για υποχρεωτική ύπαρξη area manager και coffee specialist
    // καθώς μπορεί να προκαλούν πρόβλημα
    
  try {
      const response = await axios.post('/api/network', newStore);
      console.log('Response from server:', response.data);
      
      // Ανανέωση της λίστας καταστημάτων
      const storesResponse = await axios.get('/api/network');
      const updatedStores = storesResponse.data;
      setStores(updatedStores);
      
      // Εφαρμογή των τρεχόντων φίλτρων στη νέα λίστα
      let filtered = [...updatedStores];
      if (filterRole) {
        filtered = filtered.filter(store => {
          if (filterRole === 'area_manager' && store.area_manager) return true;
          if (filterRole === 'coffee_specialist' && store.coffee_specialist) return true;
          return false;
        });
      }
      
      if (filterUser) {
        filtered = filtered.filter(store => {
          return (
            (store.area_manager && store.area_manager.toString() === filterUser) ||
            (store.coffee_specialist && store.coffee_specialist.toString() === filterUser)
          );
        });
      }
      
      setFilteredStores(filtered);
      
      // Καθαρισμός της φόρμας
      setNewStore({
        name: '',
        area_manager: '',
        coffee_specialist: ''
      });
      
      alert('Το κατάστημα προστέθηκε επιτυχώς!');
    } catch (err) {
      console.error('Error adding store:', err);
      alert('Σφάλμα κατά την προσθήκη του καταστήματος: ' + (err.response?.data?.error || err.message));
    }
  };
  
  // Επεξεργασία καταστήματος
  const handleEditStore = async () => {
    if (!editingStore || !editingStore.name) {
      alert('Παρακαλώ συμπληρώστε το όνομα του καταστήματος');
      return;
    }
    
    // Αφαιρούμε τους ελέγχους για υποχρεωτική ύπαρξη area manager και coffee specialist
    // καθώς μπορεί να προκαλούν πρόβλημα
    
  try {
      const response = await axios.put(`/api/network/${editingStore.id}`, editingStore);
      console.log('Response from server:', response.data);
      
      // Ανανέωση της λίστας καταστημάτων
      const storesResponse = await axios.get('/api/network');
      const updatedStores = storesResponse.data;
      setStores(updatedStores);
      
      // Εφαρμογή των τρεχόντων φίλτρων στη νέα λίστα
      let filtered = [...updatedStores];
      if (filterRole) {
        filtered = filtered.filter(store => {
          if (filterRole === 'area_manager' && store.area_manager) return true;
          if (filterRole === 'coffee_specialist' && store.coffee_specialist) return true;
          return false;
        });
      }
      
      if (filterUser) {
        filtered = filtered.filter(store => {
          return (
            (store.area_manager && store.area_manager.toString() === filterUser) ||
            (store.coffee_specialist && store.coffee_specialist.toString() === filterUser)
          );
        });
      }
      
      setFilteredStores(filtered);
      setEditingStore(null);
      
      alert('Το κατάστημα ενημερώθηκε επιτυχώς!');
    } catch (err) {
      console.error('Error updating store:', err);
      alert('Σφάλμα κατά την ενημέρωση του καταστήματος: ' + (err.response?.data?.error || err.message));
    }
  };
  
  // Διαγραφή καταστήματος
  const handleDeleteStore = async (id) => {
    if (!window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το κατάστημα;')) {
      return;
    }
    
    try {
      await axios.delete(`/api/network/${id}`);
      
      // Ανανέωση της λίστας καταστημάτων
      const storesResponse = await axios.get('/api/network');
      const updatedStores = storesResponse.data;
      setStores(updatedStores);
      
      // Εφαρμογή των τρεχόντων φίλτρων στη νέα λίστα
      let filtered = [...updatedStores];
      if (filterRole) {
        filtered = filtered.filter(store => {
          if (filterRole === 'area_manager' && store.area_manager) return true;
          if (filterRole === 'coffee_specialist' && store.coffee_specialist) return true;
          return false;
        });
      }
      
      if (filterUser) {
        filtered = filtered.filter(store => {
          return (
            (store.area_manager && store.area_manager.toString() === filterUser) ||
            (store.coffee_specialist && store.coffee_specialist.toString() === filterUser)
          );
        });
      }
      
      setFilteredStores(filtered);
      
      alert('Το κατάστημα διαγράφηκε επιτυχώς!');
    } catch (err) {
      console.error('Error deleting store:', err);
      alert('Σφάλμα κατά τη διαγραφή του καταστήματος: ' + (err.response?.data?.error || err.message));
    }
  };
  
  // Διαγραφή πολλαπλών καταστημάτων
  const handleDeleteMultipleStores = async () => {
    if (selectedStores.length === 0) {
      alert('Παρακαλώ επιλέξτε τουλάχιστον ένα κατάστημα για διαγραφή');
      return;
    }
    
    if (!window.confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε ${selectedStores.length} καταστήματα;`)) {
      return;
    }
    
    try {
      // Διαγραφή κάθε επιλεγμένου καταστήματος
      for (const storeId of selectedStores) {
        await axios.delete(`/api/network/${storeId}`);
      }
      
      // Ανανέωση της λίστας καταστημάτων
      const storesResponse = await axios.get('/api/network');
      const updatedStores = storesResponse.data;
      setStores(updatedStores);
      
      // Εφαρμογή των τρεχόντων φίλτρων στη νέα λίστα
      let filtered = [...updatedStores];
      if (filterRole) {
        filtered = filtered.filter(store => {
          if (filterRole === 'area_manager' && store.area_manager) return true;
          if (filterRole === 'coffee_specialist' && store.coffee_specialist) return true;
          return false;
        });
      }
      
      if (filterUser) {
        filtered = filtered.filter(store => {
          return (
            (store.area_manager && store.area_manager.toString() === filterUser) ||
            (store.coffee_specialist && store.coffee_specialist.toString() === filterUser)
          );
        });
      }
      
      setFilteredStores(filtered);
      setSelectedStores([]);
      
      alert('Τα επιλεγμένα καταστήματα διαγράφηκαν επιτυχώς!');
    } catch (err) {
      console.error('Error deleting multiple stores:', err);
      alert('Σφάλμα κατά τη διαγραφή των καταστημάτων: ' + (err.response?.data?.error || err.message));
    }
  };
  
  // Χειρισμός επιλογής/αποεπιλογής όλων των καταστημάτων
  const handleSelectAll = () => {
    if (selectAll) {
      // Αποεπιλογή όλων
      setSelectedStores([]);
    } else {
      // Επιλογή όλων
      const allStoreIds = filteredStores.map(store => store.id);
      setSelectedStores(allStoreIds);
    }
    setSelectAll(!selectAll);
  };
  
  // Χειρισμός επιλογής/αποεπιλογής ενός καταστήματος
  const handleSelectStore = (storeId) => {
    if (selectedStores.includes(storeId)) {
      // Αφαίρεση από τις επιλογές
      setSelectedStores(selectedStores.filter(id => id !== storeId));
    } else {
      // Προσθήκη στις επιλογές
      setSelectedStores([...selectedStores, storeId]);
    }
  };
  
  // Εμφάνιση όλων των καταστημάτων (καθαρισμός φίλτρων)
  const handleShowAllStores = () => {
    setFilterRole('');
    setFilterUser('');
    setFilteredStores(stores);
  };
  
  // Φιλτράρισμα χρηστών με βάση το ρόλο
  const getUsersByRole = (role) => {
    return users.filter(user => user.role === role);
  };
  
  // Εύρεση ονόματος χρήστη με βάση το ID
  const getUserNameById = (id) => {
    if (!id) return '-';
    const user = users.find(u => u.id.toString() === id.toString());
    return user ? user.name : '-';
  };
  
  return (
    <AdminLayout
      onBack={() => navigate('/admin')}
      onLogout={() => navigate('/login')}
    >
      <h2>Διαχείριση Λίστας Δικτύου</h2>
      
      {/* Φίλτρα */}
      <div style={styles.filterContainer}>
        <h3>Φίλτρα</h3>
        <div style={styles.filterRow}>
          <div style={styles.filterItem}>
            <label>Ρόλος:</label>
            <select 
              style={styles.select}
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setFilterUser('');
              }}
            >
              <option value="">Όλοι οι ρόλοι</option>
              <option value="area_manager">Area Manager</option>
              <option value="coffee_specialist">Coffee Specialist</option>
            </select>
          </div>
          
          {filterRole && (
            <div style={styles.filterItem}>
              <label>Χρήστης:</label>
              <select 
                style={styles.select}
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
              >
                <option value="">Όλοι οι χρήστες</option>
                {getUsersByRole(filterRole).map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <div style={styles.filterItem}>
            <button 
              style={styles.searchButton} 
              onClick={() => {
                // Εφαρμογή των φίλτρων
                let filtered = [...stores];
                
                if (filterRole) {
                  filtered = filtered.filter(store => {
                    if (filterRole === 'area_manager' && store.area_manager) return true;
                    if (filterRole === 'coffee_specialist' && store.coffee_specialist) return true;
                    return false;
                  });
                }
                
                if (filterUser) {
                  filtered = filtered.filter(store => {
                    return (
                      (store.area_manager && store.area_manager.toString() === filterUser) ||
                      (store.coffee_specialist && store.coffee_specialist.toString() === filterUser)
                    );
                  });
                }
                
                setFilteredStores(filtered);
                setSelectedStores([]);
              }}
            >
              Αναζήτηση
            </button>
          </div>
          
          <div style={styles.filterItem}>
            <button 
              style={styles.showAllButton} 
              onClick={handleShowAllStores}
            >
              ΔΕΙΞΕ ΜΟΥ ΤΗΝ ΛΙΣΤΑ
            </button>
          </div>
        </div>
      </div>
      
      {/* Φόρμα προσθήκης νέου καταστήματος */}
      <div style={styles.formContainer}>
        <h3>Προσθήκη Νέου Καταστήματος</h3>
        <div style={styles.formRow}>
          <div style={styles.formItem}>
            <label>Όνομα Καταστήματος:</label>
            <input
              type="text"
              style={styles.input}
              value={newStore.name}
              onChange={(e) => setNewStore({...newStore, name: e.target.value})}
              placeholder="Όνομα καταστήματος"
            />
          </div>
        </div>
        
        <div style={styles.formRow}>
          <div style={styles.formItem}>
            <label>Area Manager:</label>
            <select
              style={styles.select}
              value={newStore.area_manager}
              onChange={(e) => setNewStore({...newStore, area_manager: e.target.value})}
            >
              <option value="">-- Επιλέξτε Area Manager --</option>
              {getUsersByRole('area_manager').map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formItem}>
            <label>Coffee Specialist:</label>
            <select
              style={styles.select}
              value={newStore.coffee_specialist}
              onChange={(e) => setNewStore({...newStore, coffee_specialist: e.target.value})}
            >
              <option value="">-- Επιλέξτε Coffee Specialist --</option>
              {getUsersByRole('coffee_specialist').map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          
        </div>
        
        <button style={styles.addButton} onClick={handleAddStore}>
          Προσθήκη Καταστήματος
        </button>
      </div>
      
      {/* Λίστα καταστημάτων */}
      <div style={styles.storeList}>
        <h3>Λίστα Καταστημάτων</h3>
        
        {/* Κουμπιά μαζικών ενεργειών */}
        {filteredStores.length > 0 && (
          <div style={styles.bulkActionsContainer}>
            <div style={styles.selectedCount}>
              {selectedStores.length > 0 ? 
                `${selectedStores.length} καταστήματα επιλεγμένα` : 
                'Επιλέξτε καταστήματα για μαζικές ενέργειες'}
            </div>
            <button 
              style={{
                ...styles.bulkActionButton,
                ...styles.bulkDeleteButton,
                opacity: selectedStores.length === 0 ? 0.5 : 1
              }} 
              onClick={handleDeleteMultipleStores}
              disabled={selectedStores.length === 0}
            >
              Διαγραφή Επιλεγμένων
            </button>
          </div>
        )}
        
        {filteredStores.length === 0 ? (
          <p>Δεν βρέθηκαν καταστήματα.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.checkboxTh}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    style={styles.checkbox}
                  />
                </th>
                <th style={styles.th}>Όνομα Καταστήματος</th>
                <th style={styles.th}>Area Manager</th>
                <th style={styles.th}>Coffee Specialist</th>
                <th style={styles.th}>Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map(store => (
                <tr key={store.id}>
                  <td style={styles.checkboxTd}>
                    <input
                      type="checkbox"
                      checked={selectedStores.includes(store.id)}
                      onChange={() => handleSelectStore(store.id)}
                      style={styles.checkbox}
                    />
                  </td>
                  <td style={styles.td}>
                    {editingStore && editingStore.id === store.id ? (
                      <input
                        type="text"
                        style={styles.editInput}
                        value={editingStore.name}
                        onChange={(e) => setEditingStore({...editingStore, name: e.target.value})}
                      />
                    ) : (
                      store.name
                    )}
                  </td>
                  <td style={styles.td}>
                    {editingStore && editingStore.id === store.id ? (
                      <select
                        style={styles.editSelect}
                        value={editingStore.area_manager || ''}
                        onChange={(e) => setEditingStore({...editingStore, area_manager: e.target.value})}
                      >
                        <option value="">-- Κανένας --</option>
                        {getUsersByRole('area_manager').map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </select>
                    ) : (
                      getUserNameById(store.area_manager)
                    )}
                  </td>
                  <td style={styles.td}>
                    {editingStore && editingStore.id === store.id ? (
                      <select
                        style={styles.editSelect}
                        value={editingStore.coffee_specialist || ''}
                        onChange={(e) => setEditingStore({...editingStore, coffee_specialist: e.target.value})}
                      >
                        <option value="">-- Κανένας --</option>
                        {getUsersByRole('coffee_specialist').map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </select>
                    ) : (
                      getUserNameById(store.coffee_specialist)
                    )}
                  </td>
                  <td style={styles.td}>
                    {editingStore && editingStore.id === store.id ? (
                      <div style={styles.actionButtons}>
                        <button 
                          style={{...styles.actionButton, ...styles.saveButton}} 
                          onClick={handleEditStore}
                        >
                          Αποθήκευση
                        </button>
                        <button 
                          style={{...styles.actionButton, ...styles.cancelButton}} 
                          onClick={() => setEditingStore(null)}
                        >
                          Ακύρωση
                        </button>
                      </div>
                    ) : (
                      <div style={styles.actionButtons}>
                        <button 
                          style={{...styles.actionButton, ...styles.editButton}} 
                          onClick={() => setEditingStore({...store})}
                        >
                          Επεξεργασία
                        </button>
                        <button 
                          style={{...styles.actionButton, ...styles.deleteButton}} 
                          onClick={() => handleDeleteStore(store.id)}
                        >
                          Διαγραφή
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

const styles = {
  filterContainer: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px'
  },
  filterItem: {
    flex: '1',
    minWidth: '200px'
  },
  searchButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '24px',
    width: '100%'
  },
  showAllButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '24px',
    width: '100%'
  },
  formContainer: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  formRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '15px'
  },
  formItem: {
    flex: '1',
    minWidth: '200px'
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginTop: '5px'
  },
  select: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginTop: '5px'
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  storeList: {
    marginTop: '30px'
  },
  bulkActionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '5px'
  },
  selectedCount: {
    fontWeight: 'bold',
    color: '#495057'
  },
  bulkActionButton: {
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '10px'
  },
  bulkDeleteButton: {
    backgroundColor: '#dc3545',
    color: 'white'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  checkboxTh: {
    width: '40px',
    backgroundColor: '#f2f2f2',
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ddd'
  },
  checkboxTd: {
    width: '40px',
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ddd'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    textAlign: 'left',
    border: '1px solid #ddd'
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd'
  },
  editInput: {
    width: '100%',
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  editSelect: {
    width: '100%',
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  actionButtons: {
    display: 'flex',
    gap: '5px'
  },
  actionButton: {
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  editButton: {
    backgroundColor: '#007bff',
    color: 'white'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white'
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: 'white'
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white'
  }
};

export default NetworkManagement;

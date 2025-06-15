import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './AdminLayout.css'; // Προσθήκη του CSS για να διορθωθεί το πρόβλημα με το αριστερό μενού

const AdminViewChecklists = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(['area_manager', 'coffee_specialist']);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State για την επιλογή πολλαπλών checklists
  const [selectedChecklists, setSelectedChecklists] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Role display names
  const roleNames = {
    'area_manager': 'Area Manager',
    'coffee_specialist': 'Coffee Specialist'
  };

  useEffect(() => {
    // Fetch users when role changes
    if (selectedRole) {
      fetchUsersByRole(selectedRole);
    }
  }, [selectedRole]);
  
  // Ενημέρωση του selectAll όταν αλλάζουν τα επιλεγμένα checklists
  useEffect(() => {
    if (checklists.length > 0 && selectedChecklists.length === checklists.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedChecklists, checklists]);

  const fetchUsersByRole = async (role) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/users/by-role/${role}`);
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Σφάλμα κατά τη φόρτωση χρηστών');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedRole || !selectedUser || !selectedStartDate || !selectedEndDate) {
      setError('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedChecklists([]); // Καθαρισμός των επιλεγμένων checklists

    try {
      // Get all checklists for the selected user
      const res = await api.get(`/api/checklists/my/${selectedUser}`);
      
      // Filter by date range
      const filteredChecklists = res.data.filter(checklist => {
        const checklistDate = new Date(checklist.submit_date);
        const startDate = new Date(selectedStartDate);
        const endDate = new Date(selectedEndDate);
        endDate.setHours(23, 59, 59); // Set to end of day
        
        return checklistDate >= startDate && checklistDate <= endDate;
      });
      
      if (filteredChecklists.length === 0) {
        setError('Δεν βρέθηκαν checklists για τα επιλεγμένα κριτήρια');
      }
      
      setChecklists(filteredChecklists);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching checklists:', err);
      setError(`Σφάλμα κατά την αναζήτηση: ${err.message}`);
      setLoading(false);
    }
  };
  
  // Εμφάνιση όλων των checklists για τον επιλεγμένο χρήστη
  const handleShowAllChecklists = async () => {
    if (!selectedUser) {
      setError('Παρακαλώ επιλέξτε χρήστη');
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedChecklists([]); // Καθαρισμός των επιλεγμένων checklists

    try {
      // Get all checklists for the selected user without date filtering
      const res = await api.get(`/api/checklists/my/${selectedUser}`);
      
      if (res.data.length === 0) {
        setError('Δεν βρέθηκαν checklists για τον επιλεγμένο χρήστη');
      }
      
      setChecklists(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching all checklists:', err);
      setError(`Σφάλμα κατά την αναζήτηση: ${err.message}`);
      setLoading(false);
    }
  };
  
  // Χειρισμός επιλογής/αποεπιλογής όλων των checklists
  const handleSelectAll = () => {
    if (selectAll) {
      // Αποεπιλογή όλων
      setSelectedChecklists([]);
    } else {
      // Επιλογή όλων
      const allChecklistIds = checklists.map(checklist => checklist.id);
      setSelectedChecklists(allChecklistIds);
    }
    setSelectAll(!selectAll);
  };
  
  // Χειρισμός επιλογής/αποεπιλογής ενός checklist
  const handleSelectChecklist = (checklistId) => {
    if (selectedChecklists.includes(checklistId)) {
      // Αφαίρεση από τις επιλογές
      setSelectedChecklists(selectedChecklists.filter(id => id !== checklistId));
    } else {
      // Προσθήκη στις επιλογές
      setSelectedChecklists([...selectedChecklists, checklistId]);
    }
  };
  
  // Άνοιγμα πολλαπλών PDFs σε νέες καρτέλες
  const handleViewMultiplePdfs = () => {
    if (selectedChecklists.length === 0) {
      alert('Παρακαλώ επιλέξτε τουλάχιστον ένα checklist');
      return;
    }
    
    // Βρίσκουμε τα επιλεγμένα checklists
    const selectedChecklistsData = checklists.filter(checklist => 
      selectedChecklists.includes(checklist.id)
    );
    
    // Ανοίγουμε κάθε PDF σε νέα καρτέλα
    selectedChecklistsData.forEach(checklist => {
      if (checklist.pdf_url) {
        const filename = checklist.pdf_url.split('/').pop();
        const backendUrl = window.location.hostname === 'localhost' 
          ? `http://localhost:5000` 
          : `http://${window.location.hostname}:5000`;
        const directUrl = `${backendUrl}/static/pdfs/${filename}`;
        
        window.open(directUrl, '_blank');
      }
    });
  };
  
  // Διαγραφή επιλεγμένων checklists
  const handleDeleteSelectedChecklists = async () => {
    if (selectedChecklists.length === 0) {
      alert('Παρακαλώ επιλέξτε τουλάχιστον ένα checklist');
      return;
    }
    
    if (!window.confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε ${selectedChecklists.length} checklists;`)) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Διαγραφή κάθε επιλεγμένου checklist
      for (const checklistId of selectedChecklists) {
        await api.delete(`/api/checklists/${checklistId}`);
      }
      
      // Ανανέωση της λίστας
      handleSearch();
      
      // Καθαρισμός των επιλογών
      setSelectedChecklists([]);
      
      alert('Τα επιλεγμένα checklists διαγράφηκαν επιτυχώς!');
    } catch (err) {
      console.error('Error deleting checklists:', err);
      setError(`Σφάλμα κατά τη διαγραφή: ${err.message}`);
      setLoading(false);
    }
  };

  const handleViewPdf = (pdfUrl) => {
    if (!pdfUrl) {
      console.error('PDF URL is undefined or empty');
      setError('Σφάλμα: Δεν βρέθηκε το URL του PDF');
      return;
    }
    
    console.log('Opening PDF with URL:', pdfUrl);
    
    // Extract just the filename from the path
    const filename = pdfUrl.split('/').pop();
    
    // Create a direct URL to the PDF file using the filename only
    // This avoids issues with URL encoding of Greek characters
    // Use the current window location to determine the backend URL
    // This works on both desktop and mobile devices
    const backendUrl = window.location.hostname === 'localhost' 
      ? `http://localhost:5000` 
      : `http://${window.location.hostname}:5000`;
    const directUrl = `${backendUrl}/static/pdfs/${filename}`;
    
    console.log('Direct PDF URL:', directUrl);
    
    // Open the PDF in a new tab
    window.open(directUrl, '_blank');
  };

  return (
    <AdminLayout onBack={() => navigate('/admin')} onLogout={() => navigate('/login')}>
      <div style={styles.container}>
        <h2 style={styles.title}>Προβολή Checklists</h2>

        <div style={styles.filterSection}>
          <div style={styles.filterItem}>
            <label style={styles.label}>Επιλογή Ομάδας:</label>
            <select 
              value={selectedRole} 
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setSelectedUser('');
              }}
              style={styles.select}
            >
              <option value="">-- Επιλέξτε Ομάδα --</option>
              {roles.map(role => (
                <option key={role} value={role}>{roleNames[role] || role}</option>
              ))}
            </select>
          </div>

          {selectedRole && (
            <div style={styles.filterItem}>
              <label style={styles.label}>Επιλογή Χρήστη:</label>
              <select 
                value={selectedUser} 
                onChange={(e) => setSelectedUser(e.target.value)}
                style={styles.select}
                disabled={loading || users.length === 0}
              >
                <option value="">-- Επιλέξτε Χρήστη --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          )}

          {selectedUser && (
            <>
              <div style={styles.filterItem}>
                <label style={styles.label}>Από Ημερομηνία:</label>
                <input 
                  type="date" 
                  value={selectedStartDate} 
                  onChange={(e) => setSelectedStartDate(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.filterItem}>
                <label style={styles.label}>Έως Ημερομηνία:</label>
                <input 
                  type="date" 
                  value={selectedEndDate} 
                  onChange={(e) => setSelectedEndDate(e.target.value)}
                  style={styles.input}
                />
              </div>
            </>
          )}

          <div style={styles.buttonContainer}>
            <button 
              onClick={handleSearch} 
              style={styles.searchButton}
              disabled={loading || !selectedRole || !selectedUser || !selectedStartDate || !selectedEndDate}
            >
              {loading ? 'Αναζήτηση...' : 'Αναζήτηση'}
            </button>
            
            {selectedUser && (
              <button 
                onClick={handleShowAllChecklists} 
                style={styles.showAllButton}
                disabled={loading || !selectedUser}
              >
                ΔΕΙΞΕ ΜΟΥ ΤΗΝ ΛΙΣΤΑ
              </button>
            )}
          </div>

          {error && <div style={styles.error}>{error}</div>}
        </div>

        <div style={styles.resultsSection}>
          <h3>Αποτελέσματα</h3>
          
          {/* Κουμπιά μαζικών ενεργειών */}
          {checklists.length > 0 && (
            <div style={styles.bulkActionsContainer}>
              <div style={styles.selectedCount}>
                {selectedChecklists.length > 0 ? 
                  `${selectedChecklists.length} checklists επιλεγμένα` : 
                  'Επιλέξτε checklists για μαζικές ενέργειες'}
              </div>
              <div>
                <button 
                  style={{
                    ...styles.bulkActionButton,
                    ...styles.bulkViewButton,
                    opacity: selectedChecklists.length === 0 ? 0.5 : 1
                  }} 
                  onClick={handleViewMultiplePdfs}
                  disabled={selectedChecklists.length === 0}
                >
                  Προβολή Επιλεγμένων PDFs
                </button>
                <button 
                  style={{
                    ...styles.bulkActionButton,
                    ...styles.bulkDeleteButton,
                    opacity: selectedChecklists.length === 0 ? 0.5 : 1
                  }} 
                  onClick={handleDeleteSelectedChecklists}
                  disabled={selectedChecklists.length === 0}
                >
                  Διαγραφή Επιλεγμένων
                </button>
                <label style={styles.selectAllLabel}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    style={styles.checkbox}
                  />
                  Επιλογή Όλων
                </label>
              </div>
            </div>
          )}
          
          {checklists.length === 0 ? (
            <div style={styles.noResults}>
              {loading ? 'Φόρτωση...' : 'Δεν βρέθηκαν checklists για τα επιλεγμένα κριτήρια'}
            </div>
          ) : (
            <div style={styles.checklistsGrid}>
              {checklists.map(checklist => {
                // Parse the checklist data
                const data = typeof checklist.checklist_data === 'string' 
                  ? JSON.parse(checklist.checklist_data) 
                  : checklist.checklist_data;
                
                // Format the date
                const submitDate = new Date(checklist.submit_date);
                const formattedDate = submitDate.toLocaleDateString('el-GR');
                const formattedTime = submitDate.toLocaleTimeString('el-GR');
                
                return (
                  <div key={checklist.id} style={styles.checklistCard}>
                    <div style={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        checked={selectedChecklists.includes(checklist.id)}
                        onChange={() => handleSelectChecklist(checklist.id)}
                        style={styles.cardCheckbox}
                      />
                    </div>
                    <div style={styles.cardHeader}>
                      <h4 style={styles.cardTitle}>
                        {data.store_name || 'Κατάστημα'}
                      </h4>
                      <div style={styles.cardDate}>
                        {formattedDate} {formattedTime}
                      </div>
                    </div>
                    
                    <div style={styles.cardBody}>
                      <div style={styles.userInfo}>
                        <strong>Χρήστης:</strong> {data.user_name}
                      </div>
                      
                      <div style={styles.scoreSection}>
                        <div style={styles.scoreLabel}>Σκορ:</div>
                        <div style={{
                          ...styles.scoreValue,
                          color: checklist.has_zero_cutoff ? '#dc3545' : 
                                 checklist.total_score >= 75 ? '#28a745' : 
                                 checklist.total_score >= 50 ? '#ffc107' : '#dc3545'
                        }}>
                          {checklist.has_zero_cutoff ? 'ΜΗΔΕΝ (CUTOFF)' : `${parseFloat(checklist.total_score).toFixed(2)}%`}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleViewPdf(checklist.pdf_url)} 
                        style={styles.viewButton}
                      >
                        Προβολή PDF
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  container: {
    padding: '20px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    boxSizing: 'border-box',
    overflowX: 'hidden'
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    marginRight: '5px'
  },
  cardCheckbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  checkboxContainer: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1
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
  bulkViewButton: {
    backgroundColor: '#28a745',
    color: 'white'
  },
  bulkDeleteButton: {
    backgroundColor: '#dc3545',
    color: 'white'
  },
  selectAllLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: '15px',
    fontWeight: 'bold',
    color: '#495057',
    cursor: 'pointer'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#343a40'
  },
  filterSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  filterItem: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#495057'
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ced4da',
    fontSize: '16px'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ced4da',
    fontSize: '16px'
  },
  searchButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: '1'
  },
  showAllButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: '1'
  },
  error: {
    color: '#dc3545',
    marginTop: '10px',
    fontWeight: 'bold'
  },
  resultsSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  noResults: {
    padding: '20px',
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic'
  },
  checklistsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  checklistCard: {
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative'
  },
  cardHeader: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    margin: '0',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  cardDate: {
    fontSize: '14px'
  },
  cardBody: {
    padding: '15px'
  },
  userInfo: {
    marginBottom: '10px',
    fontSize: '14px'
  },
  scoreSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  scoreLabel: {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  scoreValue: {
    fontWeight: 'bold',
    fontSize: '18px'
  },
  viewButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '5px',
    width: '100%',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default AdminViewChecklists;

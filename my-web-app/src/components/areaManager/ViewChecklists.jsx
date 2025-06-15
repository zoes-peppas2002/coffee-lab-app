import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewChecklists = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State για την επιλογή πολλαπλών checklists
  const [selectedChecklists, setSelectedChecklists] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  // Generate months for the current year
  const currentYear = new Date().getFullYear();
  const months = [
    { value: '01', label: 'Ιανουάριος' },
    { value: '02', label: 'Φεβρουάριος' },
    { value: '03', label: 'Μάρτιος' },
    { value: '04', label: 'Απρίλιος' },
    { value: '05', label: 'Μάιος' },
    { value: '06', label: 'Ιούνιος' },
    { value: '07', label: 'Ιούλιος' },
    { value: '08', label: 'Αύγουστος' },
    { value: '09', label: 'Σεπτέμβριος' },
    { value: '10', label: 'Οκτώβριος' },
    { value: '11', label: 'Νοέμβριος' },
    { value: '12', label: 'Δεκέμβριος' }
  ];

  useEffect(() => {
    // Fetch stores assigned to the user
    const fetchStores = async () => {
      try {
        const res = await axios.get(`/api/stores/by-user/${userId}`);
        setStores(res.data);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('Σφάλμα κατά τη φόρτωση καταστημάτων');
      }
    };

    fetchStores();
  }, [userId]);
  
  // Ενημέρωση του selectAll όταν αλλάζουν τα επιλεγμένα checklists
  useEffect(() => {
    if (checklists.length > 0 && selectedChecklists.length === checklists.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedChecklists, checklists]);

  const handleSearch = async () => {
    if (!selectedStore || !selectedMonth) {
      setError('Παρακαλώ επιλέξτε κατάστημα και μήνα');
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedChecklists([]); // Καθαρισμός των επιλεγμένων checklists

    try {
      // Format the date range for the selected month
      const startDate = `${currentYear}-${selectedMonth}-01`;
      
      // Get the last day of the month (accounting for different month lengths)
      const lastDay = new Date(currentYear, parseInt(selectedMonth), 0).getDate();
      const endDate = `${currentYear}-${selectedMonth}-${lastDay}`;
      
      console.log(`Searching for checklists between ${startDate} and ${endDate} for store ${selectedStore}`);

      // First try to get all checklists for debugging
      const allChecklistsRes = await axios.get(`/api/checklists/my/${userId}`);
      console.log('All checklists for user:', allChecklistsRes.data);
      
      // Then try the filtered search
      const res = await axios.get(`/api/checklists/filter`, {
        params: {
          store_id: selectedStore,
          start_date: startDate,
          end_date: endDate
          // Removed user_id filter to show all checklists for the store
        }
      });

      console.log('Filtered checklists:', res.data);
      
      if (res.data.length === 0) {
        setError('Δεν βρέθηκαν checklists για τα επιλεγμένα κριτήρια');
      }
      
      setChecklists(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching checklists:', err);
      setError(`Σφάλμα κατά την αναζήτηση: ${err.message}`);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
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
  
  // Εμφάνιση όλων των checklists (καθαρισμός φίλτρων)
  const handleShowAllChecklists = async () => {
    setLoading(true);
    setError(null);
    setSelectedChecklists([]);
    
    try {
      // Φέρνουμε όλα τα checklists του χρήστη
      const res = await axios.get(`/api/checklists/my/${userId}`);
      setChecklists(res.data);
      setSelectedStore('');
      setSelectedMonth('');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching all checklists:', err);
      setError(`Σφάλμα κατά την αναζήτηση: ${err.message}`);
      setLoading(false);
    }
  };

  const handleViewPdf = (pdfUrl) => {
    // Check if the URL is undefined or empty
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
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/area-manager')}>⟵ Πίσω</button>
        <div style={styles.title}>Προβολή Checklist</div>
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={styles.filterSection}>
          <h3>Φίλτρα Αναζήτησης</h3>
          
          <div style={styles.filterItem}>
            <label style={styles.label}>Επιλογή Καταστήματος:</label>
            <select 
              value={selectedStore} 
              onChange={(e) => setSelectedStore(e.target.value)}
              style={styles.select}
            >
              <option value="">-- Επιλέξτε Κατάστημα --</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterItem}>
            <label style={styles.label}>Επιλογή Μήνα:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={styles.select}
            >
              <option value="">-- Επιλέξτε Μήνα --</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button 
              onClick={handleSearch} 
              style={styles.searchButton}
              disabled={loading}
            >
              {loading ? 'Αναζήτηση...' : 'Αναζήτηση'}
            </button>
            
            <button 
              onClick={handleShowAllChecklists} 
              style={styles.showAllButton}
              disabled={loading}
            >
              ΔΕΙΞΕ ΜΟΥ ΤΗΝ ΛΙΣΤΑ
            </button>
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
              <div style={styles.bulkActions}>
                <button 
                  style={{
                    ...styles.bulkViewButton,
                    opacity: selectedChecklists.length === 0 ? 0.5 : 1
                  }}
                  onClick={handleViewMultiplePdfs}
                  disabled={selectedChecklists.length === 0}
                >
                  Προβολή Επιλεγμένων PDFs
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
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Poppins, sans-serif',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0',
    boxSizing: 'border-box',
    overflowX: 'hidden'
  },
  header: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr',
    alignItems: 'center',
    backgroundColor: '#222c36',
    color: '#ffffff',
    padding: '15px 20px',
    marginBottom: '20px'
  },
  backButton: {
    padding: '10px 20px',
    fontSize: '15px',
    borderRadius: '8px',
    backgroundColor: '#fff8dc',
    border: 'none',
    cursor: 'pointer',
    marginRight: '15px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '18px',
    borderRadius: '8px',
    backgroundColor: '#E74C3C',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    justifySelf: 'end'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  filterSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
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
    marginTop: '10px',
    flex: 1
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
    marginTop: '10px',
    flex: 1
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
  bulkActionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '5px',
    flexWrap: 'wrap'
  },
  selectedCount: {
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: '5px'
  },
  bulkActions: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },
  bulkViewButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  selectAllLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: '10px',
    fontWeight: 'bold',
    color: '#495057',
    cursor: 'pointer'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    marginRight: '5px'
  },
  checklistCard: {
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative'
  },
  checkboxContainer: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1
  },
  cardCheckbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
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

export default ViewChecklists;

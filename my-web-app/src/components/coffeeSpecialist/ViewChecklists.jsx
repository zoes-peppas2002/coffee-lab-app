import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewChecklists.css';

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
    <div className="container">
      <div className="header">
        <button className="back-button" onClick={() => navigate('/coffee-specialist')}>⟵ Πίσω</button>
        <div className="title">Προβολή Checklist</div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="content">
        <div className="filter-section">
          <h3>Φίλτρα Αναζήτησης</h3>
          
          <div className="filter-item">
            <label className="label">Επιλογή Καταστήματος:</label>
            <select 
              value={selectedStore} 
              onChange={(e) => setSelectedStore(e.target.value)}
              className="select"
            >
              <option value="">-- Επιλέξτε Κατάστημα --</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label className="label">Επιλογή Μήνα:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="select"
            >
              <option value="">-- Επιλέξτε Μήνα --</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          <div className="button-group">
            <button 
              onClick={handleSearch} 
              className="search-button"
              disabled={loading}
            >
              {loading ? 'Αναζήτηση...' : 'Αναζήτηση'}
            </button>
            
            <button 
              onClick={handleShowAllChecklists} 
              className="show-all-button"
              disabled={loading}
            >
              ΔΕΙΞΕ ΜΟΥ ΤΗΝ ΛΙΣΤΑ
            </button>
          </div>

          {error && <div className="error">{error}</div>}
        </div>

        <div className="results-section">
          <h3>Αποτελέσματα</h3>
          
          {/* Κουμπιά μαζικών ενεργειών */}
          {checklists.length > 0 && (
            <div className="bulk-actions-container">
              <div className="selected-count">
                {selectedChecklists.length > 0 ? 
                  `${selectedChecklists.length} checklists επιλεγμένα` : 
                  'Επιλέξτε checklists για μαζικές ενέργειες'}
              </div>
              <div className="bulk-actions">
                <button 
                  className={`bulk-view-button ${selectedChecklists.length === 0 ? 'disabled' : ''}`}
                  onClick={handleViewMultiplePdfs}
                  disabled={selectedChecklists.length === 0}
                >
                  Προβολή Επιλεγμένων PDFs
                </button>
                <label className="select-all-label">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="checkbox"
                  />
                  Επιλογή Όλων
                </label>
              </div>
            </div>
          )}
          
          {checklists.length === 0 ? (
            <div className="no-results">
              {loading ? 'Φόρτωση...' : 'Δεν βρέθηκαν checklists για τα επιλεγμένα κριτήρια'}
            </div>
          ) : (
            <div className="checklists-grid">
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
                  <div key={checklist.id} className="checklist-card">
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedChecklists.includes(checklist.id)}
                        onChange={() => handleSelectChecklist(checklist.id)}
                        className="card-checkbox"
                      />
                    </div>
                    <div className="card-header">
                      <h4 className="card-title">
                        {data.store_name || 'Κατάστημα'}
                      </h4>
                      <div className="card-date">
                        {formattedDate} {formattedTime}
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="score-section">
                        <div className="score-label">Σκορ:</div>
                        <div style={{
                          fontWeight: 'bold',
                          fontSize: '18px',
                          color: checklist.has_zero_cutoff ? '#dc3545' : 
                                 checklist.total_score >= 75 ? '#28a745' : 
                                 checklist.total_score >= 50 ? '#ffc107' : '#dc3545'
                        }}>
                          {checklist.has_zero_cutoff ? 'ΜΗΔΕΝ (CUTOFF)' : `${parseFloat(checklist.total_score).toFixed(2)}%`}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleViewPdf(checklist.pdf_url)} 
                        className="view-button"
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

export default ViewChecklists;

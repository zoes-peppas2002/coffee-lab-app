import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const TopStores = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get current year and month for default value
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  const defaultMonth = `${currentYear}-${currentMonth}`;

  // Set default month and perform initial search when component mounts
  React.useEffect(() => {
    setSelectedMonth(defaultMonth);
    
    // Perform initial search with current month after a short delay
    const timer = setTimeout(() => {
      const [year, month] = defaultMonth.split('-');
      fetchTopStores(month, year);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [defaultMonth]);
  
  // Extract the fetch logic to a separate function
  const fetchTopStores = async (month, year) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/stats/top-stores', {
        params: { month, year }
      });
      
      setResults(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching top stores:', err);
      setError('Σφάλμα κατά την αναζήτηση. Παρακαλώ δοκιμάστε ξανά.');
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!selectedMonth) {
      setError('Παρακαλώ επιλέξτε μήνα');
      return;
    }

    // Extract year and month from the selected month (format: YYYY-MM)
    const [year, month] = selectedMonth.split('-');
    fetchTopStores(month, year);
  };

  const handleExport = () => {
    if (!selectedMonth) {
      setError('Παρακαλώ επιλέξτε μήνα πριν την εξαγωγή');
      return;
    }
    
    // Extract year and month from the selected month (format: YYYY-MM)
    const [year, month] = selectedMonth.split('-');
    
    // Create the URL for the export endpoint
    const exportUrl = `/api/stats/export-top-stores?month=${month}&year=${year}`;
    
    // Open the URL in a new tab/window to trigger the download
    window.open(exportUrl, '_blank');
  };

  return (
    <AdminLayout onBack={() => window.location.href = '/admin'} onLogout={() => window.location.href = '/login'}>
      <div style={{ padding: 20 }}>
        <h2>Top Καταστήματα</h2>

        <div style={{ marginBottom: 15 }}>
          <label>Επιλογή Μήνα:</label><br />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ width: '100%', padding: 10 }}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={!selectedMonth || loading}
          style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', borderRadius: 5 }}
        >
          {loading ? 'Φόρτωση...' : 'Αναζήτηση'}
        </button>

        {error && (
          <div style={{ marginTop: 15, color: 'red', padding: 10, backgroundColor: '#ffeeee', borderRadius: 5 }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <p>Φόρτωση δεδομένων...</p>
          </div>
        )}

        {!loading && results.length === 0 && selectedMonth && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <p>Δεν βρέθηκαν αποτελέσματα για τον επιλεγμένο μήνα.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div style={{ marginTop: 30 }}>
            <h3>Αποτελέσματα:</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Κατάστημα</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Area Manager</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Coffee Specialist</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Μέσος Όρος</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Πλήθος Checklists</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{item.store_name}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{item.area_manager_score || '-'}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{item.coffee_specialist_score || '-'}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8, fontWeight: 'bold' }}>{item.total_avg}%</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{item.checklist_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={handleExport} style={{ marginTop: 20, backgroundColor: 'green', color: '#fff', padding: '10px 20px', borderRadius: 5 }}>
              Εξαγωγή σε Excel
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TopStores;

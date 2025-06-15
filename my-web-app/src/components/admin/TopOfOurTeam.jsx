import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';

// Role mapping for API calls
const roleMapping = {
  'Area Manager': 'area_manager',
  'Coffee Specialist': 'coffee_specialist'
};

// Role options
const roles = ['Area Manager', 'Coffee Specialist', 'Top Of Our Top'];

const TopOfOurTeam = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [results, setResults] = useState([]);
  const [topUser, setTopUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get current year and month for default value
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  const defaultMonth = `${currentYear}-${currentMonth}`;

  // Set default month and role when component mounts
  useEffect(() => {
    setSelectedMonth(defaultMonth);
    // Set default role to "Top Of Our Top"
    setSelectedRole('Top Of Our Top');
    
    // Perform initial search after a short delay
    const timer = setTimeout(() => {
      if (defaultMonth) {
        const [year, month] = defaultMonth.split('-');
        fetchTopOfTop(month, year);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [defaultMonth]);
  
  // Extract the fetch logic for Top Of Our Top to a separate function
  const fetchTopOfTop = async (month, year) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setTopUser(null);
    
    try {
      const response = await axios.get('/api/stats/top-of-top', {
        params: { month, year }
      });
      
      if (response.data) {
        setTopUser(response.data);
      } else {
        setError('Δεν βρέθηκαν δεδομένα για τον επιλεγμένο μήνα');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching top of top:', err);
      setError('Σφάλμα κατά την αναζήτηση. Παρακαλώ δοκιμάστε ξανά.');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedRole || !selectedMonth) {
      setError('Παρακαλώ επιλέξτε ρόλο και μήνα');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setTopUser(null);

    try {
      // Extract year and month from the selected month (format: YYYY-MM)
      const [year, month] = selectedMonth.split('-');
      
      if (selectedRole === 'Top Of Our Top') {
        // Fetch the top user across all roles
        const response = await axios.get('/api/stats/top-of-top', {
          params: { month, year }
        });
        
        if (response.data) {
          setTopUser(response.data);
        } else {
          setError('Δεν βρέθηκαν δεδομένα για τον επιλεγμένο μήνα');
        }
      } else {
        // Fetch users by selected role
        const apiRole = roleMapping[selectedRole];
        const response = await axios.get('/api/stats/top-users', {
          params: { month, year, role: apiRole }
        });
        
        setResults(response.data);
        
        if (response.data.length === 0) {
          setError(`Δεν βρέθηκαν δεδομένα για ${selectedRole} τον επιλεγμένο μήνα`);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Σφάλμα κατά την αναζήτηση. Παρακαλώ δοκιμάστε ξανά.');
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!selectedRole || !selectedMonth) {
      setError('Παρακαλώ επιλέξτε ρόλο και μήνα πριν την εξαγωγή');
      return;
    }
    
    // Extract year and month from the selected month (format: YYYY-MM)
    const [year, month] = selectedMonth.split('-');
    
    // Create the URL for the export endpoint based on the selected role
    let exportUrl;
    
    if (selectedRole === 'Top Of Our Top') {
      exportUrl = `/api/stats/export-top-of-top?month=${month}&year=${year}`;
    } else {
      // Get the API role value
      const apiRole = roleMapping[selectedRole];
      exportUrl = `/api/stats/export-top-users?month=${month}&year=${year}&role=${apiRole}`;
    }
    
    // Open the URL in a new tab/window to trigger the download
    window.open(exportUrl, '_blank');
  };

  return (
    <AdminLayout onBack={() => window.location.href = '/admin'} onLogout={() => window.location.href = '/login'}>
      <div style={{ padding: 20 }}>
        <h2>Top Of Our Team</h2>

        <div style={{ marginBottom: 15 }}>
          <label>Επιλογή Ομάδας:</label><br />
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={{ width: '100%', padding: 10 }}>
            <option value="">--Επιλογή--</option>
            {roles.map(role => <option key={role}>{role}</option>)}
          </select>
        </div>

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
          disabled={!selectedRole || !selectedMonth || loading}
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

        {!loading && topUser && (
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              border: '2px solid #28a745', 
              borderRadius: 10, 
              padding: 20,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#28a745', marginBottom: 20 }}>🏆 ΣΥΓΧΑΡΗΤΗΡΙΑ!!! 🏆</h3>
              <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                Ο/Η <span style={{ color: '#007bff' }}>{topUser.user_name}</span> είναι στην κορυφή για τον επιλεγμένο μήνα!
              </p>
              <p>Ρόλος: <strong>{topUser.role}</strong></p>
              <p>Μέσος Όρος: <strong style={{ color: '#28a745' }}>{topUser.avg_score}%</strong></p>
              <p>Πλήθος Checklists: <strong>{topUser.checklist_count}</strong></p>
              <p>Καταστήματα: <strong>{topUser.store_count}</strong></p>
            </div>
            
            <button onClick={handleExport} style={{ marginTop: 20, backgroundColor: 'green', color: '#fff', padding: '10px 20px', borderRadius: 5 }}>
              Εξαγωγή σε Excel
            </button>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div style={{ marginTop: 30 }}>
            <h3>Αποτελέσματα {selectedRole}:</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Όνομα</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Ρόλος</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Μ.Ο. Checklists (%)</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Πλήθος Checklists</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Καταστήματα</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{item.user_name}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{item.role}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8, fontWeight: 'bold' }}>{item.avg_score}%</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{item.checklist_count}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{item.store_count}</td>
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

export default TopOfOurTeam;

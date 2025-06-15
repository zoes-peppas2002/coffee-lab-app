import React from 'react';
import { useNavigate } from 'react-router-dom';

const AreaManagerDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  return (
    <div style={styles.wrapper}>
      {/* Header Bar */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/')}>← Πίσω</button>
        <h2 style={styles.title}>Καλωσήρθες {userName} </h2>
        <button
          style={styles.logoutButton}
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>

      {/* Buttons */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate('/area-manager/create')}>
          Δημιουργία Checklist
        </button>
        <button style={styles.button} onClick={() => navigate('/area-manager/view')}>
          Προβολή Checklist
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    fontFamily: 'Poppins, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#fff',
    margin: 0,
    padding: 0
  },
  header: {
    backgroundColor: '#1e1e2f',
    color: '#fff',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '106%',
    boxSizing: 'border-box',
    flexWrap: 'wrap'
  },
  backButton: {
    backgroundColor: '#f8e18c',
    padding: '8px 14px',
    borderRadius: 10,
    border: 'none',
    fontWeight: 'bold',
    fontSize: 16
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 10,
    border: 'none',
    fontWeight: 'bold',
    fontSize: 16
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '10px auto'
  },
 buttonContainer: {
  padding: '60px 30px',
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  alignItems: 'center',
  justifyContent: 'top',
  flexGrow: 1,
    minHeight: 'calc(100vh - 60px)' // προσαρμόζεται με το ύψος του header
},
  
button: {
  width: '100%',
  maxWidth: '400px',
  padding: '10px 10px',
  backgroundColor: '#007bff',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '12px',
  textAlign: 'center',
  margin: '0 auto' // 💡 Αυτό κεντράρει τέλεια το κουμπί
}
};

export default AreaManagerDashboard;

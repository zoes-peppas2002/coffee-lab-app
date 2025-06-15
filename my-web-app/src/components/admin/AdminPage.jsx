import React from 'react';
import { useNavigate } from 'react-router-dom';

// Κεντρικό Theme Config
const theme = {
  primaryColor: '#007BFF',
  backgroundColor: '#f5f5f5',
  headerColor: '#222c36',
  textColor: '#ffffff'
};

function AdminPage() {
  const navigate = useNavigate();

 const handleLogout = () => {
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  navigate("/login");
};


  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: theme.backgroundColor,
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.headerColor,
    color: theme.textColor,
    padding: '15px 30px',
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
  };

  const mainContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '5px'
  };

  const buttonStyle = {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    margin: '10px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    cursor: 'pointer',
    backgroundColor: theme.primaryColor,
    color: '#fff',
  };

  const backButtonStyle = {
    padding: '10px 20px',
    fontSize: '15px',
    borderRadius: '8px',
    backgroundColor: '#fff8dc',
    border: 'none',
    cursor: 'pointer',
    marginRight: '15px',
  };

  const logoutButtonStyle = {
    padding: '10px 20px',
    fontSize: '18px',
    borderRadius: '8px',
    backgroundColor: '#E74C3C',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>

      {/* Header */}
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate("/")}>⟵ Πίσω</button>
        <div style={titleStyle}>Καλωσήρθες Admin</div>
        <button style={logoutButtonStyle} onClick={handleLogout}>Logout</button>
      </div>

      {/* Κεντρικό μενού */}
      <div style={mainContentStyle}>
        <button style={buttonStyle} onClick={() => navigate("/admin/users")}>Διαχείριση Χρηστών</button>
        <button style={buttonStyle} onClick={() => navigate("/admin/network")}>Διαχείριση Λίστας Δικτύου</button>
        
        <button style={buttonStyle} onClick={() => navigate("/admin/templates")}>Διαχείριση Checklist Templates</button>

        <button style={buttonStyle} onClick={() => navigate("/admin/view-checklists")}>Προβολή Checklists</button>

        <button style={buttonStyle} onClick={() => navigate("/admin/top-stores")}>Top Καταστήματα</button>
        <button style={buttonStyle} onClick={() => navigate("/admin/top-team")}>Top Of Our Team</button>

        <button style={buttonStyle} onClick={() => navigate("/admin/settings")}>Ρυθμίσεις</button>
      </div>

    </div>
  );
}

export default AdminPage;

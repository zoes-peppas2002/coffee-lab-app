import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Header */}
      <div className="admin-header">
        <h2 className="admin-title">Καλωσήρθες {userName} - Admin Panel</h2>
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <ul className="admin-sidebar-nav">
            <li className="admin-sidebar-item">
              <Link to="/admin/users" className="admin-sidebar-link">Διαχείριση Χρηστών</Link>
            </li>
            <li className="admin-sidebar-item">
              <Link to="/admin/network" className="admin-sidebar-link">Διαχείριση Λίστας Δικτύου</Link>
            </li>
            <li className="admin-sidebar-item">
              <Link to="/admin/templates" className="admin-sidebar-link">Διαχείριση Templates</Link>
            </li>
            <li className="admin-sidebar-item">
              <Link to="/admin/view-checklists" className="admin-sidebar-link">Προβολή Checklists</Link>
            </li>
            <li className="admin-sidebar-item">
              <Link to="/admin/top-stores" className="admin-sidebar-link">Top Καταστήματα</Link>
            </li>
            <li className="admin-sidebar-item">
              <Link to="/admin/top-team" className="admin-sidebar-link">Top Of Our Team</Link>
            </li>
            <li className="admin-sidebar-item">
              <Link to="/admin/settings" className="admin-sidebar-link">Ρυθμίσεις</Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="admin-main">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

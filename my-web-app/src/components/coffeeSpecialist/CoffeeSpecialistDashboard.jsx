import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CoffeeSpecialistDashboard.css';

const CoffeeSpecialistDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  return (
    <div className="dashboard-wrapper">
      {/* Header Bar */}
      <div className="dashboard-header">
        <button className="back-button" onClick={() => navigate('/')}>← Πίσω</button>
        <h2 className="dashboard-title">Καλωσήρθες {userName}</h2>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>

      {/* Buttons */}
      <div className="button-container">
        <button className="dashboard-button" onClick={() => navigate('/coffee-specialist/create')}>
          Δημιουργία Checklist
        </button>
        <button className="dashboard-button" onClick={() => navigate('/coffee-specialist/view')}>
          Προβολή Checklist
        </button>
      </div>
    </div>
  );
};

export default CoffeeSpecialistDashboard;

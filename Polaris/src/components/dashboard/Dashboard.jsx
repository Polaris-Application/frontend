import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuthContext();
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.email}</h1>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
      <div className="dashboard-content">
        {/* Add your dashboard content here */}
        <div className="dashboard-card">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Tasks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
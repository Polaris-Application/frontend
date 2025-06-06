import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import ThemeToggle from '../theme/ThemeToggle';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuthContext();
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <div className="header-actions">
          <ThemeToggle className="dashboard-theme-toggle" />
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <div className="dashboard-content">
        {/* Add your dashboard content here */}
        <div className="dashboard-card">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Mobile Devices</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Event Count</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
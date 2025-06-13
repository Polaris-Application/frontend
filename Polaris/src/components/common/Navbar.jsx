import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import ThemeToggle from '../theme/ThemeToggle';
import logoImg from '../../assets/polaris-logo-withouttext.png';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  //if (!user) return null; // don't show navbar for public pages

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <img src={logoImg} alt="Polaris logo" className="navbar-logo" />
          <span className="brand-text">Polaris</span>
        </Link>

        <button
          className={`burger ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${open ? 'show' : ''}`}>
          <Link to="/dashboard" onClick={() => handleNav('/dashboard')}>Dashboard</Link>
          <Link to="/tests" onClick={() => handleNav('/tests')}>Tests</Link>
          {/* Future links go here */}
          <ThemeToggle />
          <button className="logout-button" onClick={logout} aria-label="Logout">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="logout-icon"
              width="18"
              height="18"
            >
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span style={{marginBottom: "3px"}}>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
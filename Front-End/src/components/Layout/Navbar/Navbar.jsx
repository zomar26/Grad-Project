import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="nav-wrapper">
      <nav className="main-nav-frame"> 
        
        {/* Logo Section */}
        <div className="nav-logo-section">
          <Link to="/" className="logo-link">
            <div className="logo-symbol"></div>
            <span className="logo-text">Through the eye</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links-capsule hide-on-mobile">
          <ul className="nav-menu">
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            </li>
            <li>
              <Link to="/simulation" className={location.pathname === '/simulation' ? 'active' : ''}>Simulation</Link>
            </li>
            <li>
              <Link to="/chatbot" className={location.pathname === '/chatbot' ? 'active' : ''}>Chatbot</Link>
            </li>
            <li>
              <Link to="/diseases" className={location.pathname === '/diseases' ? 'active' : ''}>Diseases</Link>
            </li>
          </ul>
        </div>

        {/* Actions Group */}
        <div className="nav-actions-group">
          {isAuthenticated ? (
            <button 
              onClick={logout} 
              className="user-capsule"
              style={{
                border: 'none',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                cursor: 'pointer'
              }}
              title={`Logged in as ${user?.name || 'User'}. Click to Log Out`}
            >
              <FiLogOut />
            </button>
          ) : (
            <Link to="/register" className="user-capsule" title="Sign Up / Log In">
              <FiUser />
            </Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="mobile-dropdown-menu">
            <ul className="mobile-menu-list">
              <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link to="/simulation" onClick={() => setIsMenuOpen(false)}>Simulation</Link></li>
              <li><Link to="/chatbot" onClick={() => setIsMenuOpen(false)}>Chatbot</Link></li>
              <li><Link to="/diseases" onClick={() => setIsMenuOpen(false)}>Diseases</Link></li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
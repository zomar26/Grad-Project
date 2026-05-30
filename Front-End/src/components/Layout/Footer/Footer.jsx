import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (path) => {
    if (location.pathname === path) {
      scrollToTop();
    }
  };

  return (
    <footer className="ft-main">
      <div className="ft-container">

        <div className="ft-top-content">
          <div className="ft-brand-group" onClick={scrollToTop} style={{ cursor: 'pointer' }}>
            <h2 className="ft-logo">Through the eye .</h2>
            <div className="ft-vertical-divider"></div>
            <p className="ft-tagline">VR Simulation of retinal diseases</p>
          </div>

          <nav className="ft-nav-links">
            <Link to="/" onClick={() => handleLinkClick('/')}>Home</Link>
            <Link to="/simulation" onClick={() => handleLinkClick('/simulation')}>Simulation</Link>
            <Link to="/chatbot" onClick={() => handleLinkClick('/chatbot')}>Chatbot</Link>
            <Link to="/diseases" onClick={() => handleLinkClick('/diseases')}>Diseases</Link>
          </nav>
        </div>

        <div className="ft-horizontal-line"></div>

        <div className="ft-bottom-content">
          <p className="ft-copyright">Copyright © 2026 Through the eye. All rights reserved</p>
          <div className="ft-legal-group">
            <Link to="/privacy" onClick={() => handleLinkClick('/privacy')}>Privacy Policy</Link>
            <Link to="/terms" onClick={() => handleLinkClick('/terms')}>Terms of Use</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
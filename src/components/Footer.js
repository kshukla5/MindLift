import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer footer-compact">
      <div className="footer-container footer-compact-row">
        <div className="footer-left">
          <span className="logo-icon" aria-hidden="true">🧠</span>
          <span className="logo-text">MindLift</span>
          <span className="separator">•</span>
          <span className="copyright">© {currentYear} KANDOR</span>
        </div>
        <div className="footer-right">
          <Link to="/privacy" className="footer-bottom-link">Privacy</Link>
          <span className="separator">•</span>
          <Link to="/terms" className="footer-bottom-link">Terms</Link>
          <span className="separator">•</span>
          <Link to="/contact" className="footer-bottom-link">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

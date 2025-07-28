import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-section company-info">
            <div className="footer-logo">
              <span className="logo-icon">🧠</span>
              <span className="logo-text">MindLift</span>
            </div>
            <p className="footer-description">
              Empowering minds through innovative learning experiences. 
              Transform your potential with our cutting-edge educational platform.
            </p>
            <div className="social-links">
              <a href="https://kandor.in" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="social-icon">🌐</span>
                <span>Website</span>
              </a>
              <a href="mailto:rinkal@kandor.in" className="social-link">
                <span className="social-icon">📧</span>
                <span>Email</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="social-icon">💼</span>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section quick-links">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/features" className="footer-link">Features</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="footer-section services">
            <h3 className="footer-heading">Our Services</h3>
            <ul className="footer-links">
              <li><span className="footer-link">Leadership Development</span></li>
              <li><span className="footer-link">Personal Development</span></li>
              <li><span className="footer-link">Presentation Skills</span></li>
              <li><span className="footer-link">Public Speaking</span></li>
              <li><span className="footer-link">Team Building</span></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section support">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li><Link to="/help" className="footer-link">Help Center</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="footer-section contact-info">
            <h3 className="footer-heading">Contact Info</h3>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <a href="mailto:rinkal@kandor.in" className="contact-link">rinkal@kandor.in</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span className="contact-text">Oakville, Canada</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🌐</span>
              <a href="https://kandor.in" target="_blank" rel="noopener noreferrer" className="contact-link">
                kandor.in
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} MindLift by KANDOR. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="footer-bottom-link">Privacy</Link>
              <span className="separator">•</span>
              <Link to="/terms" className="footer-bottom-link">Terms</Link>
              <span className="separator">•</span>
              <Link to="/cookies" className="footer-bottom-link">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

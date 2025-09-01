import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-brain">🧠</span>
              <span className="logo-text">MindLift</span>
            </Link>
            <p className="footer-description">
              Transform your mind, elevate your life. Join thousands of learners
              on their journey to mastery and professional growth.
            </p>
            <div className="social-links">
              <a href="/#" onClick={(e) => e.preventDefault()} className="social-link" aria-label="Twitter">
                🐦
              </a>
              <a href="/#" onClick={(e) => e.preventDefault()} className="social-link" aria-label="LinkedIn">
                💼
              </a>
              <a href="/#" onClick={(e) => e.preventDefault()} className="social-link" aria-label="YouTube">
                📺
              </a>
              <a href="/#" onClick={(e) => e.preventDefault()} className="social-link" aria-label="Instagram">
                📷
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links">
            <div className="footer-section">
              <h3>Platform</h3>
              <Link to="/videos">Browse Courses</Link>
              <Link to="/speaker">Become a Speaker</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/enterprise">Enterprise</Link>
            </div>

            <div className="footer-section">
              <h3>Company</h3>
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/press">Press</Link>
              <Link to="/contact">Contact</Link>
            </div>

            <div className="footer-section">
              <h3>Support</h3>
              <Link to="/help">Help Center</Link>
              <Link to="/community">Community</Link>
              <Link to="/status">System Status</Link>
              <Link to="/feedback">Feedback</Link>
            </div>

            <div className="footer-section">
              <h3>Legal</h3>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
              <Link to="/accessibility">Accessibility</Link>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Stay Updated</h3>
            <p>Get the latest courses, learning tips, and platform updates delivered to your inbox.</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="btn btn-primary newsletter-btn">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} MindLift. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

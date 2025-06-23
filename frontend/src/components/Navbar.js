import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          MindLift
        </a>
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="/features" className="nav-links">
              Features
            </a>
          </li>
          <li className="nav-item">
            <a href="/about" className="nav-links">
              About Us
            </a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-links">
              Contact
            </a>
          </li>
        </ul>
        <div className="nav-auth-links">
          <a href="/login" className="nav-links auth-link login-link">
            Login
          </a>
          <a href="/signup" className="nav-links auth-link signup-link">
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
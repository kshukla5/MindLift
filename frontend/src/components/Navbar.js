import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MindLift
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/features" className="nav-links">
              Features
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links">
              About Us
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links">
              Contact
            </Link>
          </li>
        </ul>
        <div className="nav-auth-links">
          <Link to="/login" className="nav-links auth-link login-link">
            Login
          </Link>
          <Link to="/signup" className="nav-links auth-link signup-link">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
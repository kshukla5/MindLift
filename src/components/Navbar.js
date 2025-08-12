import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, isSpeaker, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo with Icon */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span className="logo-icon">🧠</span>
          <span className="logo-text">MindLift</span>
        </Link>

        {/* Desktop Navigation Menu */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'nav-menu-active' : ''}`}>
          {/* Public Navigation */}
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-links ${isActiveLink('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">🏠</span>
              Home
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              to="/features" 
              className={`nav-links ${isActiveLink('/features') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">⭐</span>
              Features
            </Link>
          </li>

          {/* User Dashboard Links */}
          {isAuthenticated && !isSpeaker && !isAdmin && (
            <>
              <li className="nav-item">
                <Link 
                  to="/dashboard" 
                  className={`nav-links ${isActiveLink('/dashboard') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className="nav-icon">📊</span>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/my-library" 
                  className={`nav-links ${isActiveLink('/my-library') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className="nav-icon">📚</span>
                  My Library
                </Link>
              </li>
            </>
          )}

          {/* Speaker Panel */}
          {isSpeaker && (
            <li className="nav-item">
              <Link 
                to="/speaker" 
                className={`nav-links ${isActiveLink('/speaker') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">🎤</span>
                Speaker Panel
              </Link>
            </li>
          )}

          {/* Admin Panel */}
          {isAdmin && (
            <li className="nav-item">
              <Link 
                to="/admin" 
                className={`nav-links ${isActiveLink('/admin') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">⚙️</span>
                Admin Panel
              </Link>
            </li>
          )}

          {/* About & Contact */}
          <li className="nav-item">
            <Link 
              to="/about" 
              className={`nav-links ${isActiveLink('/about') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">ℹ️</span>
              About
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              to="/contact" 
              className={`nav-links ${isActiveLink('/contact') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">📞</span>
              Contact
            </Link>
          </li>
        </ul>

        {/* User Authentication Section */}
        <div className="nav-auth-section">
          {isAuthenticated ? (
            <>
              <div className="user-profile-dropdown">
                <Link 
                  to="/profile" 
                  className={`user-profile-link ${isActiveLink('/profile') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <div className="user-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || '👤'}
                  </div>
                  <span className="user-name">{user?.name}</span>
                  <span className={`user-role role-${user?.role}`}>
                    {user?.role}
                  </span>
                </Link>
              </div>
              <button 
                onClick={handleLogout} 
                className="logout-btn"
                title="Logout"
              >
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Logout</span>
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link 
                to="/login" 
                className="login-btn"
                onClick={closeMobileMenu}
              >
                <span className="auth-icon">🔑</span>
                Login
              </Link>
              <Link 
                to="/signup" 
                className="signup-btn"
                onClick={closeMobileMenu}
              >
                <span className="auth-icon">✨</span>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </nav>
  );
}

export default Navbar;

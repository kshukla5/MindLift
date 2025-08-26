import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="logo-brain">🧠</span>
            <span className="logo-text">MindLift</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/videos"
              className={`nav-link ${isActive('/videos') ? 'active' : ''}`}
            >
              Courses
            </Link>
            {isAuthenticated && (
              <>
                {user?.role === 'speaker' && (
                  <Link
                    to="/speaker"
                    className={`nav-link ${isActive('/speaker') ? 'active' : ''}`}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span className="user-name">{user?.name || 'User'}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-outline">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <Link
              to="/"
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/videos"
              className={`mobile-nav-link ${isActive('/videos') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Courses
            </Link>
            {isAuthenticated && (
              <>
                {user?.role === 'speaker' && (
                  <Link
                    to="/speaker"
                    className={`mobile-nav-link ${isActive('/speaker') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Profile
                </Link>
              </>
            )}
            <div className="mobile-auth-section">
              {isAuthenticated ? (
                <>
                  <div className="mobile-user-info">
                    <span className="user-avatar">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <span className="user-name">{user?.name || 'User'}</span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-outline mobile-btn">
                    Logout
                  </button>
                </>
              ) : (
                <div className="mobile-auth-links">
                  <Link to="/login" className="btn btn-outline mobile-btn" onClick={closeMenu}>
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn btn-primary mobile-btn" onClick={closeMenu}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

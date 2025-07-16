import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, isSpeaker, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    // A full page reload is often the simplest way to reset all state.
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MindLift
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/features" className="nav-links">Features</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links">About Us</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links">Contact</Link>
          </li>
          {isAuthenticated && !isSpeaker && !isAdmin && (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-links">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/my-library" className="nav-links">My Library</Link>
              </li>
            </>
          )}
          {isSpeaker && (
            <li className="nav-item">
              <Link to="/speaker" className="nav-links">Speaker Panel</Link>
            </li>
          )}
          {isAdmin && (
            <li className="nav-item">
              <Link to="/admin" className="nav-links">Admin</Link>
            </li>
          )}
        </ul>
        <div className="nav-auth-links">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-links welcome-text">
                Welcome, {user?.name}
              </Link>
              <button onClick={handleLogout} className="nav-links auth-link logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-links auth-link login-link">Login</Link>
              <Link to="/signup" className="nav-links auth-link signup-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
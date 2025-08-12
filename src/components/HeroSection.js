import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './HeroSection.css';

function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="hero-container">
      <h1>Elevate Your Mind</h1>
      <p>Discover tranquility and unlock your potential with MindLift.</p>
      <div className="hero-btns">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="btn btn-primary">
              <span>📊</span>
              Go to Dashboard
            </Link>
            <Link to="/features" className="btn btn-outline">
              <span>⭐</span>
              Explore Features
            </Link>
          </>
        ) : (
          <>
            <Link to="/signup" className="btn btn-primary">
              <span>✨</span>
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline">
              <span>🔑</span>
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default HeroSection;

import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className="hero-container">
      <h1>Elevate Your Mind</h1>
      <p>Discover tranquility and unlock your potential with MindLift.</p>
      <div className="hero-btns">
        <Link to="/signup" className="btn btn-primary btn-large">
          GET STARTED
        </Link>
        <Link to="/features" className="btn btn-outline btn-large">
          LEARN MORE <i className="far fa-play-circle" />
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;
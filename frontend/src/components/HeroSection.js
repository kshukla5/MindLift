import React from 'react';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className="hero-container">
      <h1>Elevate Your Mind</h1>
      <p>Discover tranquility and unlock your potential with MindLift.</p>
      <div className="hero-btns">
        <a href="/signup" className="btn btn-primary btn-large">
          GET STARTED
        </a>
        <a href="/features" className="btn btn-outline btn-large">
          LEARN MORE <i className="far fa-play-circle" />
        </a>
      </div>
    </div>
  );
}

export default HeroSection;
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-root">
      {/* Hero Section */}
      <section className="hp-hero">
        <div className="hp-hero-content">
          <h1 className="hp-hero-title">Elevate Your Potential</h1>
          <p className="hp-hero-sub">
            Transform your mindset with expert-led content and personalized learning experiences.
            Join thousands of learners on their journey to success.
          </p>
          <div className="hp-hero-actions">
            <Link to="/signup" className="home-btn-primary">Start Your Journey</Link>
            <Link to="/features" className="home-btn-secondary">Learn More</Link>
          </div>
          <p className="hp-trust-text">Join 10,000+ learners already transforming their lives</p>
        </div>
        <div className="hp-hero-media">
          <div className="hp-hero-placeholder">
            <div className="hp-logo">🧠</div>
            <h3>MindLift</h3>
            <p>Your path to growth</p>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="hp-stats-band">
        <div className="hp-stats-grid">
          <div className="hp-stat">
            <div className="hp-stat-value">10,000+</div>
            <div className="hp-stat-label">Active Learners</div>
          </div>
          <div className="hp-stat">
            <div className="hp-stat-value">500+</div>
            <div className="hp-stat-label">Expert Videos</div>
          </div>
          <div className="hp-stat">
            <div className="hp-stat-value">50+</div>
            <div className="hp-stat-label">Expert Speakers</div>
          </div>
          <div className="hp-stat">
            <div className="hp-stat-value">95%</div>
            <div className="hp-stat-label">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="hp-section">
        <div className="hp-section-header">
          <h2 className="hp-section-title">Why Choose MindLift?</h2>
          <p className="hp-section-sub">Discover the features that make transformation possible</p>
        </div>
        
        <div className="hp-features-grid">
          <div className="hp-feature">
            <div className="hp-feature-icon">🎯</div>
            <h3 className="hp-feature-title">Personalized Learning</h3>
            <p className="hp-feature-desc">Content tailored to your unique goals and learning style.</p>
          </div>
          
          <div className="hp-feature">
            <div className="hp-feature-icon">🧠</div>
            <h3 className="hp-feature-title">Expert-Led Content</h3>
            <p className="hp-feature-desc">Learn from certified professionals and thought leaders.</p>
          </div>
          
          <div className="hp-feature">
            <div className="hp-feature-icon">📈</div>
            <h3 className="hp-feature-title">Track Progress</h3>
            <p className="hp-feature-desc">Monitor your growth with detailed analytics and insights.</p>
          </div>
          
          <div className="hp-feature">
            <div className="hp-feature-icon">🤝</div>
            <h3 className="hp-feature-title">Community Support</h3>
            <p className="hp-feature-desc">Connect with like-minded individuals on the same path.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="hp-final-cta">
        <div className="hp-final-cta-inner">
          <h2 className="hp-final-title">Ready to Elevate Your Life?</h2>
          <p className="hp-final-sub">
            Join thousands of learners who have already transformed their mindset and achieved their goals.
          </p>
          <div className="hp-final-actions">
            <Link to="/signup" className="home-btn-primary hp-final-btn">Start Free Today</Link>
            <Link to="/features" className="home-btn-secondary hp-final-btn">View Features</Link>
          </div>
          <p className="hp-final-foot">No credit card required • Cancel anytime</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

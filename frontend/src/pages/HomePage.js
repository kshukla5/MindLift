import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import VideoGrid from './VideoGrid';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'MindLift - Transform Your Mind, Transform Your Life';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover motivation, inspiration, and personal growth with MindLift. Access thousands of expert videos, build your personal library, and join a community of growth-minded individuals.');
    }
  }, []);

  const keyFeatures = [
    {
      icon: '🎯',
      title: 'Curated Content',
      description: 'Expert-vetted motivational videos from top speakers worldwide'
    },
    {
      icon: '📚',
      title: 'Personal Library',
      description: 'Bookmark and organize your favorite content for easy access'
    },
    {
      icon: '🌟',
      title: 'Community',
      description: 'Connect with like-minded individuals on their growth journey'
    },
    {
      icon: '🆓',
      title: 'Completely Free',
      description: 'All features available at no cost, forever'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '500+', label: 'Expert Speakers' },
    { number: '5K+', label: 'Videos' },
    { number: '50+', label: 'Categories' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Entrepreneur',
      content: 'MindLift has completely transformed my daily routine. The curated content helps me stay motivated and focused on my goals.',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Student',
      content: 'The personal library feature is incredible. I can save all my favorite motivational videos and access them whenever I need inspiration.',
      avatar: '👨‍🎓'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Coach',
      content: 'As a speaker, MindLift has given me a platform to reach thousands of people. The community is truly supportive and engaged.',
      avatar: '👩‍🏫'
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Transform Your Mind,<br />Transform Your Life</h1>
            <p>
              Discover thousands of motivational videos, expert talks, and personal development content. 
              Join a community of growth-minded individuals and start your transformation today.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-primary hero-btn"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start Your Journey'}
              </button>
              <button 
                className="btn-secondary hero-btn"
                onClick={() => navigate('/features')}
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-decoration">
              <div className="floating-card">
                <div className="card-icon">🎯</div>
                <div className="card-text">Goal Setting</div>
              </div>
              <div className="floating-card">
                <div className="card-icon">💪</div>
                <div className="card-text">Motivation</div>
              </div>
              <div className="floating-card">
                <div className="card-icon">🧠</div>
                <div className="card-text">Mindset</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="key-features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose MindLift?</h2>
            <p>Everything you need to accelerate your personal growth journey</p>
          </div>
          <div className="features-grid">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="features-cta">
            <button 
              className="btn-outline"
              onClick={() => navigate('/features')}
            >
              View All Features
            </button>
          </div>
        </div>
      </section>

      {/* Video Preview Section */}
      <section className="video-preview-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore Our Content</h2>
            <p>Discover inspiring videos from top speakers and thought leaders</p>
          </div>
          <div className="video-grid-container">
            <VideoGrid limit={6} />
          </div>
          <div className="video-preview-cta">
            <button 
              className="btn-primary"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
            >
              {isAuthenticated ? 'View All Videos' : 'Sign Up to Watch'}
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Community Says</h2>
            <p>Join thousands of people who are transforming their lives</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Life?</h2>
            <p>Join thousands of people who are already on their journey to success</p>
            <button 
              className="btn-primary cta-btn"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
            >
              {isAuthenticated ? 'Continue Your Journey' : 'Get Started Free'}
            </button>
            <div className="cta-note">
              <small>100% Free • No Credit Card Required • Instant Access</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
// force redeploy:  2025-08-12T00:55:03Z

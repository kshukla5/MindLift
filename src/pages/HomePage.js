import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './HomePage.css';

// Component for statistics display
function StatCard({ value, label, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// Component for feature cards
function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}

// Component for steps
function StepCard({ number, title, description }) {
  return (
    <div className="step-card">
      <div className="step-number">{number}</div>
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>
    </div>
  );
}

// Component for testimonials
function TestimonialCard({ quote, author, role }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-quote">"{quote}"</div>
      <div className="testimonial-author">
        <div className="author-name">{author}</div>
        <div className="author-role">{role}</div>
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'MindLift - Elevate Your Potential';
  }, []);

  const stats = [
    { icon: '👥', value: '12,000+', label: 'Active Learners' },
    { icon: '🎥', value: '1,800+', label: 'Curated Videos' },
    { icon: '⭐', value: '4.9/5', label: 'User Rating' },
    { icon: '🚀', value: '96%', label: 'Return Rate' }
  ];

  const features = [
    {
      icon: '🎯',
      title: 'Curated Content',
      description: 'Hand-picked videos from industry experts and thought leaders'
    },
    {
      icon: '🧠',
      title: 'Science-Based',
      description: 'Content backed by neuroscience and behavioral psychology research'
    },
    {
      icon: '📚',
      title: 'Personal Library',
      description: 'Build your collection with bookmarks and personalized recommendations'
    },
    {
      icon: '📈',
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics and insights'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up in seconds - completely free, no credit card required'
    },
    {
      number: '02',
      title: 'Choose Topics',
      description: 'Select areas of interest to personalize your learning experience'
    },
    {
      number: '03',
      title: 'Start Learning',
      description: 'Dive into curated content and build your knowledge foundation'
    }
  ];

  const testimonials = [
    {
      quote: 'MindLift transformed how I approach personal development. The content quality is exceptional.',
      author: 'Sarah Chen',
      role: 'Product Manager'
    },
    {
      quote: 'Finally, a platform that respects my time. Every video adds real value to my growth.',
      author: 'Marcus Rodriguez',
      role: 'Entrepreneur'
    },
    {
      quote: 'The curation is spot-on. I discover insights I would never have found on my own.',
      author: 'Dr. Emily Watson',
      role: 'Research Scientist'
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Elevate Your <span className="text-gradient">Potential</span>
            </h1>
            <p className="hero-subtitle">
              Discover curated video content designed to accelerate your personal and professional growth. 
              Learn from experts, build better habits, and unlock your full potential.
            </p>
            <div className="hero-actions">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start Learning Free'}
              </button>
              <button 
                className="btn btn-outline btn-large"
                onClick={() => navigate('/features')}
              >
                Explore Features
              </button>
            </div>
            <div className="hero-badges">
              <span className="badge">✓ Free Forever</span>
              <span className="badge">✓ No Ads</span>
              <span className="badge">✓ Expert Curated</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-header">
                <div className="card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="card-title">🧠 MindLift</span>
              </div>
              <div className="card-content">
                <div className="video-preview">
                  <div className="play-button">▶</div>
                </div>
                <div className="card-info">
                  <h4>Growth Mindset Fundamentals</h4>
                  <p>Dr. Carol Dweck • 12 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose MindLift?</h2>
            <p className="section-subtitle">
              We've reimagined online learning to focus on quality, relevance, and real-world application
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="steps-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Getting Started is Simple</h2>
            <p className="section-subtitle">
              Begin your learning journey in just three easy steps
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">
              Join thousands of learners who are transforming their lives with MindLift
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Transform Your Learning?</h2>
          <p className="cta-subtitle">
            Join MindLift today and start your journey toward continuous growth and development
          </p>
          <div className="cta-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
            >
              {isAuthenticated ? 'Continue Learning' : 'Get Started Free'}
            </button>
            <button 
              className="btn btn-outline btn-large"
              onClick={() => navigate('/features')}
            >
              Learn More
            </button>
          </div>
          <div className="cta-note">
            No credit card required • Cancel anytime • 100% free
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

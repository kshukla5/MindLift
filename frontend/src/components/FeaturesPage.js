import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './FeaturesPage.css';

function FeaturesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'Features - MindLift | Personal Development Platform';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover MindLift\'s powerful features: curated content library, speaker platform, personal collections, and more. Start your growth journey today - completely free.');
    }
  }, []);
  const features = [
    {
      icon: '🎯',
      title: 'Curated Content Library',
      description: 'Access a vast collection of motivational videos, speeches, and personal development content from top speakers and thought leaders.',
      benefits: ['Expert-vetted content', 'Diverse topics', 'Regular updates', 'High-quality videos']
    },
    {
      icon: '🎤',
      title: 'Speaker Platform',
      description: 'Become a featured speaker and share your knowledge with a global audience. Upload your content and inspire others.',
      benefits: ['Easy upload process', 'Global reach', 'Community engagement', 'Personal branding']
    },
    {
      icon: '📚',
      title: 'Personal Library',
      description: 'Bookmark and organize your favorite videos into personalized collections for easy access and future reference.',
      benefits: ['Custom collections', 'Quick access', 'Progress tracking', 'Offline availability']
    },
    {
      icon: '🎨',
      title: 'Intuitive Interface',
      description: 'Experience a clean, user-friendly design that makes discovering and consuming content effortless and enjoyable.',
      benefits: ['Responsive design', 'Easy navigation', 'Mobile-friendly', 'Accessibility features']
    },
    {
      icon: '🔍',
      title: 'Smart Search & Discovery',
      description: 'Find exactly what you need with advanced search filters, categories, and personalized recommendations.',
      benefits: ['Advanced filters', 'Category browsing', 'Search suggestions', 'Trending content']
    },
    {
      icon: '🌟',
      title: 'Community Features',
      description: 'Connect with like-minded individuals, share insights, and build meaningful relationships within our growing community.',
      benefits: ['User profiles', 'Content sharing', 'Discussion forums', 'Networking opportunities']
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security measures and privacy controls that put you in control.',
      benefits: ['Data encryption', 'Privacy controls', 'Secure authentication', 'GDPR compliant']
    },
    {
      icon: '💫',
      title: 'Free for Everyone',
      description: 'All features are completely free to use. No hidden fees, no premium tiers - just unlimited access to inspiration.',
      benefits: ['100% free', 'No ads', 'Unlimited access', 'No subscription required']
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '500+', label: 'Expert Speakers' },
    { number: '5K+', label: 'Motivational Videos' },
    { number: '50+', label: 'Categories' }
  ];

  return (
    <div className="features-page">
      {/* Hero Section */}
      <div className="features-hero">
        <div className="hero-content">
          <h1>Powerful Features for Your Growth Journey</h1>
          <p className="hero-subtitle">
            Discover the tools and resources designed to accelerate your personal and professional development
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2>Everything You Need to Succeed</h2>
            <p>Our comprehensive platform provides all the tools and content you need for continuous growth</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-benefits">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <div className="how-it-works-container">
          <h2>How MindLift Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign Up</h3>
                <p>Create your free account in seconds and join our community of growth-minded individuals</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Explore</h3>
                <p>Browse our extensive library of motivational content across various categories and topics</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Learn</h3>
                <p>Watch inspiring videos, take notes, and bookmark content that resonates with you</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Grow</h3>
                <p>Apply what you've learned and track your progress as you develop new skills and mindsets</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of others who are already transforming their lives with MindLift</p>
          <div className="cta-buttons">
            <button 
              className="cta-primary" 
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
              aria-label={isAuthenticated ? 'Go to your dashboard' : 'Sign up for free account'}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
            </button>
            <button 
              className="cta-secondary" 
              onClick={() => navigate('/')}
              aria-label="Explore video library"
            >
              Explore Videos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturesPage;

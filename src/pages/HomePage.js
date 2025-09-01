import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

// Enterprise content (module constants avoid hook deps noise)
const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Engineering Manager, FinTechCo',
    content:
      'MindLift accelerated our upskilling roadmap. Delivery quality and measurable outcomes rival the best enterprise L&D platforms.',
    avatar: 'SJ',
  },
  {
    name: 'Michael Chen',
    role: 'Director of Product, SaaSCorp',
    content:
      'World‑class speakers, practical content, and analytics that our leadership actually uses. Time‑to‑productivity improved by 32%.',
    avatar: 'MC',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Design, RetailAI',
    content:
      'Consistent, high‑signal learning experiences. Our teams love the format and we see the impact in delivery speed.',
    avatar: 'ER',
  },
];

const FEATURES = [
  {
    icon: '🎓',
    title: 'Expert‑Led Programs',
    description:
      'Curricula designed and delivered by senior operators and domain experts with proven track records.',
  },
  {
    icon: '📈',
    title: 'Outcome‑Driven Analytics',
    description:
      'Dashboards that map engagement to capability growth and business outcomes your execs care about.',
  },
  {
    icon: '🔒',
    title: 'Enterprise‑Grade Security',
    description:
      'SSO/SAML ready. Data encrypted in transit and at rest. Least‑privilege by default.',
  },
  {
    icon: '⚙️',
    title: 'Seamless Integrations',
    description:
      'Plug into your HRIS/LMS stack. CSV/SFTP export, webhooks, and API support.',
  },
  {
    icon: '🧭',
    title: 'Personalized Paths',
    description:
      'Adaptive learning paths aligned to role, seniority, and strategic initiatives.',
  },
  {
    icon: '🤝',
    title: 'Managed Rollouts',
    description:
      'Enterprise onboarding, change management, and success plans included.',
  },
];

const STATS = [
  { number: '50K+', label: 'Active Learners' },
  { number: '1,000+', label: 'Expert Speakers' },
  { number: '5,000+', label: 'Programs & Talks' },
  { number: '95%', label: 'Satisfaction Score' },
];

const LOGOS = ['Acme', 'Globex', 'Innotech', 'Umbrella', 'Stark', 'Wayne'];

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className={`hero-text ${isVisible ? 'fade-in-up' : ''}`}>
              <h1>Enterprise Learning That Moves the Needle</h1>
              <p className="hero-subtitle">
                Upskill your teams with expert‑led programs, measurable outcomes, and
                enterprise‑grade security — all in one modern learning platform.
              </p>
              <div className="hero-actions">
                <Link to="/signup" className="btn btn-primary">
                  Start Free Trial
                  <span>→</span>
                </Link>
                <Link to="/videos" className="btn btn-outline">
                  Talk to Sales
                </Link>
              </div>
              <div className="hero-stats">
                {STATS.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="logo-strip" aria-label="Trusted by leading teams">
                {LOGOS.map((logo, i) => (
                  <div key={i} className="logo-item" title={logo} aria-hidden="true">
                    {logo}
                  </div>
                ))}
              </div>
            </div>
            <div className={`hero-visual ${isVisible ? 'fade-in-up' : ''}`}>
              <div className="hero-illustration">
                <div className="floating-card card-1">
                  <span className="card-icon">🚀</span>
                  <span className="card-text">Career Growth</span>
                </div>
                <div className="floating-card card-2">
                  <span className="card-icon">💡</span>
                  <span className="card-text">Innovation</span>
                </div>
                <div className="floating-card card-3">
                  <span className="card-icon">🎯</span>
                  <span className="card-text">Skill Mastery</span>
                </div>
                <div className="hero-center">
                  <div className="hero-circle">
                    <span className="hero-brain">🧠</span>
                  </div>
                  <h3>MindLift</h3>
                  <p>Enterprise Learning Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Built for Modern Enterprises</h2>
            <p>Everything your organization needs to learn, adapt, and perform</p>
          </div>
          <div className="grid grid-3 features-grid">
            {FEATURES.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section section">
        <div className="container">
          <div className="section-header text-center">
            <h2>How MindLift Works</h2>
            <p>Deploy programs in days, measure impact in weeks</p>
          </div>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">01</div>
              <h3>Align to Outcomes</h3>
              <p>Define competencies and business goals. We align programs to the metrics that matter.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">02</div>
              <h3>Launch Programs</h3>
              <p>Roll out expert‑led content, live sessions, and practice with built‑in engagement tooling.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">03</div>
              <h3>Measure Impact</h3>
              <p>Track capability growth and tie learning to business outcomes with executive‑ready dashboards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section section">
        <div className="container">
          <div className="section-header text-center">
            <h2>What Our Learners Say</h2>
            <p>Trusted by high‑performing teams across industries</p>
          </div>
          <div className="testimonial-container">
            <div className="testimonial-card card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-content">
                {TESTIMONIALS[currentTestimonial].content}
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {TESTIMONIALS[currentTestimonial].avatar}
                </div>
                <div className="author-info">
                  <h4>{TESTIMONIALS[currentTestimonial].name}</h4>
                  <p>{TESTIMONIALS[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
            <div className="testimonial-dots">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="categories-section section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Explore Categories</h2>
            <p>Discover courses across various domains and skill levels</p>
          </div>
          <div className="categories-grid">
            {[
              { name: 'Technology', icon: '💻', count: '500+ courses' },
              { name: 'Business', icon: '💼', count: '300+ courses' },
              { name: 'Design', icon: '🎨', count: '200+ courses' },
              { name: 'Marketing', icon: '📈', count: '150+ courses' },
              { name: 'Data Science', icon: '📊', count: '250+ courses' },
              { name: 'Leadership', icon: '👥', count: '180+ courses' },
            ].map((category, index) => (
              <div key={index} className="category-card card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.count}</p>
                <Link to="/videos" className="category-link">
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-content card">
            <h2>Ready to Uplevel Your Organization?</h2>
            <p>Start a pilot or talk to our team to design a rollout that fits your goals.</p>
            <div className="cta-actions">
              <Link to="/signup" className="btn btn-primary">
                Get Started Free
              </Link>
              <span className="cta-note">No credit card required • 30-day free trial</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

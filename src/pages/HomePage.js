import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      content: "MindLift transformed my career. The expert-led content and personalized learning path helped me master React in just 3 months.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      content: "The quality of speakers and depth of content is unmatched. Every video provides real value and practical insights.",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      content: "I love how MindLift combines theory with practical applications. The community aspect makes learning so much more engaging.",
      avatar: "ER"
    }
  ];

  const features = [
    {
      icon: "🎓",
      title: "Expert-Led Learning",
      description: "Learn from industry leaders and subject matter experts with decades of real-world experience."
    },
    {
      icon: "📱",
      title: "Flexible Learning",
      description: "Access content anytime, anywhere. Our mobile-responsive platform works perfectly on all devices."
    },
    {
      icon: "🎯",
      title: "Personalized Paths",
      description: "Get customized learning recommendations based on your goals, experience level, and interests."
    },
    {
      icon: "💬",
      title: "Community Support",
      description: "Connect with fellow learners, share insights, and get help from our supportive community."
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and achievement milestones."
    },
    {
      icon: "🏆",
      title: "Skill Validation",
      description: "Earn certificates and badges to showcase your newly acquired skills to employers."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Learners" },
    { number: "1000+", label: "Expert Speakers" },
    { number: "5000+", label: "Video Courses" },
    { number: "95%", label: "Completion Rate" }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className={`hero-text ${isVisible ? 'fade-in-up' : ''}`}>
              <h1>Transform Your Mind,<br />Elevate Your Life</h1>
              <p className="hero-subtitle">
                Unlock your potential with expert-led courses, personalized learning paths,
                and a supportive community that believes in your growth.
              </p>
              <div className="hero-actions">
                <Link to="/signup" className="btn btn-primary">
                  Start Learning Today
                  <span>→</span>
                </Link>
                <Link to="/videos" className="btn btn-outline">
                  Explore Courses
                </Link>
              </div>
              <div className="hero-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-label">{stat.label}</span>
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
                  <p>Transformative Learning</p>
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
            <h2>Why Choose MindLift?</h2>
            <p>Discover the features that make learning with us extraordinary</p>
          </div>
          <div className="grid grid-3 features-grid">
            {features.map((feature, index) => (
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
            <p>Your journey to mastery in three simple steps</p>
          </div>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">01</div>
              <h3>Choose Your Path</h3>
              <p>Select from thousands of expert-led courses tailored to your career goals and interests.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">02</div>
              <h3>Learn at Your Pace</h3>
              <p>Access content anytime, anywhere with our mobile-responsive platform and flexible scheduling.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">03</div>
              <h3>Achieve Mastery</h3>
              <p>Apply your knowledge, earn certificates, and showcase your skills to advance your career.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section section">
        <div className="container">
          <div className="section-header text-center">
            <h2>What Our Learners Say</h2>
            <p>Join thousands of satisfied learners who've transformed their careers</p>
          </div>
          <div className="testimonial-container">
            <div className="testimonial-card card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-content">
                {testimonials[currentTestimonial].content}
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="author-info">
                  <h4>{testimonials[currentTestimonial].name}</h4>
                  <p>{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
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
              { name: "Technology", icon: "💻", count: "500+ courses" },
              { name: "Business", icon: "💼", count: "300+ courses" },
              { name: "Design", icon: "🎨", count: "200+ courses" },
              { name: "Marketing", icon: "📈", count: "150+ courses" },
              { name: "Data Science", icon: "📊", count: "250+ courses" },
              { name: "Leadership", icon: "👥", count: "180+ courses" }
            ].map((category, index) => (
              <div key={index} className="category-card card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.count}</p>
                <Link to="/videos" className="category-link">Explore →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-content card">
            <h2>Ready to Transform Your Career?</h2>
            <p>Join MindLift today and start your journey towards mastery and professional growth.</p>
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

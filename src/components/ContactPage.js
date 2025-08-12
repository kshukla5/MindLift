import React, { useState } from 'react';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your message! We will get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Get in Touch with KANDOR</h1>
          <p>Ready to transform your organization? Let's create a customized corporate training program together.</p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-container">
          <div className="contact-info">
            <div className="info-card">
              <h2>Let's Connect</h2>
              <p>We're here to help you unlock transformation in your organization. Reach out to discuss your training needs, get a quote, or just say hello!</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <h3>Our Office</h3>
                    <p>Staples Studio, 320 North Service RD W</p>
                    <p>Oakville, ON L6M 2R7, CANADA</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div>
                    <h3>Email</h3>
                    <p>rinkal@kandor.in</p>
                    <p>Primary contact for all inquiries</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">🌐</div>
                  <div>
                    <h3>Website</h3>
                    <p>www.kandor.in</p>
                    <p>Visit us for more information</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">🎯</div>
                  <div>
                    <h3>Specialization</h3>
                    <p>Corporate Training & Leadership Development</p>
                    <p>Public Speaking & Personal Development</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <h3>Follow Rinkal Shukla</h3>
                <div className="social-icons">
                  <a href="https://www.facebook.com/rinkalshuklaofficial/" target="_blank" rel="noopener noreferrer" className="social-icon facebook">📘</a>
                  <a href="https://twitter.com/rinkalshukla" target="_blank" rel="noopener noreferrer" className="social-icon twitter">🐦</a>
                  <a href="https://in.linkedin.com/in/rinkal-shukla-51228235" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">💼</a>
                  <a href="https://www.instagram.com/rinkalshuklaofficial/" target="_blank" rel="noopener noreferrer" className="social-icon instagram">📸</a>
                  <a href="https://www.youtube.com/channel/UC5oKlEETVpgeRXB98Uai4Mg" target="_blank" rel="noopener noreferrer" className="social-icon youtube">📺</a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="form-card">
              <h2>Request Corporate Training</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@company.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="company">Company Name *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="service">Training Program of Interest</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option value="">Select a training program...</option>
                    <option value="leadership-development">Leadership Development</option>
                    <option value="personal-development">Personal Development</option>
                    <option value="presentation-skills">Presentation Skills</option>
                    <option value="public-speaking">Public Speaking</option>
                    <option value="team-building">Team Building</option>
                    <option value="custom-program">Custom Corporate Program</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Tell Us About Your Training Needs *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Describe your organization's training needs, team size, goals, and any specific requirements..."
                  ></textarea>
                </div>

                {submitMessage && (
                  <div className="success-message">
                    <span className="success-icon">✅</span>
                    {submitMessage}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Request Training Quote
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="services-showcase">
        <div className="showcase-container">
          <h2>Our Training Programs</h2>
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">👑</div>
              <h3>Leadership Development</h3>
              <p>Cultivate strong leaders within your organization</p>
            </div>
            <div className="service-item">
              <div className="service-icon">🌟</div>
              <h3>Personal Development</h3>
              <p>Transform behavioral habits and personal goals</p>
            </div>
            <div className="service-item">
              <div className="service-icon">📊</div>
              <h3>Presentation Skills</h3>
              <p>Deliver impactful presentations with confidence</p>
            </div>
            <div className="service-item">
              <div className="service-icon">🎤</div>
              <h3>Public Speaking</h3>
              <p>Boost confidence and communication skills</p>
            </div>
            <div className="service-item">
              <div className="service-icon">🤝</div>
              <h3>Team Building</h3>
              <p>Create positive workplace cooperation</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Empower Your Team?</h2>
          <p>Let's discuss how KANDOR can transform your organization with customized training programs</p>
          <div className="cta-buttons">
            <a href="mailto:rinkal@kandor.in" className="btn btn-primary">
              ✉️ Email Us
            </a>
            <a href="https://kandor.in" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              🌐 Visit KANDOR.in
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;

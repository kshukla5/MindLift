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
          <p>Ready to transform your digital presence? Let's create something amazing together.</p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-container">
          <div className="contact-info">
            <div className="info-card">
              <h2>Let's Connect</h2>
              <p>We're here to help you succeed. Reach out to discuss your project, get a quote, or just say hello!</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <h3>Our Office</h3>
                    <p>Ahmedabad, Gujarat, India</p>
                    <p>380001</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div>
                    <h3>Phone</h3>
                    <p>+91 98765 43210</p>
                    <p>Available Mon-Fri, 9 AM - 6 PM IST</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div>
                    <h3>Email</h3>
                    <p>hello@kandor.in</p>
                    <p>contact@kandor.in</p>
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
              </div>

              <div className="social-links">
                <h3>Follow Us</h3>
                <div className="social-icons">
                  <a href="#" className="social-icon linkedin">💼</a>
                  <a href="#" className="social-icon twitter">🐦</a>
                  <a href="#" className="social-icon instagram">📸</a>
                  <a href="#" className="social-icon facebook">📘</a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="form-card">
              <h2>Send us a Message</h2>
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
                      placeholder="your.email@example.com"
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
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="company">Company Name</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="service">Service of Interest</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option value="">Select a service...</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-apps">Mobile App Development</option>
                    <option value="ui-ux-design">UI/UX Design</option>
                    <option value="cloud-solutions">Cloud Solutions</option>
                    <option value="digital-transformation">Digital Transformation</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us about your project, requirements, or any questions you have..."
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
                      Send Message
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
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">🌐</div>
              <h3>Web Development</h3>
              <p>Custom websites and web applications</p>
            </div>
            <div className="service-item">
              <div className="service-icon">📱</div>
              <h3>Mobile Apps</h3>
              <p>iOS and Android applications</p>
            </div>
            <div className="service-item">
              <div className="service-icon">🎨</div>
              <h3>UI/UX Design</h3>
              <p>User-centered design solutions</p>
            </div>
            <div className="service-item">
              <div className="service-icon">☁️</div>
              <h3>Cloud Solutions</h3>
              <p>Scalable cloud infrastructure</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Project?</h2>
          <p>Let's discuss how KANDOR can help transform your digital presence</p>
          <div className="cta-buttons">
            <a href="tel:+919876543210" className="btn btn-primary">
              📞 Call Now
            </a>
            <a href="mailto:hello@kandor.in" className="btn btn-outline">
              ✉️ Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;

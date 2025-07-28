import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us">
      <section id="about-hero" className="about-hero">
        <div className="hero-content">
          <h1>Welcome to MindLift – Powered by KANDOR</h1>
          <p>
            A premium platform where influential voices in leadership, 
            personal development, and motivation unite to inspire transformation. 
            Brought to you by KANDOR, your trusted partner in digital innovation.
          </p>
          <a href="#mission" className="scroll-down">Learn More</a>
        </div>
      </section>

      <section id="founder" className="founder">
        <div className="founder-content">
          <div className="founder-image">
            <div className="image-placeholder">
              <span>👩‍💼</span>
            </div>
          </div>
          <div className="founder-info">
            <h2>Meet Our Founder</h2>
            <h3>Rinkal Shukla</h3>
            <p className="founder-title">Founder & CEO, KANDOR</p>
            <p>
              With a vision to democratize learning and personal development, 
              Rinkal Shukla founded KANDOR to create innovative digital solutions 
              that connect knowledge seekers with world-class educators and speakers.
            </p>
            <p>
              Under her leadership, KANDOR has become a trusted name in digital 
              transformation, helping businesses and individuals achieve their 
              full potential through technology-driven solutions.
            </p>
          </div>
        </div>
      </section>

      <section id="mission" className="mission">
        <h2>Our Mission</h2>
        <p>
          We believe that one idea, one voice, one story – can spark a lifetime
          of change.
        </p>
        <p>
          MindLift exists to bring together influential speakers, trainers,
          coaches, and thinkers from across the globe onto one platform. Our
          mission is to make personal growth and inspiration accessible,
          practical, and deeply transformational.
        </p>
      </section>

      <section id="kandor-services" className="kandor-services">
        <h2>KANDOR Services</h2>
        <p className="services-intro">Beyond MindLift, KANDOR offers comprehensive digital solutions:</p>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🌐</div>
            <h3>Web Development</h3>
            <p>Custom websites and web applications built with cutting-edge technology</p>
          </div>
          <div className="service-card">
            <div className="service-icon">📱</div>
            <h3>Mobile Apps</h3>
            <p>Native and cross-platform mobile applications for iOS and Android</p>
          </div>
          <div className="service-card">
            <div className="service-icon">☁️</div>
            <h3>Cloud Solutions</h3>
            <p>Scalable cloud infrastructure and deployment solutions</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎨</div>
            <h3>UI/UX Design</h3>
            <p>User-centered design solutions that deliver exceptional experiences</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🔧</div>
            <h3>Digital Transformation</h3>
            <p>Complete digital transformation strategies for modern businesses</p>
          </div>
          <div className="service-card">
            <div className="service-icon">��</div>
            <h3>Analytics & Insights</h3>
            <p>Data-driven solutions to help you make informed business decisions</p>
          </div>
        </div>
      </section>

      <section id="offer" className="offer">
        <h2>What We Offer</h2>
        <div className="offer-columns">
          <div className="offer-column">
            <h3>Learners</h3>
            <ul>
              <li>Unlimited access to motivational talks, series, and masterclasses</li>
              <li>Curated content by globally acclaimed speakers</li>
              <li>Personalized learning and progress tracking</li>
              <li>Community features to connect with fellow learners</li>
            </ul>
          </div>
          <div className="offer-column">
            <h3>Speakers</h3>
            <ul>
              <li>A global stage to reach and impact thousands</li>
              <li>Easy content upload and monetization system</li>
              <li>Earn from subscriptions while helping others grow</li>
              <li>Professional dashboard with analytics and insights</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <h2>What Our Clients Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <p>"KANDOR transformed our digital presence completely. Their expertise in web development and user experience is unmatched."</p>
            <cite>— Sarah Johnson, Tech Startup CEO</cite>
          </div>
          <div className="testimonial">
            <p>"Working with Rinkal and the KANDOR team was a game-changer for our business. They delivered beyond expectations."</p>
            <cite>— Michael Chen, E-commerce Director</cite>
          </div>
          <div className="testimonial">
            <p>"The MindLift platform has helped me reach thousands of learners worldwide. The technology is seamless and powerful."</p>
            <cite>— Dr. Amanda Rodriguez, Motivational Speaker</cite>
          </div>
        </div>
      </section>

      <section id="story" className="story">
        <h2>Our Story</h2>
        <p>
          Founded by passionate believers in the power of public speaking and digital innovation,
          MindLift was born from the realization that authentic stories have the
          power to change lives.
        </p>
        <p>
          Backed by KANDOR's expertise in digital transformation, we created more than 
          just a video library — a community, a movement, a shift in the way people 
          learn, grow, and lead in the digital age.
        </p>
      </section>

      <section id="cta" className="cta">
        <h2>Ready to unlock your next breakthrough?</h2>
        <div className="cta-buttons">
          <Link to="/signup?role=speaker" className="btn btn-primary">
            🎙️ Become a Speaker
          </Link>
          <Link to="/signup" className="btn btn-outline">
            🎧 Start Your Journey
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            💼 Partner with KANDOR
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;

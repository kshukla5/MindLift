import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us">
      <section id="about-hero" className="about-hero">
        <div className="hero-content">
          <h1>Welcome to MindLift</h1>
          <p>Empowering minds and inspiring growth.</p>
          <a href="#mission" className="scroll-down">Learn More</a>
        </div>
      </section>

      <section id="mission" className="mission">
        <h2>Our Mission</h2>
        <p>
          To connect learners with motivational speakers and provide a platform
          for personal development.
        </p>
      </section>

      <section id="offer" className="offer">
        <h2>What We Offer</h2>
        <div className="offer-columns">
          <div className="offer-column">
            <h3>Learners</h3>
            <ul>
              <li>Daily motivational videos</li>
              <li>Practical mindset tips</li>
              <li>Community support</li>
            </ul>
          </div>
          <div className="offer-column">
            <h3>Speakers</h3>
            <ul>
              <li>Share your expertise</li>
              <li>Grow your audience</li>
              <li>Engage with learners</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="story" className="story">
        <h2>Our Story</h2>
        <p>
          MindLift began as a small community of growth enthusiasts and has grown
          into a global platform for inspiration.
        </p>
      </section>

      <section id="cta" className="cta">
        <h2>Ready to elevate your journey?</h2>
        <div className="cta-buttons">
          <a href="/signup?role=speaker" className="btn btn-primary">
            Become a Speaker
          </a>
          <a href="/signup" className="btn btn-outline">
            Start Your Journey
          </a>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;

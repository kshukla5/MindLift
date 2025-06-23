import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us">
      <section id="about-hero" className="about-hero">
        <div className="hero-content">
          <h1>Welcome to MindLift – Elevate Your Mindset.</h1>
          <p>
            A premium platform where the world’s top voices in public speaking,
            leadership, and motivation come together to inspire lasting
            transformation.
          </p>
          <a href="#mission" className="scroll-down">Learn More</a>
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

      <section id="offer" className="offer">
        <h2>What We Offer</h2>
        <div className="offer-columns">
          <div className="offer-column">
            <h3>Learners</h3>
            <ul>
              <li>Unlimited access to motivational talks, series, and masterclasses</li>
              <li>Curated content by globally acclaimed speakers</li>
              <li>Personalized learning and progress tracking</li>
            </ul>
          </div>
          <div className="offer-column">
            <h3>Speakers</h3>
            <ul>
              <li>A global stage to reach and impact thousands</li>
              <li>Easy content upload and monetization system</li>
              <li>Earn from subscriptions while helping others grow</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="story" className="story">
        <h2>Our Story</h2>
        <p>
          Founded by passionate believers in the power of public speaking,
          MindLift was born from the realization that authentic stories have the
          power to change lives.
        </p>
        <p>
          We wanted to create more than just a video library — a community, a
          movement, a shift in the way people learn, grow, and lead.
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
        </div>
      </section>
    </div>
  );
}

export default AboutUs;

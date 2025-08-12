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
            Brought to you by KANDOR Leadership Training Inc., your trusted partner in corporate training.
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
            <p className="founder-title">Founder & CEO, KANDOR Leadership Training Inc.</p>
            <p>
              Rinkal Shukla is a qualified Chartered Financial Analyst (CFA Level 2) and an MBA graduate from Gujarat 
              University. She has also earned the distinction of securing first rank in public speaking under the 
              guidance of Dipti Shah Public Speaking.
            </p>
            <p>
              As one of the leading motivational speakers & corporate trainers in India, Rinkal Shukla guides 
              organizations through precise implementation of planning & strategies. Together, we can achieve 
              our dreams and transform the future.
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
        <p className="services-intro">Create a strong & motivated workforce with our ONLINE & OFFLINE training programs:</p>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">👑</div>
            <h3>Leadership Development</h3>
            <p>Define leadership competencies and empower the potential talent, to cultivate a generation of strong leaders within an organization.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🌟</div>
            <h3>Personal Development</h3>
            <p>Transform the way you manage your personal development goals and control how others perceive you by cultivating behavioral habits.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">📊</div>
            <h3>Presentation Skills</h3>
            <p>Effective presentation skills are essential for clear communication, whether in business, education, or any public setting. This vital skill provides tools, tips, and techniques for delivering impactful presentations with confidence.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎤</div>
            <h3>Public Speaking</h3>
            <p>Revamp your personality with Communication, Presentation and Public Speaking techniques which boosts confidence and impression.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🤝</div>
            <h3>Team Building</h3>
            <p>Boost coherence & cooperation within your team to create a positive work place, improve productivity and achieve objectives.</p>
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
            <p>"We are immensely thankful to KANDOR Institute for imparting some valuable skills during our training program. The workshop on public speaking & Time management was received very well by the participants and the trainer Ms. Rinkal Shukla was able to communicate her message across to the participants successfully."</p>
            <cite>— Jeet Parekh</cite>
          </div>
          <div className="testimonial">
            <p>"With great energy and knowledge about the training industry, Ms Rinkal shukla has changed the overall thought process of our employees. We have gone through 12 sessions and i must say it has changed the way we think and our approach towards other things."</p>
            <cite>— Kunjal Shukla & Karan Bhatt</cite>
          </div>
          <div className="testimonial">
            <p>"The sessions were a perfect mixture of theoretical and practical knowledge imparting towards increasing confidence and motivation in our employees. We thank Ms Rinkal Shukla for this wonderful experience."</p>
            <cite>— Corporate Training Participant</cite>
          </div>
        </div>
      </section>

      <section id="story" className="story">
        <h2>Our Story</h2>
        <p>
          Founded by passionate believers in the power of public speaking and leadership development,
          MindLift was born from the realization that authentic stories have the
          power to change lives.
        </p>
        <p>
          Backed by KANDOR's expertise in corporate training and personal development, we created more than 
          just a video library — a community, a movement, a shift in the way people 
          learn, grow, and lead in their personal and professional lives.
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
            💼 Corporate Training
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;

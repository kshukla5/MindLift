import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import VideoGrid from '../components/VideoGrid';
import './HomePage.css';

// --- Image placeholders (Unsplash) ---
const HERO_IMAGE = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60';
const CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1484820549410-0fc09f744962?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1581094651181-35942459ef62?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1532619187608-e5375cab36aa?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=60'
];

function Stat({ value, label }) {
  return (
    <div className="hp-stat">
      <div className="hp-stat-value">{value}</div>
      <div className="hp-stat-label">{label}</div>
    </div>
  );
}

function Testimonial({ quote, name, role }) {
  return (
    <div className="hp-testimonial">
      <p className="hp-testimonial-quote">"{quote}"</p>
      <div className="hp-testimonial-meta">
        <span className="hp-testimonial-name">{name}</span>
        <span className="hp-testimonial-role">{role}</span>
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'MindLift – Elevate Your Potential';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'MindLift delivers curated video learning for growth: leadership, habits, productivity, mindfulness and more – free and focused.');
    }
  }, []);

  const featureColumns = [
    { icon: '🎯', title: 'Curated Quality', desc: 'Only high‑impact content – signal over noise.' },
    { icon: '🧠', title: 'Science-Informed', desc: 'Behavioral & cognitive research guides selection.' },
    { icon: '📓', title: 'Personal Library', desc: 'Bookmark & re-engage to reinforce learning.' },
    { icon: '🤝', title: 'Community Momentum', desc: 'Progress accelerates when shared.' }
  ];

  const categories = ['Leadership','Mindfulness','Productivity','Neuroscience','Habits','Communication'];

  const testimonials = [
    { quote: 'MindLift became my daily warm‑up for deep work sessions.', name: 'Alex P.', role: 'Product Designer' },
    { quote: 'Replaced random scrolling with intentional growth – huge shift.', name: 'Sara K.', role: 'Engineer' },
    { quote: 'The curation saves me hours. Always relevant.', name: 'James R.', role: 'Founder' }
  ];

  const steps = [
    { num: '01', title: 'Create Account', desc: 'Under a minute. No card.' },
    { num: '02', title: 'Pick Interests', desc: 'Tailor streams to goals.' },
    { num: '03', title: 'Build Momentum', desc: 'Return & track progress.' }
  ];

  return (
    <div className="home-root">
      {/* HERO */}
      <section className="hp-hero">
        <div className="hp-hero-content">
          <h1 className="hp-hero-title">Elevate Your Potential</h1>
          <p className="hp-hero-sub">Focused, distraction‑free video learning for ambitious minds.</p>
          <div className="home-btn-group hp-hero-actions">
            <button className="home-btn-primary" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}>
              {isAuthenticated ? 'Go to Dashboard' : 'Start Free'}
            </button>
            <button className="home-btn-secondary" onClick={() => navigate('/features')}>How It Works</button>
          </div>
          <div className="hp-trust-text">Free forever • No ads • No clutter</div>
        </div>
        <div className="hp-hero-media">
          <div className="hp-hero-image-wrap">
            <img src={HERO_IMAGE} alt="Focused learner" loading="lazy" />
          </div>
          <div className="hp-hero-float-card">
            <div className="hp-float-metric">+2.3x</div>
            <div className="hp-float-label">Session depth</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="hp-stats-band" aria-label="Platform statistics">
        <div className="hp-stats-grid">
          <Stat value="12k+" label="Active Learners" />
            <Stat value="1.8k" label="Curated Videos" />
          <Stat value="96%" label="Return Weekly" />
          <Stat value="0$" label="Always Free" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="hp-section">
        <header className="hp-section-header">
          <h2 className="hp-section-title">Why MindLift Works</h2>
          <p className="hp-section-sub">Designed for clarity, retention & sustainable growth.</p>
        </header>
        <div className="hp-features-grid">
          {featureColumns.map(f => (
            <div key={f.title} className="hp-feature">
              <div className="hp-feature-icon" aria-hidden>{f.icon}</div>
              <h3 className="hp-feature-title">{f.title}</h3>
              <p className="hp-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="hp-section">
        <header className="hp-section-header">
          <h2 className="hp-section-title">Explore Focus Areas</h2>
          <p className="hp-section-sub">Choose domains to accelerate targeted skill growth.</p>
        </header>
        <div className="hp-categories-grid">
          {categories.map((cat, i) => (
            <div key={cat} className="hp-category-card">
              <div className="hp-category-media">
                <img src={CATEGORY_IMAGES[i]} alt={cat + ' category'} loading="lazy" />
              </div>
              <div className="hp-category-label">{cat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST VIDEOS */}
      <section className="hp-section hp-alt-bg">
        <header className="hp-section-header hp-section-header-row">
          <div>
            <h2 className="hp-section-title">Latest Videos</h2>
            <p className="hp-section-sub">Fresh perspectives added weekly.</p>
          </div>
          <button
            className="home-btn-secondary hp-small-btn"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
          >
            {isAuthenticated ? 'View Library' : 'Explore Library'}
          </button>
        </header>
        <VideoGrid limit={6} />
      </section>

      {/* HOW IT WORKS */}
      <section className="hp-section">
        <header className="hp-section-header">
          <h2 className="hp-section-title">Simple Onboarding</h2>
          <p className="hp-section-sub">Momentum in minutes – not hours of setup.</p>
        </header>
        <div className="hp-steps-grid">
          {steps.map(s => (
            <div key={s.num} className="hp-step-card">
              <div className="hp-step-num">{s.num}</div>
              <h3 className="hp-step-title">{s.title}</h3>
              <p className="hp-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="hp-section hp-alt-bg">
        <header className="hp-section-header">
          <h2 className="hp-section-title">What Learners Say</h2>
          <p className="hp-section-sub">Impact that compounds over time.</p>
        </header>
        <div className="hp-testimonials-grid">
          {testimonials.map(t => <Testimonial key={t.name} {...t} />)}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="hp-final-cta" aria-labelledby="final-cta-title">
        <div className="hp-final-cta-inner">
          <h2 id="final-cta-title" className="hp-final-title">Build Your Personal Growth Engine</h2>
          <p className="hp-final-sub">Join a focused environment optimized for depth, not distraction.</p>
          <div className="hp-final-actions">
            <button className="home-btn-primary hp-final-btn" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}>
              {isAuthenticated ? 'Continue Learning' : 'Create Free Account'}
            </button>
            <button className="home-btn-secondary hp-final-btn" onClick={() => navigate('/features')}>See Features</button>
          </div>
          <div className="hp-final-foot">No paywalls • Cancel anytime • Own your data</div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

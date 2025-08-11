import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';
import { connectSocket } from '../services/socket';
import API_URL from '../api';

// Safe decode to avoid runtime errors on malformed tokens
function safeDecodeJWT(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload || {};
  } catch (e) {
    console.warn('Failed to decode JWT payload:', e);
    return {};
  }
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        let errorMessage = `Login failed with status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // non-JSON error
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      connectSocket(data.token);

      // Decode token to get role for redirection (safely)
      const payload = safeDecodeJWT(data.token);

      // Role-based redirection
      if (payload.role === 'speaker') {
        navigate('/speaker');
      } else if (payload.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      window.location.reload(); // To ensure all components re-render with new auth state

    } catch (err) {
      setError(err.message || 'Unable to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="registration-container compact">
        {/* Left Panel - Branding */}
        <div className="brand-panel">
          <div className="brand-content">
            <div className="brand-logo">
              <span className="logo-icon" aria-hidden="true">&#x1F9E0;</span>
              <h1>MindLift</h1>
            </div>
            <p className="brand-tagline">Transform your mindset. Elevate your life.</p>
            <div className="features-list compact-features">
              <div className="feature-item">
                <span className="feature-icon" aria-hidden="true">&#x2728;</span>
                <span>Expert-led content</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon" aria-hidden="true">&#x1F3AF;</span>
                <span>Personalized journey</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon" aria-hidden="true">&#x1F680;</span>
                <span>Proven results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="form-panel">
          <div className="form-container">
            <div className="form-header tight">
              <h2>Welcome back</h2>
              <p>Log in to continue your journey</p>
            </div>

            {error && (
              <div className="error-alert" role="alert">
                <span className="alert-icon" aria-hidden="true">&#x26A0;</span>
                <span>{error}</span>
              </div>
            )}

            <form className="registration-form compact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((s) => !s)}
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" className="create-btn" disabled={isLoading} aria-busy={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner" aria-hidden="true"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    Log In
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>

              <div className="form-footer">
                <p>
                  Don’t have an account?{' '}
                  <Link to="/signup" className="login-link">Create one</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

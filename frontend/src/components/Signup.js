import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './AuthForm.css';
import { connectSocket } from '../services/socket';
import API_URL from '../api';

function Signup() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'subscriber';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: 'Weak', color: '#ef4444' };
      case 2: return { text: 'Fair', color: '#f97316' };
      case 3: return { text: 'Good', color: '#eab308' };
      case 4:
      case 5: return { text: 'Strong', color: '#22c55e' };
      default: return { text: '', color: '' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (passwordStrength < 2) {
      setError('Please choose a stronger password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role
        }),
      });

      if (!res.ok) {
        let errorMessage = `Signup failed with status: ${res.status}`;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          console.error("Received a non-JSON response from the server. This is often a proxy issue.");
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      connectSocket(data.token);

      // Role-based redirection on signup
      if (formData.role === 'speaker') {
        navigate('/speaker');
      } else {
        navigate('/dashboard');
      }
      window.location.reload(); // To ensure all components re-render with new auth state
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const strengthIndicator = getPasswordStrengthText();

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Join MindLift!</h1>
          <p>Create your account and start your transformation journey</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>🚀 Create Your Account</h2>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-container">
              <span className="input-icon">👤</span>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <span className="input-icon">📧</span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">I want to join as</label>
            <div className="role-selector">
              <label className={`role-option ${formData.role === 'subscriber' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="subscriber"
                  checked={formData.role === 'subscriber'}
                  onChange={handleChange}
                />
                <div className="role-content">
                  <span className="role-icon">🎧</span>
                  <div>
                    <strong>Learner</strong>
                    <p>Access premium content and courses</p>
                  </div>
                </div>
              </label>
              
              <label className={`role-option ${formData.role === 'speaker' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="speaker"
                  checked={formData.role === 'speaker'}
                  onChange={handleChange}
                />
                <div className="role-content">
                  <span className="role-icon">🎤</span>
                  <div>
                    <strong>Speaker</strong>
                    <p>Share your knowledge and expertise</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: strengthIndicator.color
                    }}
                  ></div>
                </div>
                <span style={{ color: strengthIndicator.color }}>
                  {strengthIndicator.text}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-container">
              <span className="input-icon">🔐</span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              {formData.confirmPassword && (
                <span className={`match-indicator ${formData.password === formData.confirmPassword ? 'match' : 'no-match'}`}>
                  {formData.password === formData.confirmPassword ? '✅' : '❌'}
                </span>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                <span>🎉</span>
                Create Account
              </>
            )}
          </button>

          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
            <p className="terms-text">
              By creating an account, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;

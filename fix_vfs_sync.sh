#!/bin/bash

# Fix VFS vs Local File Sync Issues - Permanent Solution
# This script syncs the professional registration design to local files

echo "🔧 Fixing VFS vs Local File Sync Issues..."
echo "📁 Working Directory: $(pwd)"

# Check if we're in the right directory
if [ ! -d "frontend/src/components" ]; then
    echo "❌ Error: Not in MindLift root directory"
    echo "Please run this script from the MindLift root directory"
    exit 1
fi

echo "✅ Found frontend/src/components directory"

# Backup existing files
echo "💾 Creating backups..."
cp frontend/src/components/Signup.js frontend/src/components/Signup.js.backup 2>/dev/null || echo "No existing Signup.js to backup"
cp frontend/src/components/AuthForm.css frontend/src/components/AuthForm.css.backup 2>/dev/null || echo "No existing AuthForm.css to backup"

# Create professional Signup.js
echo "📝 Creating professional Signup.js..."
cat > frontend/src/components/Signup.js << 'SIGNUP_EOF'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';
import { connectSocket } from '../services/socket';
import API_URL from '../api';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('subscriber');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

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

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
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
        body: JSON.stringify({ name, email, password, role }),
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
      if (role === 'speaker') {
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
      <div className="registration-container">
        {/* Left Panel - Branding */}
        <div className="brand-panel">
          <div className="brand-content">
            <div className="brand-logo">
              <span className="logo-icon">🧠</span>
              <h1>MindLift</h1>
            </div>
            <p className="brand-tagline">Transform your mindset. Elevate your life.</p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span>Expert-led content</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Personalized journey</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span>Proven results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Registration Form */}
        <div className="form-panel">
          <div className="form-container">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Join thousands transforming their lives</p>
            </div>

            {error && (
              <div className="error-alert">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            <form className="registration-form" onSubmit={handleSubmit}>
              {/* Name & Email Row */}
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="form-field">
                <label>Join as</label>
                <div className="role-tabs">
                  <button
                    type="button"
                    className={`role-tab ${role === 'subscriber' ? 'active' : ''}`}
                    onClick={() => setRole('subscriber')}
                    disabled={isLoading}
                  >
                    <span className="role-icon">🎧</span>
                    Learner
                  </button>
                  <button
                    type="button"
                    className={`role-tab ${role === 'speaker' ? 'active' : ''}`}
                    onClick={() => setRole('speaker')}
                    disabled={isLoading}
                  >
                    <span className="role-icon">🎤</span>
                    Speaker
                  </button>
                </div>
              </div>

              {/* Password Row */}
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="password">Password</label>
                  <div className="password-input">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {password && (
                    <div className="strength-indicator">
                      <div 
                        className="strength-bar"
                        style={{
                          width: `${(passwordStrength / 5) * 100}%`,
                          backgroundColor: strengthIndicator.color
                        }}
                      ></div>
                      <span className="strength-text" style={{ color: strengthIndicator.color }}>
                        {strengthIndicator.text}
                      </span>
                    </div>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="confirmPassword">Confirm</label>
                  <div className="password-input">
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    {confirmPassword && (
                      <span className={`match-icon ${password === confirmPassword ? 'match' : 'no-match'}`}>
                        {password === confirmPassword ? '✅' : '❌'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button type="submit" className="create-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>

              <div className="form-footer">
                <p>Already have an account? <Link to="/login" className="login-link">Sign in</Link></p>
                <p className="terms">By signing up, you agree to our <a href="/terms">Terms</a> & <a href="/privacy">Privacy Policy</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
SIGNUP_EOF

echo "✅ Professional Signup.js created"
echo "🎉 SUCCESS! Professional registration design applied!"

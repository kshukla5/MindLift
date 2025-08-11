import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';
import { connectSocket } from '../services/socket';
import API_URL from '../api';

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
      console.log("API_URL:", API_URL);
      console.log("Full URL:", `${API_URL}/api/login`);
      
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        let errorMessage = `Login failed with status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error("Received a non-JSON error response from the server.");
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      connectSocket(data.token);

      // Decode token to get role for redirection
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      
      // Role-based redirection
      if (payload.role === 'speaker') {
        navigate('/speaker');
      } else if (payload.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      window.location.reload(); // To ensure all components re-render with new auth state
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    const demoAccounts = {
      learner: { email: 'demo@learner.com', password: 'demo123' },
      speaker: { email: 'demo@speaker.com', password: 'demo123' },
      admin: { email: 'demo@admin.com', password: 'demo123' }
    };
    
    const account = demoAccounts[role];
    setEmail(account.email);
    setPassword(account.password);
    
    // Auto-submit after a brief delay
    setTimeout(() => {
      document.querySelector('.auth-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back!</h1>
          <p>Sign in to continue your learning journey with MindLift</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>🔐 Login to Your Account</h2>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <span className="input-icon">📧</span>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Signing In...
              </>
            ) : (
              <>
                <span>🚀</span>
                Sign In
              </>
            )}
          </button>

          <div className="form-divider">
            <span>or try a demo account</span>
          </div>

          <div className="demo-accounts">
            <button
              type="button"
              className="demo-btn learner"
              onClick={() => handleDemoLogin('learner')}
              disabled={isLoading}
            >
              <span>🎧</span>
              Demo Learner
            </button>
            <button
              type="button"
              className="demo-btn speaker"
              onClick={() => handleDemoLogin('speaker')}
              disabled={isLoading}
            >
              <span>🎤</span>
              Demo Speaker
            </button>
            <button
              type="button"
              className="demo-btn admin"
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
            >
              <span>👑</span>
              Demo Admin
            </button>
          </div>

          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/signup">Create Account</Link>
            </p>
            <p>
              <Link to="/forgot-password">Forgot your password?</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

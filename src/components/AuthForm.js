import React from 'react';
import { Link } from 'react-router-dom';
import './AuthForm.css';

const AuthForm = ({ type, formData, setFormData, onSubmit, loading, error }) => {
  const isLogin = type === 'login';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-container">
        <div className="auth-header-content">
          <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Your Account'}</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to continue your journey.' : 'Join MindLift to start learning.'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="auth-form-container">
          {error && <div className="auth-error-message">{error}</div>}

          {!isLogin && (
            <div className="form-group-auth">
              <label htmlFor="role">I am a...</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="auth-input"
              >
                <option value="learner">Learner</option>
                <option value="speaker">Speaker</option>
              </select>
            </div>
          )}

          {!isLogin && (
            <div className="form-group-auth">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="auth-input"
                placeholder="e.g. John Doe"
              />
            </div>
          )}

          <div className="form-group-auth">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="auth-input"
              placeholder="e.g. john.doe@example.com"
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="auth-input"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="form-group-auth">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="auth-input"
                placeholder="••••••••"
              />
            </div>
          )}

          <button type="submit" className="auth-submit-button" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer-content">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <Link to={isLogin ? '/signup' : '/login'} className="auth-link">
              {isLogin ? ' Sign Up' : ' Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

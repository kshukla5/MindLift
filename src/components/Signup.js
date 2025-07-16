import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';
import { connectSocket } from '../services/socket';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('learner');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/signup', {
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

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={isLoading}
          >
            <option value="learner">Learner</option>
            <option value="speaker">Speaker</option>
          </select>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className="footer-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
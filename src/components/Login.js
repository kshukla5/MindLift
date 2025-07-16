import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';
import { connectSocket } from '../services/socket';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <p className="footer-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
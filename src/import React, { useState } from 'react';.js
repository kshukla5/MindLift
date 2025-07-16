import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';
import { connectSocket } from '../services/socket';

function Signup() {
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
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
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
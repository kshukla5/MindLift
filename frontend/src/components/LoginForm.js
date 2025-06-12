import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../api';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setMessage('Login success');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setMessage(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Log In</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default LoginForm;

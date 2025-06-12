import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', { email, password });
      setMessage(`Login success: ${res.data.token}`);
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

import React, { useState } from 'react';

function RegisterForm({ setToken, switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={register}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Register</button>
      </form>
      <p>
        Have an account? <button onClick={switchToLogin}>Login here</button>
      </p>
    </div>
  );
}

export default RegisterForm;

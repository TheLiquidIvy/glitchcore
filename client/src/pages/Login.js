import React, { useState } from 'react';
import '../styles/Login.css';

const USERS = {
  'admin@glitchcore.shop': { password: 'admin', role: 'admin', name: 'Admin User' },
  'user@glitchcore.shop': { password: 'user', role: 'user', name: 'Test User' },
};

function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@glitchcore.shop');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = USERS[email];
    if (!user) {
      setError('User not found');
      return;
    }

    if (user.password !== password) {
      setError('Incorrect password');
      return;
    }

    onLogin({ email, role: user.role, name: user.name });
  };

  const quickLogin = (userEmail) => {
    const user = USERS[userEmail];
    setEmail(userEmail);
    setPassword(user.password);
    setTimeout(() => {
      onLogin({ email: userEmail, role: user.role, name: user.name });
    }, 100);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="glitch" data-text="GL!TCHCORE LOGIN">GL!TCHCORE LOGIN</h1>
          <p className="login-subtitle">[ ACCESSING SECURE PORTAL ]</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          {error && <div className="error-message">ERROR: {error}</div>}

          <button type="submit" className="login-btn">AUTHENTICATE</button>
        </form>

        <div className="demo-section">
          <h3>DEMO CREDENTIALS</h3>
          <p className="demo-note">[ Proof of Concept - Quick Login Available ]</p>
          
          <button 
            type="button" 
            className="demo-btn admin-demo"
            onClick={() => quickLogin('admin@glitchcore.shop')}
          >
            👤 ADMIN LOGIN
            <span className="credential-hint">admin@glitchcore.shop / admin</span>
          </button>

          <button 
            type="button" 
            className="demo-btn user-demo"
            onClick={() => quickLogin('user@glitchcore.shop')}
          >
            🛍️ USER LOGIN
            <span className="credential-hint">user@glitchcore.shop / user</span>
          </button>
        </div>

        <div className="login-info">
          <p>[ SECURE AUTHENTICATION SYSTEM ]</p>
          <p>Current Credentials: {email} / {password}</p>
          <p className="glitch-text" data-text="STATUS: READY">STATUS: READY</p>
        </div>
      </div>
    </div>
  );
}

export default Login;

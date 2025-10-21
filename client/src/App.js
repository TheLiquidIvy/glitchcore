// client/src/App.js
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PodDraftsManager from './components/PodDraftsManager';

// ... (AuthForm and RegisterForm functions as provided in your input) ...
function AuthForm({ setToken, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={login}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        No account? <button onClick={switchToRegister}>Register here</button>
      </p>
    </div>
  );
}

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
// -------------------------------------------------------------------

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [view, setView] = useState('login'); // login, register, dashboard

  useEffect(() => {
    if (token) setView('dashboard');
    else setView('login');
  }, [token]);

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken('');
    setView('login');
  };

  if (view === 'login') return <AuthForm setToken={setToken} switchToRegister={() => setView('register')} />;
  if (view === 'register') return <RegisterForm setToken={setToken} switchToLogin={() => setView('login')} />;
  if (view === 'dashboard')
    return (
      <div>
        <button onClick={logout}>Logout</button>
        <Dashboard token={token} />
        <hr />
        <PodDraftsManager token={token} />
      </div>
    );

  return null;
}

export default App;

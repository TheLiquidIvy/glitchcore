import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

// Import existing components
import Dashboard from './components/Dashboard';
import PodDraftsManager from './components/PodDraftsManager';

// Import new components
import AuthForm from './components/AuthForm';
import RegisterForm from './components/RegisterForm';
import Home from './components/Home';
import About from './components/About';
import Blog from './components/Blog';
import BlogPostDetail from './components/BlogPostDetail';
import BlogAdmin from './components/BlogAdmin'; // Your admin panel

// This is a helper component to handle the login/register view switching
function AuthPage({ setToken }) {
  const [view, setView] = useState('login'); // 'login' or 'register'
  
  if (view === 'login') {
    return <AuthForm setToken={setToken} switchToRegister={() => setView('register')} />;
  } else {
    return <RegisterForm setToken={setToken} switchToLogin={() => setView('login')} />;
  }
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken('');
    // We don't need to force navigation here, the protected routes will handle it.
  };

  return (
    <Router>
      <header style={headerStyle}>
        <h1>My Culture Shop</h1>
        <nav>
          <Link to="/" style={linkStyle}>Home</Link> |{' '}
          <Link to="/about" style={linkStyle}>About</Link> |{' '}
          <Link to="/blog" style={linkStyle}>Blog</Link> |{' '}
          {token ? (
            <>
              <Link to="/dashboard" style={linkStyle}>Dashboard</Link> |{' '}
              <Link to="/admin/blog" style={linkStyle}>Blog Admin</Link> |{' '}
              <button onClick={logout} style={buttonStyle}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={linkStyle}>Login</Link>
          )}
        </nav>
      </header>

      <main style={{ padding: '20px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />

          {/* Auth Routes */}
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <AuthPage setToken={setToken} />} />
          {/* Note: /register isn't a direct route anymore, it's handled by AuthPage */}

          {/* Protected Routes */}
          <Route path="/dashboard" element={token ? (
            <>
              <Dashboard token={token} />
              <hr />
              <PodDraftsManager token={token} />
            </>
          ) : (
            <Navigate to="/login" />
          )} />
          
          <Route path="/admin/blog" element={token ? (
             <BlogAdmin token={token} />
          ) : (
            <Navigate to="/login" />
          )} />
          
        </Routes>
      </main>

      <footer style={footerStyle}>
        &copy; {new Date().getFullYear()} My Culture Shop. All rights reserved.
      </footer>
    </Router>
  );
}

// Styles
const headerStyle = {
  background: '#222',
  color: 'white',
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};
const linkStyle = {
  color: 'lightblue',
  textDecoration: 'none',
  margin: '0 5px'
};
const buttonStyle = {
  background: 'transparent',
  border: '1px solid lightblue',
  color: 'lightblue',
  cursor: 'pointer',
  fontSize: '1em',
  padding: '2px 8px',
  borderRadius: '4px'
};
const footerStyle = {
  textAlign: 'center',
  padding: '20px',
  fontSize: '0.8em',
  background: '#f5f5f5',
  color: '#333',
  marginTop: '40px',
};

export default App;

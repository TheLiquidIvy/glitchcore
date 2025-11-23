import React, { useState } from 'react';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const navigateTo = (page, productId = null) => {
    setCurrentPage(page);
    if (productId) setSelectedProductId(productId);
    window.scrollTo(0, 0);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setCartCount(0);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return user.role === 'admin' 
          ? <AdminDashboard user={user} onNavigate={navigateTo} onLogout={handleLogout} />
          : <UserDashboard user={user} onNavigate={navigateTo} onLogout={handleLogout} cartCount={cartCount} />;
      case 'home':
        return <Home onNavigate={navigateTo} />;
      case 'products':
        return <Products onNavigate={navigateTo} onProductClick={() => setCartCount(cartCount + 1)} />;
      case 'product-detail':
        return <ProductDetail productId={selectedProductId} onNavigate={navigateTo} onAddToCart={() => setCartCount(cartCount + 1)} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="app">
      <header className="cyberpunk-header">
        <button className="logo-link" onClick={() => navigateTo('home')}>
          <div className="logo">GL!TCHCORE</div>
        </button>
        <nav role="navigation" aria-label="Primary Navigation">
          <ul>
            <li><button onClick={() => navigateTo('home')}>Home</button></li>
            <li><button onClick={() => navigateTo('products')}>Products</button></li>
            <li><button onClick={() => navigateTo('contact')}>Contact</button></li>
          </ul>
        </nav>
        <div className="cart-indicator">
          <div className="user-status">
            <span className="user-badge">👤 {user.name}</span>
            <button className="dashboard-link" onClick={() => navigateTo('dashboard')}>DASHBOARD</button>
          </div>
          <button className="snipcart-checkout" aria-label="Open Shopping Cart">
            CART ({cartCount})
          </button>
        </div>
      </header>

      <main className="main-content">
        {renderPage()}
      </main>

      <footer className="cyberpunk-footer">
        <p>© 2024 Glitchcore Cyberpunk Store. All rights reserved.</p>
        <p>Contact us: <a href="mailto:support@glitchcore.store">support@glitchcore.store</a></p>
        <p className="footer-slogan">[ ENTER THE GLITCH ] // {'{'} FUTURE.NOW {'}'}</p>
      </footer>
    </div>
  );
}

export default App;

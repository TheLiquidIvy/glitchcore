import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './styles/themes.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WishlistPage from './pages/WishlistPage';
import CartReminder from './components/CartReminder';
import Toast from './components/Toast';
import ToastContainer from './components/ToastContainer';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCartReminder, setShowCartReminder] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState('');
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('glitchcoreTheme') || 'neon-dark';
  });
  const toastIdRef = useRef(0);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('glitchcoreTheme', theme);
  }, [theme]);

  const navigateTo = (page, productId = null) => {
    if (page === 'dashboard' && !user) {
      handlePageTransition('login');
      return;
    }
    handlePageTransition(page, productId);
  };

  const handlePageTransition = (page, productId = null) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      if (productId) setSelectedProductId(productId);
      window.scrollTo(0, 0);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    handlePageTransition('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    handlePageTransition('home');
    setCartCount(0);
  };

  const handleProductAdded = (productName) => {
    setCartCount(cartCount + 1);
    setLastAddedItem(productName);
    setShowCartReminder(true);
    addToast(`${productName} added to cart! 🛒`, 'success');
  };

  const addToast = (message, type = 'success') => {
    const id = toastIdRef.current++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return user?.role === 'admin' 
          ? <AdminDashboard user={user} onNavigate={navigateTo} onLogout={handleLogout} cartCount={cartCount} />
          : <UserDashboard user={user} onNavigate={navigateTo} onLogout={handleLogout} cartCount={cartCount} />;
      case 'home':
        return <Home onNavigate={navigateTo} />;
      case 'products':
        return <Products onNavigate={navigateTo} onProductClick={handleProductAdded} />;
      case 'product-detail':
        return <ProductDetail productId={selectedProductId} onNavigate={navigateTo} onAddToCart={handleProductAdded} />;
      case 'cart':
        return <Cart onNavigate={navigateTo} />;
      case 'wishlist':
        return <WishlistPage onNavigate={navigateTo} onAddToCart={handleProductAdded} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={navigateTo} addToast={addToast} />;
    }
  };

  // Show login page without header/footer
  if (currentPage === 'login') {
    return (
      <div className={`login-wrapper ${isTransitioning ? 'transitioning-out' : 'transitioning-in'}`}>
        {renderPage()}
      </div>
    );
  }

  return (
    <div className="app">
      <CartReminder 
        isVisible={showCartReminder} 
        itemName={lastAddedItem}
        onClose={() => setShowCartReminder(false)}
      />

      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>

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
        <ThemeToggle theme={theme} onThemeChange={setTheme} />
        <div className="cart-indicator">
          {user ? (
            <div className="user-status">
              <span className="user-badge">👤 {user.name}</span>
              <button className="dashboard-link" onClick={() => navigateTo('dashboard')}>DASHBOARD</button>
            </div>
          ) : (
            <button className="login-header-btn" onClick={() => navigateTo('login')}>LOGIN</button>
          )}
          <button className="snipcart-checkout" aria-label="Open Shopping Cart" onClick={() => navigateTo('cart')}>
            CART ({cartCount})
          </button>
        </div>
      </header>

      <main className={`main-content ${isTransitioning ? 'transitioning' : ''}`}>
        {renderPage()}
      </main>

      <footer className="cyberpunk-footer">
        <p>© 2024 Glitchcore Cyberpunk Store. All rights reserved.</p>
        <p>Contact us: <a href="mailto:support@glitchcore.store">support@glitchcore.store</a></p>
        <p className="footer-slogan">[ ENTER THE GLITCH ] // FUTURE.NOW</p>
      </footer>
    </div>
  );
}

export default App;

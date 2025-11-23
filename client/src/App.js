import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const navigateTo = (page, productId = null) => {
    setCurrentPage(page);
    if (productId) setSelectedProductId(productId);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
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

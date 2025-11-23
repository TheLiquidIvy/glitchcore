import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <Router>
      <div className="app">
        <header className="cyberpunk-header">
          <Link to="/" className="logo-link">
            <div className="logo">GL!TCHCORE</div>
          </Link>
          <nav role="navigation" aria-label="Primary Navigation">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
          <div className="cart-indicator">
            <button className="snipcart-checkout" aria-label="Open Shopping Cart">
              CART ({cartCount})
            </button>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products onProductClick={() => setCartCount(cartCount + 1)} />} />
            <Route path="/product/:id" element={<ProductDetail onAddToCart={() => setCartCount(cartCount + 1)} />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="cyberpunk-footer">
          <p>© 2024 Glitchcore Cyberpunk Store. All rights reserved.</p>
          <p>Contact us: <a href="mailto:support@glitchcore.store">support@glitchcore.store</a></p>
          <p className="footer-slogan">[ ENTER THE GLITCH ] // {'{'} FUTURE.NOW {'}'}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

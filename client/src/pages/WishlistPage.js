import React, { useState } from 'react';
import '../styles/WishlistPage.css';

const WishlistPage = ({ onNavigate, onAddToCart }) => {
  const [wishlist] = useState([
    { id: 1, name: 'Neon Headphones', price: 149.99, emoji: '🎧', inStock: true },
    { id: 2, name: 'Cybernetic Jacket', price: 299.99, emoji: '🧥', inStock: true },
    { id: 3, name: 'Neural Interface Watch', price: 199.99, emoji: '⌚', inStock: false },
  ]);

  const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="wishlist-page">
      <button className="back-button" onClick={() => onNavigate('dashboard')}>← BACK TO DASHBOARD</button>

      <div className="wishlist-header">
        <h1 className="glitch" data-text="MY WISHLIST">MY WISHLIST</h1>
        <p className="wishlist-count">{wishlist.length} ITEMS • ${totalValue.toFixed(2)} TOTAL VALUE</p>
      </div>

      {wishlist.length > 0 ? (
        <div className="wishlist-container">
          <div className="wishlist-grid">
            {wishlist.map(item => (
              <div key={item.id} className="wishlist-card">
                <div className="wishlist-emoji">{item.emoji}</div>
                <h3>{item.name}</h3>
                <p className="wishlist-price">${item.price}</p>
                {!item.inStock && <span className="out-stock-badge">OUT OF STOCK</span>}
                <div className="wishlist-actions">
                  <button 
                    className="add-btn"
                    onClick={() => onAddToCart(item.name)}
                    disabled={!item.inStock}
                  >
                    {item.inStock ? '🛒 ADD TO CART' : 'NOT AVAILABLE'}
                  </button>
                  <button className="remove-btn">✕ REMOVE</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-wishlist">
          <p>Your wishlist is empty! Start adding items! 💕</p>
          <button onClick={() => onNavigate('products')}>BROWSE PRODUCTS</button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

import React, { useState, useEffect } from 'react';
import '../styles/FlashSale.css';

const FlashSale = ({ onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState(7245);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 7245));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const saleProducts = [
    { id: 1, name: 'Neon Headphones', original: 149.99, sale: 99.99, discount: 33, stock: 12 },
    { id: 2, name: 'Cybernetic Jacket', original: 299.99, sale: 199.99, discount: 33, stock: 8 },
  ];

  return (
    <section className="flash-sale">
      <div className="flash-header">
        <h2 className="glitch" data-text="⚡ FLASH SALE ⚡">⚡ FLASH SALE ⚡</h2>
        <div className="countdown">
          <span className="countdown-label">ENDS IN:</span>
          <div className="timer">
            <span className="time-unit">{String(hours).padStart(2, '0')}</span>
            <span className="separator">:</span>
            <span className="time-unit">{String(minutes).padStart(2, '0')}</span>
            <span className="separator">:</span>
            <span className="time-unit">{String(seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <div className="sale-products">
        {saleProducts.map(product => (
          <div key={product.id} className="sale-card">
            <div className="discount-badge">{product.discount}% OFF</div>
            <div className="stock-counter">ONLY {product.stock} LEFT!</div>
            
            <p className="sale-product-name">{product.name}</p>
            
            <div className="price-section">
              <span className="original-price">${product.original}</span>
              <span className="sale-price">${product.sale}</span>
              <span className="savings">Save ${(product.original - product.sale).toFixed(2)}</span>
            </div>

            <button className="sale-btn" onClick={() => onNavigate('products')}>
              GRAB DEAL NOW
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashSale;

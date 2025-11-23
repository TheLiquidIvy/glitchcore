import React from 'react';
import '../styles/ProductRecommendations.css';

const ProductRecommendations = () => {
  const recommendations = [
    { id: 2, name: 'Cybernetic Jacket', price: 299.99, emoji: '🧥' },
    { id: 3, name: 'Glitch LED Monitor', price: 799.99, emoji: '🖥️' },
    { id: 5, name: 'Neural Interface Watch', price: 199.99, emoji: '⌚' },
  ];

  return (
    <section className="recommendations-card">
      <h2 className="glitch" data-text="YOU MAY ALSO LIKE">YOU MAY ALSO LIKE</h2>
      <div className="recommendations-grid">
        {recommendations.map((product, index) => (
          <div key={product.id} className="recommendation-item fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="rec-emoji">{product.emoji}</div>
            <h4>{product.name}</h4>
            <p className="rec-price">${product.price.toFixed(2)}</p>
            <button className="rec-btn">VIEW & ADD</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductRecommendations;

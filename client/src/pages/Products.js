import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Products.css';

const PRODUCTS_DATA = [
  {
    id: 1,
    name: 'Neon Headphones',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=80',
    category: 'Audio',
    rating: 4.8,
    description: 'Experience the future of sound with these glitchcore neon headphones.',
  },
  {
    id: 2,
    name: 'Cybernetic Jacket',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1520975690543-6f0a5a5acb4e?auto=format&fit=crop&w=400&q=80',
    category: 'Fashion',
    rating: 4.9,
    description: 'High-tech cybernetic jacket with neon trims and tech integration.',
  },
  {
    id: 3,
    name: 'Holo Visor',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    category: 'Accessories',
    rating: 4.6,
    description: 'Futuristic holographic visor for augmented reality experiences.',
  },
  {
    id: 4,
    name: 'Pixelated Sneakers',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    category: 'Footwear',
    rating: 4.7,
    description: 'Retro pixel art style sneakers with glowing soles and LED accents.',
  },
  {
    id: 5,
    name: 'Glitch Mask',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8895d9e9d?auto=format&fit=crop&w=400&q=80',
    category: 'Accessories',
    rating: 4.5,
    description: 'Mask with glitch effect for cyberpunk cosplay and conventions.',
  },
  {
    id: 6,
    name: 'Neural Interface Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    category: 'Tech',
    rating: 4.9,
    description: 'Advanced wearable tech with holographic display and AI integration.',
  },
];

function Products({ onProductClick }) {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', 'Audio', 'Fashion', 'Accessories', 'Footwear', 'Tech'];

  const filtered = filter === 'All' 
    ? PRODUCTS_DATA 
    : PRODUCTS_DATA.filter(p => p.category === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="products-page">
      <section className="products-header">
        <h1 className="glitch" data-text="PRODUCT CATALOG">PRODUCT CATALOG</h1>
        <p className="products-subtitle">Explore our collection of cutting-edge cyberpunk gear</p>
      </section>

      <section className="products-controls">
        <div className="filter-section">
          <h3>CATEGORIES</h3>
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="sort-section">
          <h3>SORT BY</h3>
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </section>

      <section className="products-grid">
        {sorted.map(product => (
          <Link 
            key={product.id} 
            to={`/product/${product.id}`}
            className="product-card-link"
            onClick={onProductClick}
          >
            <div className="product-card">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-overlay">VIEW DETAILS</div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="product-rating">
                  {'⭐'.repeat(Math.floor(product.rating))} ({product.rating})
                </div>
                <p className="product-category">{product.category}</p>
                <div className="product-footer">
                  <div className="price">${product.price}</div>
                  <button className="add-btn" onClick={(e) => {
                    e.preventDefault();
                    alert(`${product.name} added to cart!`);
                  }}>
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="products-cta">
        <h2 className="glitch" data-text="MORE COMING SOON">MORE COMING SOON</h2>
        <p>New products are constantly being added to our catalog. Subscribe to our newsletter for exclusive early access.</p>
        <button className="newsletter-btn">SUBSCRIBE NOW</button>
      </section>
    </div>
  );
}

export default Products;

import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import '../styles/Products.css';

const PRODUCTS_DATA = [
  { id: 1, name: 'Neon Headphones', price: 149.99, category: 'Audio', emoji: '🎧' },
  { id: 2, name: 'Cybernetic Jacket', price: 299.99, category: 'Fashion', emoji: '🧥' },
  { id: 3, name: 'Glitch LED Monitor', price: 799.99, category: 'Tech', emoji: '🖥️' },
  { id: 4, name: 'Pixelated Sneakers', price: 129.99, category: 'Fashion', emoji: '👟' },
  { id: 5, name: 'Neural Interface Watch', price: 199.99, category: 'Tech', emoji: '⌚' },
  { id: 6, name: 'Sonic Goggles', price: 89.99, category: 'Accessories', emoji: '🕶️' },
];

function Products({ onNavigate, onProductClick }) {
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS_DATA);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', 'Audio', 'Fashion', 'Tech', 'Accessories'];

  useEffect(() => {
    let filtered = PRODUCTS_DATA;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    let sorted = [...filtered];
    if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);

    setFilteredProducts(sorted);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="glitch" data-text="CYBERPUNK COLLECTION">CYBERPUNK COLLECTION</h1>
        <p className="products-subtitle">[ {filteredProducts.length} ITEMS AVAILABLE ]</p>
      </div>

      <SearchBar 
        onSearch={setSearchQuery}
        placeholder="Search cyberpunk gear..."
      />

      <div className="products-controls">
        <div className="filter-section">
          <h3>CATEGORIES</h3>
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="sort-section">
          <h3>SORT BY</h3>
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="product-card fade-in glow-on-hover"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="product-emoji">{product.emoji}</div>
            <h3>{product.name}</h3>
            <p className="product-price price-glitch">${product.price.toFixed(2)}</p>
            <p className="product-category">{product.category}</p>
            <div className="product-actions">
              <button 
                className="view-btn"
                onClick={() => onNavigate('product-detail', product.id)}
              >
                VIEW
              </button>
              <button 
                className="cart-btn"
                onClick={() => {
                  onProductClick();
                  alert(`${product.name} added to cart!`);
                }}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-results">
          <p>NO PRODUCTS FOUND</p>
          <button onClick={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }} className="reset-btn">
            RESET FILTERS
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;

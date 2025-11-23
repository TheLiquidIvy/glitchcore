import React, { useState } from 'react';
import '../styles/AdvancedSearch.css';

const AdvancedSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const handleSearch = () => {
    onSearch({ searchTerm, category, priceRange });
  };

  return (
    <div className="advanced-search">
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>🔍 SEARCH</button>
      </div>

      <div className="search-filters">
        <div className="filter">
          <label>CATEGORY</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">ALL</option>
            <option value="audio">AUDIO</option>
            <option value="fashion">FASHION</option>
            <option value="tech">TECH</option>
          </select>
        </div>

        <div className="filter">
          <label>PRICE RANGE: ${priceRange[0]} - ${priceRange[1]}</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;

import React, { useState } from 'react';
import '../styles/InventoryManagement.css';

const InventoryManagement = ({ cartCount }) => {
  const defaultInventory = [
    { id: 1, name: 'Neon Headphones', emoji: '🎧', baseStock: 45, category: 'Audio', price: 149.99 },
    { id: 2, name: 'Cybernetic Jacket', emoji: '🧥', baseStock: 28, category: 'Fashion', price: 299.99 },
    { id: 3, name: 'Glitch LED Monitor', emoji: '🖥️', baseStock: 12, category: 'Tech', price: 799.99 },
    { id: 4, name: 'Pixelated Sneakers', emoji: '👟', baseStock: 67, category: 'Fashion', price: 129.99 },
    { id: 5, name: 'Neural Interface Watch', emoji: '⌚', baseStock: 33, category: 'Tech', price: 199.99 },
    { id: 6, name: 'Sonic Goggles', emoji: '🕶️', baseStock: 52, category: 'Accessories', price: 89.99 },
  ];

  const [inventory] = useState(defaultInventory);
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'Audio', 'Fashion', 'Tech', 'Accessories'];

  const filteredInventory = inventory.filter(item => 
    filterCategory === 'all' || item.category === filterCategory
  ).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'stock') return b.baseStock - a.baseStock;
    if (sortBy === 'price') return b.price - a.price;
    return 0;
  });

  const totalStock = inventory.reduce((sum, item) => sum + item.baseStock, 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.baseStock * item.price), 0);
  const cartItemsInInventory = Math.min(cartCount, totalStock);
  const remainingStock = totalStock - cartItemsInInventory;

  return (
    <div className="inventory-management">
      <div className="inventory-header">
        <h2 className="glitch" data-text="INVENTORY SYSTEM">INVENTORY SYSTEM</h2>
        <p className="inventory-subtitle">[ REAL-TIME STOCK TRACKING ]</p>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-number">{totalStock}</div>
          <div className="stat-label">TOTAL STOCK</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{cartItemsInInventory}</div>
          <div className="stat-label">IN CART</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{remainingStock}</div>
          <div className="stat-label">AVAILABLE</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${totalValue.toLocaleString()}</div>
          <div className="stat-label">TOTAL VALUE</div>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="filter-group">
          <label>CATEGORY</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-group">
          <label>SORT BY</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">NAME</option>
            <option value="stock">STOCK (HIGH-LOW)</option>
            <option value="price">PRICE (HIGH-LOW)</option>
          </select>
        </div>
      </div>

      <div className="inventory-table">
        <div className="table-header">
          <div className="col-emoji">EMOJI</div>
          <div className="col-name">PRODUCT NAME</div>
          <div className="col-category">CATEGORY</div>
          <div className="col-price">PRICE</div>
          <div className="col-stock">STOCK</div>
          <div className="col-allocated">ALLOCATED TO CART</div>
          <div className="col-available">AVAILABLE</div>
          <div className="col-value">VALUE</div>
        </div>

        <div className="table-body">
          {filteredInventory.map(item => {
            const allocatedToCart = Math.min(cartItemsInInventory, Math.floor(item.baseStock / inventory.length));
            const available = item.baseStock - allocatedToCart;
            const value = item.baseStock * item.price;

            return (
              <div key={item.id} className="table-row">
                <div className="col-emoji">{item.emoji}</div>
                <div className="col-name">{item.name}</div>
                <div className="col-category">{item.category}</div>
                <div className="col-price">${item.price}</div>
                <div className="col-stock">
                  <span className="stock-badge">{item.baseStock}</span>
                </div>
                <div className="col-allocated">
                  <span className="allocated-badge">{allocatedToCart}</span>
                </div>
                <div className="col-available">
                  <span className={`available-badge ${available > 10 ? 'high' : available > 5 ? 'medium' : 'low'}`}>
                    {available}
                  </span>
                </div>
                <div className="col-value">${value.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="inventory-footer">
        <div className="inventory-note">
          <p>[ INVENTORY TRACKING SYSTEM ]</p>
          <p>Stock reflects current availability • Allocated items show cart additions in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;

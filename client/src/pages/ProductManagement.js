import React, { useState } from 'react';
import '../styles/ProductManagement.css';

const ProductManagement = () => {
  const defaultProducts = [
    { id: 1, name: 'Neon Headphones', price: 149.99, category: 'Audio', emoji: '🎧' },
    { id: 2, name: 'Cybernetic Jacket', price: 299.99, category: 'Fashion', emoji: '🧥' },
    { id: 3, name: 'Glitch LED Monitor', price: 799.99, category: 'Tech', emoji: '🖥️' },
    { id: 4, name: 'Pixelated Sneakers', price: 129.99, category: 'Fashion', emoji: '👟' },
    { id: 5, name: 'Neural Interface Watch', price: 199.99, category: 'Tech', emoji: '⌚' },
    { id: 6, name: 'Sonic Goggles', price: 89.99, category: 'Accessories', emoji: '🕶️' },
  ];

  const [products, setProducts] = useState(defaultProducts);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'Tech', emoji: '🎁' });
  const [activeTab, setActiveTab] = useState('list');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (formData.name && formData.price) {
      const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        emoji: formData.emoji,
      };
      setProducts([...products, newProduct]);
      setFormData({ name: '', price: '', category: 'Tech', emoji: '🎁' });
      setShowForm(false);
    }
  };

  const handleRemoveProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleResetProducts = () => {
    setProducts(defaultProducts);
  };

  return (
    <div className="product-management">
      <div className="management-header">
        <h2 className="glitch" data-text="PRODUCT MANAGEMENT">PRODUCT MANAGEMENT</h2>
        <p className="management-subtitle">[ INVENTORY CONTROL SYSTEM ]</p>
      </div>

      <div className="management-tabs">
        <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          📦 PRODUCT LIST ({products.length})
        </button>
        <button className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
          ➕ ADD NEW PRODUCT
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="products-list-section">
          <div className="list-controls">
            <p className="list-info">[ {products.length} PRODUCTS IN INVENTORY ]</p>
            <button className="reset-btn" onClick={handleResetProducts}>🔄 RESET TO DEFAULT</button>
          </div>
          
          <div className="products-table">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-emoji">EMOJI</div>
              <div className="col-name">PRODUCT NAME</div>
              <div className="col-category">CATEGORY</div>
              <div className="col-price">PRICE</div>
              <div className="col-action">ACTION</div>
            </div>
            
            <div className="table-body">
              {products.map(product => (
                <div key={product.id} className="table-row">
                  <div className="col-id">#{product.id}</div>
                  <div className="col-emoji">{product.emoji}</div>
                  <div className="col-name">{product.name}</div>
                  <div className="col-category">{product.category}</div>
                  <div className="col-price">${product.price.toFixed(2)}</div>
                  <div className="col-action">
                    <button 
                      className="delete-btn"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      ✕ REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'add' && (
        <div className="add-product-section">
          <form className="product-form" onSubmit={handleAddProduct}>
            <div className="form-group">
              <label>PRODUCT NAME</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Cyber Boots"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>PRICE</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="99.99"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>CATEGORY</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option>Tech</option>
                  <option>Fashion</option>
                  <option>Audio</option>
                  <option>Accessories</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>EMOJI</label>
              <input
                type="text"
                name="emoji"
                value={formData.emoji}
                onChange={handleInputChange}
                placeholder="🎁"
                maxLength="2"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">✓ ADD TO INVENTORY</button>
              <button type="button" className="cancel-btn" onClick={() => setFormData({ name: '', price: '', category: 'Tech', emoji: '🎁' })}>
                ✕ CLEAR FORM
              </button>
            </div>
          </form>

          <div className="form-preview">
            <h3>PREVIEW</h3>
            <div className="preview-card">
              <div className="preview-emoji">{formData.emoji}</div>
              <p className="preview-name">{formData.name || 'Product Name'}</p>
              <p className="preview-price">${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}</p>
              <p className="preview-category">{formData.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

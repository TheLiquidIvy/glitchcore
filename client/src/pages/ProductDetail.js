import React, { useState } from 'react';
import '../styles/ProductDetail.css';
import ProductReviews from '../components/ProductReviews';

const PRODUCTS_DATA = [
  { id: 1, name: 'Neon Headphones', price: 149.99, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=80', category: 'Audio', rating: 4.8, inStock: true, description: 'Experience the future of sound with these glitchcore neon headphones.', fullDescription: 'Premium Neon Headphones with 40-hour battery, active noise cancellation, glow-in-the-dark accents, and crystal-clear audio. Perfect for gaming and music production.' },
  { id: 2, name: 'Cybernetic Jacket', price: 299.99, image: 'https://images.unsplash.com/photo-1520975690543-6f0a5a5acb4e?auto=format&fit=crop&w=400&q=80', category: 'Fashion', rating: 4.9, inStock: true, description: 'High-tech cybernetic jacket with neon trims and tech integration.', fullDescription: 'The ultimate cyberpunk fashion statement with embedded LED light strips, temperature-regulating smart fabric, hidden tech pockets, and water-resistant exterior.' },
  { id: 3, name: 'Holo Visor', price: 89.99, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', category: 'Accessories', rating: 4.6, inStock: true, description: 'Futuristic holographic visor for augmented reality experiences.', fullDescription: 'Holographic AMOLED display with AR compatibility. Lightweight design, UV protection, voice control, and 12-hour battery life.' },
  { id: 4, name: 'Pixelated Sneakers', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', category: 'Footwear', rating: 4.7, inStock: true, description: 'Retro pixel art style sneakers with glowing soles and LED accents.', fullDescription: 'LED-illuminated soles with motion-activated light patterns, pixel art design, rechargeable battery, memory foam insoles, and water-resistant coating.' },
  { id: 5, name: 'Glitch Mask', price: 59.99, image: 'https://images.unsplash.com/photo-1518173946687-a4c8895d9e9d?auto=format&fit=crop&w=400&q=80', category: 'Accessories', rating: 4.5, inStock: true, description: 'Mask with glitch effect for cyberpunk cosplay and conventions.', fullDescription: 'Full-face glitch effect design with glow-in-the-dark paint, adjustable straps, breathable mesh panels, and lightweight polycarbonate shell.' },
  { id: 6, name: 'Neural Interface Watch', price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80', category: 'Tech', rating: 4.9, inStock: true, description: 'Advanced wearable tech with holographic display and AI integration.', fullDescription: 'Holographic AMOLED display, AI personal assistant, health monitoring, 7-day battery, water-resistant to 100m, GPS, NFC payments, voice control.' },
];

function ProductDetail({ productId, onNavigate, onAddToCart }) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-not-found">
          <h2 className="glitch" data-text="PRODUCT NOT FOUND">PRODUCT NOT FOUND</h2>
          <p>[ ERROR_CODE: 404_GLITCH_DETECTED ]</p>
          <button className="back-button" onClick={() => onNavigate('products')}>BACK TO PRODUCTS</button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => { onAddToCart(product.name); };

  return (
    <div className="product-detail-page">
      <button className="back-button" onClick={() => onNavigate('products')}>← BACK</button>

      <div className="product-detail-container">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} className="product-image-large" />
          <div className="product-stock">
            {product.inStock ? <span className="in-stock">✓ IN STOCK</span> : <span className="out-stock">OUT OF STOCK</span>}
          </div>
        </div>

        <div className="product-info-section">
          <div className="product-header">
            <h1 className="glitch" data-text={product.name}>{product.name}</h1>
            <div className="product-meta">
              <span className="category">[{product.category}]</span>
              <span className="rating">⭐ {product.rating}/5</span>
            </div>
          </div>

          <div className="price-section">
            <div className="price-display">${product.price}</div>
            <p className="price-note">FREE SHIPPING ON ORDERS OVER $50</p>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="purchase-section">
            <div className="quantity-selector">
              <label>QUANTITY:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!product.inStock}>ADD TO CART</button>
          </div>

          <div className="product-guarantees">
            <div className="guarantee">🛡️ 30-day money-back guarantee</div>
            <div className="guarantee">🚚 Fast & free shipping</div>
            <div className="guarantee">💬 24/7 customer support</div>
          </div>
        </div>
      </div>

      <section className="full-description">
        <h2 className="glitch" data-text="FULL SPECIFICATIONS">FULL SPECIFICATIONS</h2>
        <div className="description-text">
          <p>{product.fullDescription}</p>
        </div>
      </section>

      <ProductReviews productId={productId} />
    </div>
  );
}

export default ProductDetail;

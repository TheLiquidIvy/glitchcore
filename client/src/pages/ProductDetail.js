import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/ProductDetail.css';

const PRODUCTS_DATA = [
  {
    id: 1,
    name: 'Neon Headphones',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=80',
    category: 'Audio',
    rating: 4.8,
    inStock: true,
    description: 'Experience the future of sound with these glitchcore neon headphones.',
    fullDescription: `
      Our premium Neon Headphones combine cutting-edge audio technology with stunning cyberpunk aesthetics. 
      These aren't just headphones—they're a statement piece for the digital age.
      
      FEATURES:
      • 40-hour battery life with fast charging
      • Active noise cancellation with AI enhancement
      • Glow-in-the-dark neon accents
      • Premium memory foam ear cushions
      • Bluetooth 5.2 connectivity
      • Built-in microphone for crystal-clear calls
      • Foldable design for portability
      • Available in 3 neon colors: Electric Green, Magenta, and Cyan
      
      SPECIFICATIONS:
      • Driver Size: 40mm
      • Frequency Response: 20Hz - 20kHz
      • Impedance: 32 Ohms
      • Weight: 250g
      • Connection: Wireless (Bluetooth 5.2) & Wired (3.5mm Jack)
      
      Perfect for late-night gaming sessions, music production, or making a fashion statement. 
      Join thousands of satisfied customers who've upgraded their audio experience.
    `,
    reviews: [
      { author: 'CyberNova', rating: 5, text: 'Amazing sound quality and the neon glow is incredible!' },
      { author: 'GlitchMaster', rating: 5, text: 'Best purchase I\'ve made in years. Highly recommend!' },
      { author: 'NeonSamurai', rating: 4, text: 'Great headphones, battery could be better.' },
    ],
  },
  {
    id: 2,
    name: 'Cybernetic Jacket',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1520975690543-6f0a5a5acb4e?auto=format&fit=crop&w=400&q=80',
    category: 'Fashion',
    rating: 4.9,
    inStock: true,
    description: 'High-tech cybernetic jacket with neon trims and tech integration.',
    fullDescription: `
      The ultimate cyberpunk fashion statement. This Cybernetic Jacket features advanced tech integration 
      and aesthetic design that will make you the talk of any retro-futuristic gathering.
      
      FEATURES:
      • Embedded LED light strips along seams
      • Temperature-regulating smart fabric
      • Hidden tech pockets for gadgets
      • Neon reflective piping
      • Water-resistant exterior
      • Breathable inner lining
      • Detachable sleeves for custom styling
      • Available in Black, Dark Purple, and Charcoal Gray
      
      SPECIFICATIONS:
      • Material: 60% synthetic tech fabric, 40% cotton blend
      • Weight: 1.2 kg
      • Sizes: XS to XXL
      • Care: Machine wash cold, lay flat to dry
      
      WARNING: This jacket may cause extreme coolness and unwanted attention.
    `,
    reviews: [
      { author: 'TechWear', rating: 5, text: 'Perfect fit and the quality is outstanding!' },
      { author: 'FutureFashion', rating: 5, text: 'This is the jacket I\'ve been dreaming about!' },
    ],
  },
  {
    id: 3,
    name: 'Holo Visor',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    category: 'Accessories',
    rating: 4.6,
    inStock: true,
    description: 'Futuristic holographic visor for augmented reality experiences.',
    fullDescription: `
      Step into the future with our Holo Visor. This isn't just a fashion accessory—it's your gateway 
      to augmented reality experiences and immersive digital environments.
      
      FEATURES:
      • Holographic display technology
      • AR-compatible with major platforms
      • Adjustable fit for all head sizes
      • Lightweight design (only 120g)
      • UV protection lenses
      • Interchangeable lens colors
      • Built-in voice control
      • 12-hour battery life
      
      PERFECT FOR:
      • Gaming and esports
      • Virtual events
      • Cyberpunk conventions
      • Digital art experiences
      • Fashion-forward statements
      
      COMPATIBILITY:
      • Works with iOS, Android, Windows
      • Compatible with popular VR/AR apps
      • Plug-and-play setup
    `,
    reviews: [
      { author: 'VREnthusiast', rating: 5, text: 'The display quality is mind-blowing!' },
      { author: 'CyberCulture', rating: 4, text: 'Great product, minor connectivity issues.' },
    ],
  },
  {
    id: 4,
    name: 'Pixelated Sneakers',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    category: 'Footwear',
    rating: 4.7,
    inStock: true,
    description: 'Retro pixel art style sneakers with glowing soles and LED accents.',
    fullDescription: `
      Stomp into the future with Pixelated Sneakers. Inspired by retro pixel art and glitchcore aesthetics, 
      these sneakers feature LED-lit soles that respond to your movement.
      
      FEATURES:
      • LED-illuminated soles with multiple colors
      • Pixel art design on upper
      • Motion-activated light patterns
      • Rechargeable battery (USB-C)
      • Memory foam insoles
      • Breathable mesh upper
      • Durable rubber outsole
      • Water-resistant coating
      • Available in 5 color schemes
      
      SIZING:
      • EU: 35-47
      • US: 3-15
      • UK: 2-14
      
      CARE INSTRUCTIONS:
      • Hand wash recommended
      • Air dry completely before charging
      • Keep battery dry
      • Avoid extreme temperatures
      
      Perfect for: Gaming, conventions, casual wear, making a statement!
    `,
    reviews: [
      { author: 'RetroGamer', rating: 5, text: 'These are absolutely sick! Love the LED effects!' },
      { author: 'PixelArtist', rating: 5, text: 'Finally, sneakers that match my aesthetic!' },
    ],
  },
  {
    id: 5,
    name: 'Glitch Mask',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8895d9e9d?auto=format&fit=crop&w=400&q=80',
    category: 'Accessories',
    rating: 4.5,
    inStock: true,
    description: 'Mask with glitch effect for cyberpunk cosplay and conventions.',
    fullDescription: `
      The ultimate accessory for any cyberpunk enthusiast. Our Glitch Mask features stunning 
      digital glitch effects that will turn heads at any convention or event.
      
      FEATURES:
      • Full-face glitch effect design
      • Glow-in-the-dark paint
      • Adjustable straps for perfect fit
      • Breathable mesh panels
      • Lightweight polycarbonate shell
      • Scratch-resistant coating
      • Easy to clean
      
      PERFECT FOR:
      • Cosplay conventions
      • Halloween parties
      • Cyberpunk events
      • Music festivals
      • Theme nights
      • Photography shoots
      
      SPECIFICATIONS:
      • Material: Polycarbonate + fabric straps
      • Weight: 85g
      • Maintenance: Wipe clean with soft cloth
      
      WARNING: This mask may cause feelings of being transported into cyberspace.
    `,
    reviews: [
      { author: 'CosplayKing', rating: 5, text: 'Perfect for my cosplay! Very comfortable too!' },
      { author: 'ConventionPro', rating: 4, text: 'Great design, straps could be adjustable.' },
    ],
  },
  {
    id: 6,
    name: 'Neural Interface Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    category: 'Tech',
    rating: 4.9,
    inStock: true,
    description: 'Advanced wearable tech with holographic display and AI integration.',
    fullDescription: `
      The future is on your wrist. The Neural Interface Watch combines advanced AI technology 
      with stunning cyberpunk design for the ultimate smart wearable.
      
      FEATURES:
      • Holographic AMOLED display
      • AI personal assistant
      • Health monitoring suite
      • 7-day battery life
      • Water-resistant to 100m
      • GPS + GLONASS
      • NFC payment support
      • Voice control
      • Customizable watch faces
      
      SPECIFICATIONS:
      • Display: 1.4" holographic AMOLED
      • Processor: Dual-core AI chip
      • RAM: 2GB
      • Storage: 32GB
      • Compatibility: iOS & Android
      • Materials: Titanium case, sapphire crystal
      
      HEALTH FEATURES:
      • Heart rate monitoring
      • Sleep tracking
      • Stress analysis
      • SpO2 measurement
      • Activity tracking (20+ modes)
      
      ONE YEAR WARRANTY INCLUDED
    `,
    reviews: [
      { author: 'TechGuru', rating: 5, text: 'This watch is absolutely revolutionary!' },
      { author: 'FutureReady', rating: 5, text: 'Best tech purchase I\'ve made. Highly recommended!' },
    ],
  },
];

function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS_DATA.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-not-found">
          <h2 className="glitch" data-text="PRODUCT NOT FOUND">PRODUCT NOT FOUND</h2>
          <p>[ ERROR_CODE: 404_GLITCH_DETECTED ]</p>
          <Link to="/products" className="back-button">BACK TO PRODUCTS</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    onAddToCart();
    alert(`${product.name} x${quantity} added to cart!`);
  };

  return (
    <div className="product-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>← BACK</button>

      <div className="product-detail-container">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} className="product-image-large" />
          <div className="product-stock">
            {product.inStock ? (
              <span className="in-stock">✓ IN STOCK</span>
            ) : (
              <span className="out-stock">OUT OF STOCK</span>
            )}
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
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              ADD TO CART
            </button>
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
          {product.fullDescription.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </section>

      <section className="reviews-section">
        <h2 className="glitch" data-text="CUSTOMER REVIEWS">CUSTOMER REVIEWS</h2>
        <div className="reviews-container">
          {product.reviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="review-header">
                <span className="review-author">{review.author}</span>
                <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className="review-text">"{review.text}"</p>
            </div>
          ))}
        </div>
      </section>

      <section className="related-products">
        <h2 className="glitch" data-text="YOU MIGHT ALSO LIKE">YOU MIGHT ALSO LIKE</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Link to="/products" style={{ color: 'var(--tertiary-neon)', textDecoration: 'none' }}>
            ↓ BROWSE MORE PRODUCTS ↓
          </Link>
        </p>
      </section>
    </div>
  );
}

export default ProductDetail;

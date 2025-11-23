import React, { useState } from 'react';
import '../styles/NewsletterSignup.css';

const NewsletterSignup = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => onClose(), 2000);
    }
  };

  if (submitted) {
    return (
      <div className="newsletter-overlay" onClick={onClose}>
        <div className="newsletter-modal success" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">✓</div>
          <h2>WELCOME TO THE GLITCH</h2>
          <p>You'll receive exclusive deals & early access to new products!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="newsletter-overlay" onClick={onClose}>
      <div className="newsletter-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-newsletter" onClick={onClose}>✕</button>
        
        <div className="newsletter-content">
          <h2 className="glitch" data-text="JOIN THE GLITCH">JOIN THE GLITCH</h2>
          <p className="newsletter-subtitle">Get exclusive deals & early access to new cyberpunk products</p>
          
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.glitch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">SUBSCRIBE NOW</button>
          </form>

          <p className="newsletter-note">[ We won't spam, we promise ]</p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="glitch" data-text="WELCOME TO GLITCHCORE">WELCOME TO GLITCHCORE</h1>
          <p className="hero-subtitle">Enter the nexus of cyberpunk aesthetics and futuristic technology</p>
          <p className="hero-description">
            Step into a world where neon lights meet digital chaos. Glitchcore is your destination for cutting-edge fashion, 
            high-tech gadgets, and accessories that scream the future. From glowing headphones to pixelated sneakers, 
            every item in our collection is designed to make you feel like you're living in a cyberpunk dystopia.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">2,847</div>
              <div className="stat-label">ITEMS SOLD</div>
            </div>
            <div className="stat">
              <div className="stat-number">1,349</div>
              <div className="stat-label">HAPPY USERS</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">SUPPORT ACTIVE</div>
            </div>
          </div>
          <Link to="/products" className="cta-button">EXPLORE COLLECTION</Link>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=80" 
               alt="Cyberpunk Headphones" />
        </div>
      </section>

      <section className="about-section">
        <h2 className="glitch" data-text="ABOUT GLITCHCORE">ABOUT GLITCHCORE</h2>
        <div className="about-content">
          <div className="about-card">
            <h3>🤖 MISSION</h3>
            <p>We bring the cyberpunk aesthetic to life by curating exclusive gear that merges fashion with futuristic technology. 
            Our mission is to empower individuals to express their digital identity through carefully selected, high-quality products.</p>
          </div>
          <div className="about-card">
            <h3>✨ VISION</h3>
            <p>To create a global community of cyberpunk enthusiasts who celebrate digital culture, neon aesthetics, and 
            the intersection of technology and fashion. We envision a future where everyone can access premium glitchcore products 
            that elevate their personal style.</p>
          </div>
          <div className="about-card">
            <h3>🔮 VALUES</h3>
            <p>Innovation, creativity, and authenticity drive everything we do. We believe in pushing boundaries, challenging conventions, 
            and delivering products that are as bold and unique as our community. Quality, integrity, and customer satisfaction 
            are non-negotiable.</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="glitch" data-text="WHY GLITCHCORE">WHY GLITCHCORE</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>PREMIUM QUALITY</h3>
            <p>Every product is handpicked and tested for durability and performance. We don't compromise on quality.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>GLOBAL SHIPPING</h3>
            <p>Fast and secure shipping to over 150 countries. Track your order in real-time from warehouse to your door.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>SECURE PAYMENTS</h3>
            <p>Multiple payment options with military-grade encryption. Your data is protected at all times.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎁</div>
            <h3>EXCLUSIVE DROPS</h3>
            <p>Limited edition items and seasonal collections. Be the first to know about new releases via our newsletter.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

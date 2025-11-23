import React, { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => { setFormData({ name: '', email: '', subject: '', message: '' }); setSubmitted(false); }, 3000);
  };

  return (
    <div className="contact-page">
      <section className="contact-header">
        <h1 className="glitch" data-text="CONTACT US">CONTACT US</h1>
        <p className="contact-subtitle">[ ENTER THE COMMUNICATION CHANNEL ]</p>
        <p className="contact-description">Got questions? Found a glitch? Want to collaborate? We'd love to hear from you. Our support team is available 24/7 to assist with your cyberpunk needs.</p>
      </section>

      <div className="contact-container">
        <section className="contact-info-section">
          <h2 className="glitch" data-text="CONNECT WITH US">CONNECT WITH US</h2>
          <div className="contact-info-grid">
            <div className="contact-card"><div className="contact-icon">📧</div><h3>EMAIL</h3><p>support@glitchcore.store</p><p className="contact-detail">We respond within 2-4 hours</p></div>
            <div className="contact-card"><div className="contact-icon">📱</div><h3>PHONE</h3><p>+1 (555) GLITCH-1</p><p className="contact-detail">Mon-Fri, 9AM-10PM EST</p></div>
            <div className="contact-card"><div className="contact-icon">🌐</div><h3>SOCIAL MEDIA</h3><p>@glitchcore_official</p><p className="contact-detail">Follow for exclusive drops</p></div>
            <div className="contact-card"><div className="contact-icon">📍</div><h3>ADDRESS</h3><p>Cyber District, Neo-Tokyo</p><p className="contact-detail">Virtual HQ: cyberspace.glitch</p></div>
          </div>
          <div className="social-links">
            <a href="#" className="social-btn">DISCORD</a>
            <a href="#" className="social-btn">TWITTER</a>
            <a href="#" className="social-btn">INSTAGRAM</a>
            <a href="#" className="social-btn">TWITCH</a>
          </div>
        </section>

        <section className="contact-form-section">
          <h2 className="glitch" data-text="SEND MESSAGE">SEND MESSAGE</h2>
          {submitted && (
            <div className="success-message">
              <div className="glitch-text" data-text="MESSAGE RECEIVED">MESSAGE RECEIVED</div>
              <p>[ STATUS: TRANSMISSION_SUCCESSFUL ]</p>
            </div>
          )}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">NAME</label>
              <input type="text" id="name" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">EMAIL</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">SUBJECT</label>
              <input type="text" id="subject" name="subject" placeholder="What's this about?" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="form-group full-width">
              <label htmlFor="message">MESSAGE</label>
              <textarea id="message" name="message" placeholder="Tell us everything..." rows="6" value={formData.message} onChange={handleChange} required />
            </div>
            <button type="submit" className="submit-btn">TRANSMIT MESSAGE</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Contact;

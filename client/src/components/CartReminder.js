import React, { useState, useEffect } from 'react';
import '../styles/CartReminder.css';

const CartReminder = ({ isVisible, itemName, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="cart-reminder-overlay">
      <div className="cart-reminder-modal">
        <div className="reminder-header">
          <span className="reminder-icon">🛒</span>
          <h2>ITEM ADDED TO CART</h2>
        </div>
        
        <div className="reminder-content">
          <p className="item-name">{itemName}</p>
          <p className="reminder-text">has been added to your cart!</p>
          <div className="reminder-progress"></div>
        </div>

        <div className="reminder-footer">
          <button className="reminder-btn close-btn" onClick={onClose}>DISMISS</button>
          <button className="reminder-btn view-btn">VIEW CART</button>
        </div>
      </div>
    </div>
  );
};

export default CartReminder;

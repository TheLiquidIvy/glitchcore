import React, { useState } from 'react';
import '../styles/Cart.css';
import PromoCode from '../components/PromoCode';

function Cart({ onNavigate, cartItems = [] }) {
  const [discountRate, setDiscountRate] = useState(0);
  
  const mockCartItems = [
    { id: 1, name: 'Neon Headphones', price: 149.99, quantity: 1, image: '🎧' },
    { id: 4, name: 'Pixelated Sneakers', price: 129.99, quantity: 2, image: '👟' },
  ];

  const items = cartItems.length > 0 ? cartItems : mockCartItems;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal * discountRate;
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * 0.1;
  const total = afterDiscount + tax;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="glitch" data-text="SHOPPING CART">SHOPPING CART</h1>
        <p className="cart-count">[ {items.length} ITEMS IN CART ]</p>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          {items.length > 0 ? (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">{item.image}</div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <span>QTY: {item.quantity}</span>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button className="remove-btn">✕</button>
              </div>
            ))
          ) : (
            <div className="empty-cart">
              <p>YOUR CART IS EMPTY</p>
              <button onClick={() => onNavigate('products')} className="continue-shopping">
                🛍️ CONTINUE SHOPPING
              </button>
            </div>
          )}
        </div>

        <div className="cart-summary">
          <h2 className="glitch" data-text="ORDER SUMMARY">ORDER SUMMARY</h2>
          
          <PromoCode subtotal={subtotal} onApplyCode={setDiscountRate} />

          <div className="summary-row">
            <span>SUBTOTAL</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="summary-row discount">
              <span>DISCOUNT ({Math.round(discountRate * 100)}%)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>TAX (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row shipping">
            <span>SHIPPING</span>
            <span>FREE</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>TOTAL</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn">PROCEED TO CHECKOUT</button>
          <button className="continue-btn" onClick={() => onNavigate('products')}>
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;

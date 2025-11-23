import React, { useState } from 'react';
import '../styles/PromoCode.css';

const PromoCode = ({ subtotal, onApplyCode }) => {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(null);

  const validCodes = {
    'CYBER2024': 0.25,
    'GLITCH50': 0.50,
    'NEON25': 0.25,
    'CYBERPUNK': 0.30,
  };

  const handleApply = () => {
    if (validCodes[code.toUpperCase()]) {
      const discount = validCodes[code.toUpperCase()];
      setApplied({ code: code.toUpperCase(), discount });
      onApplyCode(discount);
    } else if (code) {
      alert('Invalid code! Try: CYBER2024, GLITCH50, NEON25, CYBERPUNK');
    }
  };

  return (
    <div className="promo-section">
      <h4>PROMO CODE</h4>
      {applied ? (
        <div className="applied-code">
          <span className="applied-badge">✓ APPLIED</span>
          <span className="code-display">{applied.code}</span>
          <span className="discount-percent">{Math.round(applied.discount * 100)}% OFF</span>
        </div>
      ) : (
        <div className="promo-input-group">
          <input
            type="text"
            placeholder="Enter code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="promo-input"
          />
          <button onClick={handleApply} className="apply-code-btn">APPLY</button>
        </div>
      )}
    </div>
  );
};

export default PromoCode;

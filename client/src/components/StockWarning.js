import React from 'react';

const StockWarning = ({ stock }) => {
  if (stock > 10) return null;
  if (stock <= 0) return <div className="stock-warning critical">OUT OF STOCK</div>;
  return <div className="stock-warning urgent">ONLY {stock} LEFT!</div>;
};

export default StockWarning;

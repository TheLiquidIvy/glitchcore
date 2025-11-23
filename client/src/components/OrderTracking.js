import React from 'react';
import '../styles/OrderTracking.css';

const OrderTracking = () => {
  const orders = [
    { id: 1001, product: 'Neon Headphones', status: 'delivered', progress: 100, date: '2024-11-20', delivery: '2024-11-22' },
    { id: 1002, product: 'Pixelated Sneakers', status: 'shipped', progress: 66, date: '2024-11-15', delivery: '2024-11-25' },
    { id: 1003, product: 'Cybernetic Jacket', status: 'processing', progress: 33, date: '2024-11-21', delivery: '2024-11-28' },
  ];

  const getStatusInfo = (status) => {
    const info = {
      processing: { label: 'PROCESSING', icon: '⏳', color: 'yellow' },
      shipped: { label: 'SHIPPED', icon: '📦', color: 'blue' },
      delivered: { label: 'DELIVERED', icon: '✓', color: 'green' },
    };
    return info[status];
  };

  return (
    <div className="order-tracking">
      <h3>ORDER TRACKING</h3>
      <div className="orders-list">
        {orders.map(order => {
          const status = getStatusInfo(order.status);
          return (
            <div key={order.id} className={`order-card status-${order.status}`}>
              <div className="order-header">
                <div className="order-info">
                  <p className="order-id">#{order.id}</p>
                  <p className="order-product">{order.product}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${status.color}`}>{status.icon} {status.label}</span>
                </div>
              </div>
              
              <div className="order-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${order.progress}%` }}></div>
                </div>
              </div>

              <div className="order-dates">
                <span className="order-date">Ordered: {order.date}</span>
                <span className="delivery-date">Expected: {order.delivery}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracking;

import React from 'react';
import '../styles/ActivityLog.css';

const ActivityLog = ({ cartCount }) => {
  const activities = [
    { id: 1, user: 'User123', action: 'Added Neon Headphones to cart', time: '14:32', icon: '🛒' },
    { id: 2, user: 'User456', action: 'Viewed Cybernetic Jacket', time: '14:28', icon: '👁️' },
    { id: 3, user: 'User789', action: 'Completed purchase for $299.99', time: '14:15', icon: '✓' },
    { id: 4, user: 'User101', action: 'Added to wishlist: Neural Interface Watch', time: '14:10', icon: '❤️' },
    { id: 5, user: 'User202', action: 'Used promo code CYBER2024', time: '13:55', icon: '🎟️' },
    { id: 6, user: 'User303', action: 'Viewed 5 products', time: '13:42', icon: '🔍' },
    { id: 7, user: 'Current Session', action: `Added ${cartCount} items to cart`, time: 'NOW', icon: '⚡' },
  ];

  return (
    <div className="activity-log">
      <h2 className="glitch" data-text="ACTIVITY LOG">ACTIVITY LOG</h2>
      <p className="log-subtitle">[ REAL-TIME USER TRACKING ]</p>

      <div className="log-container">
        {activities.map(activity => (
          <div key={activity.id} className={`log-entry ${activity.time === 'NOW' ? 'current' : ''}`}>
            <div className="log-icon">{activity.icon}</div>
            <div className="log-content">
              <p className="log-user">{activity.user}</p>
              <p className="log-action">{activity.action}</p>
            </div>
            <div className="log-time">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;

import React, { useState } from 'react';
import '../styles/Dashboard.css';

function UserDashboard({ user, onNavigate, onLogout, cartCount }) {
  const [orders] = useState([
    { id: 1001, date: '2024-11-20', product: 'Neon Headphones', status: 'Delivered', total: 149.99 },
    { id: 1002, date: '2024-11-15', product: 'Pixelated Sneakers', status: 'Delivered', total: 129.99 },
  ]);

  const [wishlist] = useState([
    { id: 2, name: 'Cybernetic Jacket', price: 299.99 },
    { id: 6, name: 'Neural Interface Watch', price: 199.99 },
  ]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="glitch" data-text="USER DASHBOARD">USER DASHBOARD</h1>
        <div className="user-info-box">
          <p>LOGGED IN AS: <span className="user-email">{user.email}</span></p>
          <p>ROLE: <span className="user-role">{user.role.toUpperCase()}</span></p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Stats */}
        <section className="dashboard-card">
          <h2 className="glitch" data-text="ACCOUNT STATS">ACCOUNT STATS</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{orders.length}</div>
              <div className="stat-label">ORDERS</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{wishlist.length}</div>
              <div className="stat-label">WISHLIST</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</div>
              <div className="stat-label">TOTAL SPENT</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{cartCount}</div>
              <div className="stat-label">CART ITEMS</div>
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="dashboard-card">
          <h2 className="glitch" data-text="ORDER HISTORY">ORDER HISTORY</h2>
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>DATE</th>
                  <th>PRODUCT</th>
                  <th>STATUS</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.product}</td>
                    <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                    <td>${order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Wishlist */}
        <section className="dashboard-card">
          <h2 className="glitch" data-text="SAVED ITEMS">SAVED ITEMS</h2>
          <div className="wishlist-items">
            {wishlist.map(item => (
              <div key={item.id} className="wishlist-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price}</p>
                </div>
                <button className="add-wishlist-btn" onClick={() => alert(`${item.name} added to cart!`)}>
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section className="dashboard-card">
          <h2 className="glitch" data-text="ACTIONS">ACTIONS</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => onNavigate('products')}>
              🛍️ BROWSE PRODUCTS
            </button>
            <button className="action-btn" onClick={() => onNavigate('contact')}>
              💬 CONTACT SUPPORT
            </button>
            <button className="action-btn logout-btn" onClick={onLogout}>
              🚪 LOGOUT
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;

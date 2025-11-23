import React, { useState } from 'react';
import AnimatedCounter from '../components/AnimatedCounter';
import ProductManagement from './ProductManagement';
import '../styles/Dashboard.css';

function AdminDashboard({ user, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [analytics] = useState({
    totalRevenue: 12847.50,
    totalOrders: 247,
    activeUsers: 1349,
    conversionRate: 3.2,
  });

  const [sales] = useState([
    { id: 1, product: 'Neon Headphones', units: 124, revenue: 18575.76 },
    { id: 2, product: 'Cybernetic Jacket', units: 87, revenue: 26089.13 },
    { id: 3, product: 'Neural Interface Watch', units: 43, revenue: 8589.57 },
    { id: 4, product: 'Pixelated Sneakers', units: 156, revenue: 20293.44 },
  ]);

  const [users] = useState([
    { id: 1, email: 'user1@example.com', joined: '2024-11-01', orders: 3, status: 'Active' },
    { id: 2, email: 'user2@example.com', joined: '2024-10-15', orders: 1, status: 'Active' },
    { id: 3, email: 'user3@example.com', joined: '2024-09-20', orders: 0, status: 'Inactive' },
  ]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="glitch" data-text="ADMIN DASHBOARD">ADMIN DASHBOARD</h1>
        <div className="user-info-box">
          <p>LOGGED IN AS: <span className="user-email">{user.email}</span></p>
          <p>ROLE: <span className="admin-role">{user.role.toUpperCase()}</span></p>
          <p className="access-level">[ SYSTEM ADMINISTRATOR ]</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          📊 DASHBOARD
        </button>
        <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          📦 PRODUCT MANAGEMENT
        </button>
        <button className="logout-btn-small" onClick={onLogout}>🚪 LOGOUT</button>
      </div>

      {activeTab === 'dashboard' ? (
      <div className="dashboard-grid">
        {/* Analytics */}
        <section className="dashboard-card full-width">
          <h2 className="glitch" data-text="ANALYTICS">ANALYTICS</h2>
          <div className="analytics-grid">
            <div className="analytics-item">
              <div className="analytics-value"><AnimatedCounter target={analytics.totalRevenue} duration={3000} prefix="$" /></div>
              <div className="analytics-label">TOTAL REVENUE</div>
              <div className="analytics-trend">↑ 12.5% this month</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-value"><AnimatedCounter target={analytics.totalOrders} duration={2500} /></div>
              <div className="analytics-label">TOTAL ORDERS</div>
              <div className="analytics-trend">↑ 8.3% this month</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-value"><AnimatedCounter target={analytics.activeUsers} duration={3000} /></div>
              <div className="analytics-label">ACTIVE USERS</div>
              <div className="analytics-trend">↑ 15.2% this month</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-value"><AnimatedCounter target={Math.floor(analytics.conversionRate * 10)} duration={2000} suffix="%" /></div>
              <div className="analytics-label">CONVERSION RATE</div>
              <div className="analytics-trend">↑ 0.8% this month</div>
            </div>
          </div>
        </section>

        {/* Top Products */}
        <section className="dashboard-card">
          <h2 className="glitch" data-text="TOP PRODUCTS">TOP PRODUCTS</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>UNITS SOLD</th>
                  <th>REVENUE</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(item => (
                  <tr key={item.id}>
                    <td>{item.product}</td>
                    <td className="number">{item.units}</td>
                    <td className="revenue">${item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* User Management */}
        <section className="dashboard-card">
          <h2 className="glitch" data-text="USER MANAGEMENT">USER MANAGEMENT</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>EMAIL</th>
                  <th>JOINED</th>
                  <th>ORDERS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.joined}</td>
                    <td className="number">{u.orders}</td>
                    <td><span className={`status ${u.status.toLowerCase()}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Admin Actions */}
        <section className="dashboard-card">
          <h2 className="glitch" data-text="SYSTEM CONTROLS">SYSTEM CONTROLS</h2>
          <div className="admin-action-buttons">
            <button className="admin-action-btn manage">📦 MANAGE INVENTORY</button>
            <button className="admin-action-btn manage">📊 GENERATE REPORTS</button>
            <button className="admin-action-btn manage">⚙️ SYSTEM SETTINGS</button>
            <button className="admin-action-btn manage">👥 USER PERMISSIONS</button>
            <button className="admin-action-btn manage">📧 SEND CAMPAIGNS</button>
            <button className="admin-action-btn logout" onClick={onLogout}>🚪 LOGOUT</button>
          </div>
        </section>
      </div>
      ) : (
        <ProductManagement />
      )}
    </div>
  );
}

export default AdminDashboard;

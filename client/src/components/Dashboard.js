// client/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';

function Dashboard({ token }) {
  const [data, setData] = useState({ orders: [], podDrafts: [], recommendations: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, [token]); // Add token dependency

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load dashboard data');
      const json = await res.json();
      setData(json);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Your Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Orders</h3>
      {/* ... (Orders list rendering) ... */}
      {data.orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {data.orders.map(order => (
            <li key={order.id}>
              {order.description || 'Order'} — ${order.amount.toFixed(2)} on {new Date(order.orderDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}

      <h3>Pod Drafts</h3>
      {/* ... (Pod Drafts list rendering) ... */}
      {data.podDrafts.length === 0 ? (
        <p>No POD drafts yet.</p>
      ) : (
        <ul>
          {data.podDrafts.map(draft => (
            <li key={draft.id}>
              {draft.title} (Status: {draft.status})
            </li>
          ))}
        </ul>
      )}

      <h3>Recommendations</h3>
      {/* ... (Recommendations list rendering) ... */}
      {data.recommendations.length === 0 ? (
        <p>No recommendations yet.</p>
      ) : (
        <ul>
          {data.recommendations.map(rec => (
            <li key={rec.id}>
              {rec.title} <br />
              <img src={rec.url} alt={rec.title} style={{ maxWidth: '150px' }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;

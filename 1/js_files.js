// Part 1: Backend Setup

// 1. `models.js`

const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// User model
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  hashedPassword: { type: DataTypes.STRING, allowNull: false },
  stripeCustomerId: { type: DataTypes.STRING },
  subscriptionStatus: { type: DataTypes.STRING, defaultValue: 'visitor' }
});

// Order model
const Order = sequelize.define('Order', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  orderDate: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'completed' }, // e.g., completed, refunded
  description: { type: DataTypes.STRING },
  stripePaymentIntentId: { type: DataTypes.STRING, unique: true }
});

// POD Draft model
const PodDraft = sequelize.define('PodDraft', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'draft' } // draft, ordered, cancelled
});

// Recommendation model
const Recommendation = sequelize.define('Recommendation', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  imageId: { type: DataTypes.INTEGER },
  reason: { type: DataTypes.STRING }
});

// Image model (for recommendations demo)
const Image = sequelize.define('Image', {
  url: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING }
});

// Relationships
User.hasMany(Order, { foreignKey: 'userId' });
User.hasMany(PodDraft, { foreignKey: 'userId' });
User.hasMany(Recommendation, { foreignKey: 'userId' });

module.exports = { sequelize, User, Order, PodDraft, Recommendation, Image, Op };

// 2. `middleware/authenticateToken.js`

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = user.id;
    next();
  });
}

module.exports = authenticateToken;

// 3. `config.js`

require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  PORT: process.env.PORT || 3001,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
};

// 4. `routes/auth.js` (Register/Login)

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = require('../config');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, hashedPassword });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// 5. `routes/dashboard.js` (User Dashboard Data)

const express = require('express');
const { Order, PodDraft, Recommendation, Image, Op } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.findAll({ where: { userId }, order: [['orderDate', 'DESC']] });
    const podDrafts = await PodDraft.findAll({ where: { userId }, order: [['updatedAt', 'DESC']] });

    // Simple recommendation: latest 5 images not purchased
    const purchasedImageIds = orders.map(o => o.imageId).filter(Boolean);
    const recommendations = await Image.findAll({
      where: { id: { [Op.notIn]: purchasedImageIds } },
      limit: 5
    });

    res.json({ orders, podDrafts, recommendations });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;


// 6. `routes/podDrafts.js` (POD Drafts CRUD API)

const express = require('express');
const { PodDraft } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Get all POD drafts for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const drafts = await PodDraft.findAll({ where: { userId: req.userId }, order: [['updatedAt', 'DESC']] });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new POD draft
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newDraft = await PodDraft.create({
      userId: req.userId,
      title,
      imageUrl,
      status: 'draft'
    });

    res.status(201).json(newDraft);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update POD draft
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const draft = await PodDraft.findOne({ where: { id, userId: req.userId } });
    if (!draft) return res.status(404).json({ error: 'Draft not found' });

    const { title, imageUrl, status } = req.body;
    if (title !== undefined) draft.title = title;
    if (imageUrl !== undefined) draft.imageUrl = imageUrl;
    if (status !== undefined) draft.status = status;

    await draft.save();
    res.json(draft);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete POD draft
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const draft = await PodDraft.findOne({ where: { id, userId: req.userId } });
    if (!draft) return res.status(404).json({ error: 'Draft not found' });

    await draft.destroy();
    res.json({ message: 'Draft deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// 7. `routes/admin.js` (Admin Endpoints Skeleton)

const express = require('express');
const { User, Order, PodDraft } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Middleware to check admin role (simplified)
async function checkAdmin(req, res, next) {
  const user = await User.findByPk(req.userId);
  if (!user || user.subscriptionStatus !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// List users
router.get('/users', authenticateToken, checkAdmin, async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'email', 'subscriptionStatus'] });
  res.json(users);
});

// Update user subscription status
router.put('/users/:id/subscription', authenticateToken, checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { subscriptionStatus } = req.body;

  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.subscriptionStatus = subscriptionStatus;
  await user.save();

  res.json(user);
});

// List all orders
router.get('/orders', authenticateToken, checkAdmin, async (req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
});

// List all POD drafts
router.get('/podDrafts', authenticateToken, checkAdmin, async (req, res) => {
  const drafts = await PodDraft.findAll();
  res.json(drafts);
});

module.exports = router;

// 8. `server.js` (Express App Entry Point)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const podDraftRoutes = require('./routes/podDrafts');
const adminRoutes = require('./routes/admin');
const { PORT } = require('./config');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/podDrafts', podDraftRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => res.send('API is running'));

// Sync DB and start server
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync DB:', err);
});



// Part 2: Frontend React App Setup

// 1. `src/index.js`

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// 2. `src/App.js`

import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PodDraftsManager from './components/PodDraftsManager';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [view, setView] = useState('login'); // login, register, dashboard

  useEffect(() => {
    if (token) setView('dashboard');
    else setView('login');
  }, [token]);

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken('');
    setView('login');
  };

  if (view === 'login') return <AuthForm setToken={setToken} switchToRegister={() => setView('register')} />;
  if (view === 'register') return <RegisterForm setToken={setToken} switchToLogin={() => setView('login')} />;
  if (view === 'dashboard')
    return (
      <div>
        <button onClick={logout}>Logout</button>
        <Dashboard token={token} />
        <hr />
        <PodDraftsManager token={token} />
      </div>
    );

  return null;
}

function AuthForm({ setToken, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={login}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        No account? <button onClick={switchToRegister}>Register here</button>
      </p>
    </div>
  );
}

function RegisterForm({ setToken, switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={register}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Register</button>
      </form>
      <p>
        Have an account? <button onClick={switchToLogin}>Login here</button>
      </p>
    </div>
  );
}

export default App;

// 3. `src/components/Dashboard.js`

import React, { useEffect, useState } from 'react';

function Dashboard({ token }) {
  const [data, setData] = useState({ orders: [], podDrafts: [], recommendations: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load dashboard data');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Your Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Orders</h3>
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

// 4. `src/components/PodDraftsManager.js`

import React, { useState, useEffect } from 'react';

function PodDraftsManager({ token }) {
  const [drafts, setDrafts] = useState([]);
  const [form, setForm] = useState({ title: '', imageUrl: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await fetch('/api/podDrafts', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load drafts');
      const data = await res.json();
      setDrafts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/podDrafts/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch('/api/podDrafts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save draft');
      }

      setForm({ title: '', imageUrl: '' });
      setEditingId(null);
      fetchDrafts();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = draft => {
    setEditingId(draft.id);
    setForm({ title: draft.title, imageUrl: draft.imageUrl || '' });
  };

  const deleteDraft = async id => {
    if (!window.confirm('Delete this draft?')) return;
    try {
      const res = await fetch(`/api/podDrafts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete draft');
      fetchDrafts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h3>{editingId ? 'Edit POD Draft' : 'New POD Draft'}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ title: '', imageUrl: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>Your POD Drafts</h3>
      {drafts.length === 0 ? (
        <p>No drafts yet.</p>
      ) : (
        <ul>
          {drafts.map(draft => (
            <li key={draft.id}>
              <strong>{draft.title}</strong> <br />
              {draft.imageUrl && <img src={draft.imageUrl} alt={draft.title} style={{ maxWidth: '150px' }} />} <br />
              Status: {draft.status} <br />
              <button onClick={() => startEdit(draft)}>Edit</button>
              <button onClick={() => deleteDraft(draft.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PodDraftsManager;


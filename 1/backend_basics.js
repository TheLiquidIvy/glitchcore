// 1. Backend: Minimal User Model (in-memory for demo)

```javascript
// users.js - simple user storage for demo
const users = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123', // Never store plain passwords in real apps!
    stripeCustomerId: 'cus_ABC123', // Stripe customer ID for this user
    subscriptionStatus: 'visitor' // or 'subscriber'
  }
];

// Find user by email & password (mock auth)
function authenticate(email, password) {
  return users.find(u => u.email === email && u.password === password) || null;
}

// Find user by Stripe customer ID
function findUserByStripeCustomerId(customerId) {
  return users.find(u => u.stripeCustomerId === customerId) || null;
}

// Update subscription status
function updateUserSubscriptionStatus(userId, status) {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.subscriptionStatus = status;
  }
}

module.exports = {
  users,
  authenticate,
  findUserByStripeCustomerId,
  updateUserSubscriptionStatus
};
```

// 2. Backend: Express Server (`server.js`)

```javascript
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
  authenticate,
  findUserByStripeCustomerId,
  updateUserSubscriptionStatus
} = require('./users');

const app = express();
app.use(bodyParser.json());

// Secret for JWT signing (use env var in real apps)
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Login endpoint - returns JWT token and user profile
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = authenticate(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      subscriptionStatus: user.subscriptionStatus
    }
  });
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, userData) => {
    if (err) return res.sendStatus(403);
    req.userId = userData.id;
    next();
  });
}

// Profile endpoint - returns user subscription status
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = require('./users').users.find(u => u.id === req.userId);
  if (!user) return res.sendStatus(404);

  res.json({
    id: user.id,
    email: user.email,
    subscriptionStatus: user.subscriptionStatus
  });
});

// Stripe webhook endpoint
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      handleSubscriptionUpdate(event.data.object);
      break;
    case 'customer.subscription.deleted':
      handleSubscriptionCanceled(event.data.object);
      break;
    default:
      break;
  }

  res.json({ received: true });
});

function handleSubscriptionUpdate(subscription) {
  const customerId = subscription.customer;
  const status = subscription.status;

  const user = findUserByStripeCustomerId(customerId);
  if (!user) return;

  if (status === 'active') {
    updateUserSubscriptionStatus(user.id, 'subscriber');
  } else {
    updateUserSubscriptionStatus(user.id, 'visitor');
  }
}

function handleSubscriptionCanceled(subscription) {
  const customerId = subscription.customer;
  const user = findUserByStripeCustomerId(customerId);
  if (!user) return;

  updateUserSubscriptionStatus(user.id, 'visitor');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
``
//  1. User Registration & Password Hashing (Node.js example)

Use `bcrypt` to securely store passwords.

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Register user
async function registerUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  // Save user with hashedPassword to DB
}

// Authenticate user
async function authenticate(email, password) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.hashedPassword);
  if (match) return user;
  return null;
}
```
// 2. Database Integration Example (SQLite + Sequelize ORM)

//This keeps user data persistent.

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  hashedPassword: { type: DataTypes.STRING, allowNull: false },
  stripeCustomerId: { type: DataTypes.STRING },
  subscriptionStatus: { type: DataTypes.STRING, defaultValue: 'visitor' }
});

(async () => {
  await sequelize.sync();
})();

module.exports = User;

// 4. Dockerfile Example

// FROM node:18-alpine

// WORKDIR /app

//COPY package*.json ./
//RUN npm install

//COPY . .

//EXPOSE 3000

//CMD ["node", "server.js"]
```
-

// 5. Frontend React Example

import React, { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (token) {
      fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` }})
        .then(res => res.json())
        .then(setUser)
        .catch(() => {
          setToken(null);
          localStorage.removeItem('authToken');
        });
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email, password})
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setUser(data.user);
    } else {
      alert('Login failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <div>
      {!token ? (
        <form onSubmit={handleLogin}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      ) : (
        <>
          <p>Welcome, {user.email}!</p>
          <p>Subscription status: {user.subscriptionStatus}</p>
          {user.subscriptionStatus === 'subscriber' ? (
            <p>Here is your full premium content.</p>
          ) : (
            <p>You are a visitor. Upgrade to see premium content.</p>
          )}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default App;
```

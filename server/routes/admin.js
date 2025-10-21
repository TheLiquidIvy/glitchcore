// server/routes/admin.js
const express = require('express');
const { User, Order, PodDraft } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Middleware to check admin role (simplified)
async function checkAdmin(req, res, next) {
  const user = await User.findByPk(req.userId);
  // Assuming a status of 'admin' in the database grants admin privileges
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

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { JWT_SECRET, PORT, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = require('./config');
const { sequelize, User } = require('./models');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const podDraftRoutes = require('./routes/podDrafts');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/user');
const forumRoutes = require('./routes/forum');

const app = express();
app.use(cors());

// Stripe webhook listener (raw body parser)
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = require('stripe').webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    // Handle webhook events here
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Regular JSON parser (after webhook)
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/podDrafts', podDraftRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forum', forumRoutes);

// Profile route
app.get('/api/profile', require('./middleware/authenticateToken'), async (req, res) => {
  const user = await User.findByPk(req.userId, { 
    attributes: ['id', 'email', 'subscriptionStatus'] 
  });
  if (!user) return res.sendStatus(404);
  res.json(user);
});

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

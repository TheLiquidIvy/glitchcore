const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { JWT_SECRET, PORT, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = require('./config');
const { sequelize, User } = require('./models');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const podDraftRoutes = require('./routes/podDrafts');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blog'); // <-- ADD THIS

const app = express();
app.use(cors());

// --- 1. STRIPE WEBHOOK LISTENER ... (rest of this is unchanged) ...
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  // ... (your existing webhook logic) ...
});

// --- 2. REGULAR JSON PARSER (AFTER WEBHOOK) ---
app.use(bodyParser.json());

// --- 3. ROUTES ---
app.use('/api/auth', authRoutes);
app.get('/api/profile', require('./middleware/authenticateToken'), async (req, res) => {
  // ... (your existing profile route) ...
  const user = await User.findByPk(req.userId, { 
    attributes: ['id', 'email', 'subscriptionStatus'] 
  });
  if (!user) return res.sendStatus(404);
  res.json(user);
});

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/podDrafts', podDraftRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes); // <-- ADD THIS

// Health check
app.get('/', (req, res) => res.send('API is running'));

// Sync DB and start server
// sequelize.sync({ alter: true }) ... (rest of this is unchanged) ...
sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync DB:', err);
});

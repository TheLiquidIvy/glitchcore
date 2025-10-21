// server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { JWT_SECRET, PORT, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = require('./config');
const { sequelize, User } = require('./models');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const podDraftRoutes = require('./routes/podDrafts');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());

// --- 1. STRIPE WEBHOOK LISTENER (MUST BE BEFORE JSON PARSER) ---
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    // The stripe client needs to be initialized here to handle the raw body
    const stripe = require('stripe')(STRIPE_SECRET_KEY); 
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle subscription events
    switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            const subscription = event.data.object;
            const customerId = subscription.customer;
            const user = await User.findOne({ where: { stripeCustomerId: customerId } });

            if (user) {
                let status = 'visitor';
                if (subscription.status === 'active') {
                    status = 'subscriber';
                }
                user.subscriptionStatus = status;
                await user.save();
                console.log(`Subscription updated for user ${user.id} to ${status}`);
            }
            break;
        default:
            break;
    }

    res.json({ received: true });
});

// --- 2. REGULAR JSON PARSER (AFTER WEBHOOK) ---
app.use(bodyParser.json());

// --- 3. ROUTES ---
app.use('/api/auth', authRoutes);
// We expose the user profile data here (often done via a simple lookup in middleware)
app.get('/api/profile', require('./middleware/authenticateToken'), async (req, res) => {
    const user = await User.findByPk(req.userId, { 
        attributes: ['id', 'email', 'subscriptionStatus'] 
    });
    if (!user) return res.sendStatus(404);
    res.json(user);
});

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

// server.js (before app.use(bodyParser.json());)

// 1. Stripe Webhook Listener (must use raw body)
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = require('stripe')(STRIPE_SECRET_KEY); // Move stripe init here for webhook handler
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events to update DB status
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

// Now, load the keys and models you'll need after the raw body parser
const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = require('./config');
const { User } = require('./models');

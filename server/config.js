// server/config.js
require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  PORT: process.env.PORT || 3001,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
};

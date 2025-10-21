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

// Order model (from Part 1)
const Order = sequelize.define('Order', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  orderDate: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'completed' },
  description: { type: DataTypes.STRING },
  stripePaymentIntentId: { type: DataTypes.STRING, unique: true }
});

// POD Draft model (from Part 1)
const PodDraft = sequelize.define('PodDraft', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'draft' }
});

// Recommendation model (from Part 1)
const Recommendation = sequelize.define('Recommendation', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  imageId: { type: DataTypes.INTEGER },
  reason: { type: DataTypes.STRING }
});

// Image model (for recommendations demo) (from Part 1)
const Image = sequelize.define('Image', {
  url: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING }
});

// --- NEW BLOG POST MODEL ---
const BlogPost = sequelize.define('BlogPost', {
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  excerpt: { type: DataTypes.TEXT, allowNull: true },
  featuredImage: { type: DataTypes.STRING, allowNull: true },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  publishedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
});
// ----------------------------

// Relationships
User.hasMany(Order, { foreignKey: 'userId' });
User.hasMany(PodDraft, { foreignKey: 'userId' });
User.hasMany(Recommendation, { foreignKey: 'userId' });
// Add any new relationships if needed, e.g., User.hasMany(BlogPost)

module.exports = { 
  sequelize, 
  User, 
  Order, 
  PodDraft, 
  Recommendation, 
  Image, 
  BlogPost, // <-- Add BlogPost here
  Op 
};

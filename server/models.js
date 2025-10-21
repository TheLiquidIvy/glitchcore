const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// ... inside server/models.js

// User model
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  hashedPassword: { type: DataTypes.STRING, allowNull: false },
  stripeCustomerId: { type: DataTypes.STRING },
  subscriptionStatus: { type: DataTypes.STRING, defaultValue: 'visitor' },

  // --- ADD THESE NEW FIELDS ---
  bio: { type: DataTypes.TEXT, allowNull: true },
  avatarUrl: { type: DataTypes.STRING, allowNull: true },
  socialLinks: { type: DataTypes.JSON, allowNull: true }, // e.g. { twitter: '', instagram: '' }
  theme: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    defaultValue: 'light' 
  },

  // ... inside server/models.js
// ... (after User, Order, PodDraft, Recommendation, Image, BlogPost models) ...

// --- NEW FORUM MODELS ---

const ForumCategory = sequelize.define('ForumCategory', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
});

const Topic = sequelize.define('Topic', {
  title: { type: DataTypes.STRING, allowNull: false },
  // Foreign keys (userId, categoryId) will be added by associations
});

const Post = sequelize.define('Post', {
  content: { type: DataTypes.TEXT, allowNull: false },
  // Foreign keys (userId, topicId) will be added by associations
});

// ----------------------------

// --- RELATIONSHIPS ---
// (Existing relationships)
User.hasMany(Order, { foreignKey: 'userId' });
User.hasMany(PodDraft, { foreignKey: 'userId' });
User.hasMany(Recommendation, { foreignKey: 'userId' });
// ... (add User.hasMany(BlogPost) if you want)

// (New Forum relationships)
// User <-> Topic/Post
User.hasMany(Topic, { foreignKey: 'userId' });
Topic.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

// Category <-> Topic
ForumCategory.hasMany(Topic, { foreignKey: 'categoryId' });
Topic.belongsTo(ForumCategory, { foreignKey: 'categoryId' });

// Topic <-> Post
Topic.hasMany(Post, { foreignKey: 'topicId' });
Post.belongsTo(Topic, { foreignKey: 'topicId' });
// ----------------------------


module.exports = { 
  sequelize, 
  User, 
  Order, 
  PodDraft, 
  Recommendation, 
  Image, 
  BlogPost,
  // --- ADD THESE ---
  ForumCategory,
  Topic,
  Post,
  // -----------------
  Op 
};
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

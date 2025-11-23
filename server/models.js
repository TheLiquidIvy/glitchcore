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
  subscriptionStatus: { type: DataTypes.STRING, defaultValue: 'visitor' },
  bio: { type: DataTypes.TEXT, allowNull: true },
  avatarUrl: { type: DataTypes.STRING, allowNull: true },
  socialLinks: { type: DataTypes.JSON, allowNull: true },
  theme: { type: DataTypes.STRING, allowNull: false, defaultValue: 'light' },
});

// Order model
const Order = sequelize.define('Order', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  orderDate: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'completed' },
  description: { type: DataTypes.STRING },
  stripePaymentIntentId: { type: DataTypes.STRING, unique: true }
});

// POD Draft model
const PodDraft = sequelize.define('PodDraft', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'draft' }
});

// Recommendation model
const Recommendation = sequelize.define('Recommendation', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  imageId: { type: DataTypes.INTEGER },
  reason: { type: DataTypes.STRING }
});

// Image model
const Image = sequelize.define('Image', {
  url: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING }
});

// Blog Post model
const BlogPost = sequelize.define('BlogPost', {
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  excerpt: { type: DataTypes.TEXT, allowNull: true },
  featuredImage: { type: DataTypes.STRING, allowNull: true },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  publishedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
});

// Forum Category model
const ForumCategory = sequelize.define('ForumCategory', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
});

// Forum Topic model
const Topic = sequelize.define('Topic', {
  title: { type: DataTypes.STRING, allowNull: false },
});

// Forum Post model
const Post = sequelize.define('Post', {
  content: { type: DataTypes.TEXT, allowNull: false },
});

// Relationships
User.hasMany(Order, { foreignKey: 'userId' });
User.hasMany(PodDraft, { foreignKey: 'userId' });
User.hasMany(Recommendation, { foreignKey: 'userId' });
User.hasMany(Topic, { foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId' });

ForumCategory.hasMany(Topic, { foreignKey: 'categoryId' });
Topic.belongsTo(ForumCategory, { foreignKey: 'categoryId' });
Topic.belongsTo(User, { foreignKey: 'userId' });

Topic.hasMany(Post, { foreignKey: 'topicId' });
Post.belongsTo(Topic, { foreignKey: 'topicId' });
Post.belongsTo(User, { foreignKey: 'userId' });

module.exports = { 
  sequelize, 
  User, 
  Order, 
  PodDraft, 
  Recommendation, 
  Image, 
  BlogPost,
  ForumCategory,
  Topic,
  Post,
  Op 
};

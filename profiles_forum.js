// Step 1: Backend – User Profile System

// 1. Extend User Model

//Add profile fields in `models/User.js`:

// Inside User model definition
bio: { type: DataTypes.TEXT, allowNull: true },
avatarUrl: { type: DataTypes.STRING, allowNull: true },
socialLinks: { type: DataTypes.JSON, allowNull: true }, // e.g. { twitter: '', instagram: '' }

// 2. Create Migration for New Fields

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'bio', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('Users', 'avatarUrl', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Users', 'socialLinks', { type: Sequelize.JSON, allowNull: true });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'bio');
    await queryInterface.removeColumn('Users', 'avatarUrl');
    await queryInterface.removeColumn('Users', 'socialLinks');
  },
};

//Run migration:

npx sequelize-cli db:migrate

// 3. Add Profile API Routes

//Create or update `routes/user.js`:

const express = require('express');
const { User } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// Get current user's profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'bio', 'avatarUrl', 'socialLinks'],
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update current user's profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { bio, avatarUrl, socialLinks } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ bio, avatarUrl, socialLinks });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// Step 2: Backend – Basic Forum System

// 1. Create Forum Models

//Create `models/ForumCategory.js` (optional but useful):

module.exports = (sequelize, DataTypes) => {
  const ForumCategory = sequelize.define('ForumCategory', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
  });
  ForumCategory.associate = models => {
    ForumCategory.hasMany(models.Topic, { foreignKey: 'categoryId' });
  };
  return ForumCategory;
};

//Create `models/Topic.js`:

module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
    title: { type: DataTypes.STRING, allowNull: false },
  });
  Topic.associate = models => {
    Topic.belongsTo(models.User, { foreignKey: 'userId' });
    Topic.belongsTo(models.ForumCategory, { foreignKey: 'categoryId' });
    Topic.hasMany(models.Post, { foreignKey: 'topicId' });
  };
  return Topic;
};

//Create `models/Post.js`:

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: { type: DataTypes.TEXT, allowNull: false },
  });
  Post.associate = models => {
    Post.belongsTo(models.User, { foreignKey: 'userId' });
    Post.belongsTo(models.Topic, { foreignKey: 'topicId' });
  };
  return Post;
};

// 2. Create Migrations

//Generate and run migrations for these models, or create one migration file adding all tables.

await queryInterface.createTable('ForumCategories', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, unique: true, allowNull: false },
  description: { type: Sequelize.TEXT },
  createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

// Topics and Posts with foreign keys.


// 3. Create Forum Routes

//Create `routes/forum.js`:

const express = require('express');
const { ForumCategory, Topic, Post, User } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// List categories
router.get('/categories', async (req, res) => {
  const categories = await ForumCategory.findAll();
  res.json(categories);
});

// List topics in a category
router.get('/categories/:categoryId/topics', async (req, res) => {
  const topics = await Topic.findAll({
    where: { categoryId: req.params.categoryId },
    include: [{ model: User, attributes: ['id', 'username'] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(topics);
});

// Get single topic with posts
router.get('/topics/:topicId', async (req, res) => {
  const topic = await Topic.findByPk(req.params.topicId, {
    include: [
      { model: User, attributes: ['id', 'username'] },
      { model: Post, include: [{ model: User, attributes: ['id', 'username'] }], order: [['createdAt', 'ASC']] },
    ],
  });
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  res.json(topic);
});

// Create topic (auth required)
router.post('/categories/:categoryId/topics', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

  const topic = await Topic.create({
    title,
    categoryId: req.params.categoryId,
    userId: req.user.id,
  });

  await Post.create({
    content,
    topicId: topic.id,
    userId: req.user.id,
  });

  res.status(201).json(topic);
});

// Add post/reply to topic (auth required)
router.post('/topics/:topicId/posts', authenticateToken, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content required' });

  const topic = await Topic.findByPk(req.params.topicId);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });

  const post = await Post.create({
    content,
    topicId: topic.id,
    userId: req.user.id,
  });

  res.status(201).json(post);
});

module.exports = router;

Register routes in `server.js`:

const forumRoutes = require('./routes/forum');
app.use('/api/forum', forumRoutes);

// Step 3: Frontend Next Steps

// 1. Migration for User Profile Fields

//Create a migration file, e.g., `20240601-add-user-profile-fields.js`:

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'avatarUrl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'socialLinks', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'bio');
    await queryInterface.removeColumn('Users', 'avatarUrl');
    await queryInterface.removeColumn('Users', 'socialLinks');
  },
};

// 2. Migration for Forum Categories

//Create `20240601-create-forum-categories.js`:

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ForumCategories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ForumCategories');
  },
};

// 3. Migration for Topics

//Create `20240601-create-topics.js`:

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Topics', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ForumCategories', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Topics');
  },
};

// 4. Migration for Posts

//Create `20240601-create-posts.js`:

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      topicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Topics', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Posts');
  },
};

// Running Migrations

//1. Place these files in your migrations folder (usually `migrations/`).
//2. Run migrations with Sequelize CLI:

npx sequelize-cli db:migrate

// Quick API Testing Examples (using curl)

// Get current user profile (with token)

curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/users/me

// Update user profile

curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d '{"bio":"Hello!","avatarUrl":"http://example.com/avatar.jpg","socialLinks":{"twitter":"@user"}}' http://localhost:3000/api/users/me

// List forum categories

curl http://localhost:3000/api/forum/categories

// Create topic (replace CATEGORY_ID)

curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d '{"title":"New Topic","content":"This is the first post."}' http://localhost:3000/api/forum/categories/CATEGORY_ID/topics


// Step 1: Backend – Store User Theme Preference

//Add a new field `theme` to the user profile in the database.

// 1. Update User Model

//Add `theme` field in your User model (`models/User.js`):

theme: { 
  type: DataTypes.STRING, 
  allowNull: false, 
  defaultValue: 'light' // default theme
},

// 2. Migration to Add `theme` Column

//Create migration file `20240601-add-user-theme.js`:

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'theme', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'light',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'theme');
  },
};

npx sequelize-cli db:migrate

// 3. Update API Routes

const { bio, avatarUrl, socialLinks, theme } = req.body;

// Validate theme (optional)
const validThemes = ['light', 'dark', 'green', 'pink'];
if (theme && !validThemes.includes(theme)) {
  return res.status(400).json({ error: 'Invalid theme selected' });
}

await user.update({ bio, avatarUrl, socialLinks, theme });

// Step 2: Frontend – Implement Theme Support

// 1. Store User Theme and Apply Styles


:root {
  --bg-color: #fff;
  --text-color: #000;
}

body.theme-light {
  --bg-color: #fff;
  --text-color: #000;
}

body.theme-dark {
  --bg-color: #121212;
  --text-color: #e0e0e0;
}

body.theme-green {
  --bg-color: #e6f4ea;
  --text-color: #2f6f4e;
}

body.theme-pink {
  --bg-color: #ffe6f0;
  --text-color: #a8325f;
}

.profile-container {
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 1rem;
  border-radius: 8px;
}

// 3. React Example to Apply Theme Class

import React, { useEffect, useState } from 'react';

function UserProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/users/me', {
        headers: { Authorization: 'Bearer YOUR_TOKEN' },
      });
      const data = await res.json();
      setProfile(data);

      // Apply theme class to body
      if (data.theme) {
        document.body.className = `theme-${data.theme}`;
      }
    }
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h1>{profile.username}'s Profile</h1>
      <p>{profile.bio}</p>
      {/* Add other profile details */}
      {/* Add theme selector */}
      <ThemeSelector currentTheme={profile.theme} />
    </div>
  );
}

function ThemeSelector({ currentTheme }) {
  const themes = ['light', 'dark', 'green', 'pink'];
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  async function handleChange(e) {
    const newTheme = e.target.value;
    setSelectedTheme(newTheme);

    // Update theme on server
    await fetch('/api/users/me', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_TOKEN',
      },
      body: JSON.stringify({ theme: newTheme }),
    });

    // Apply theme class to body immediately
    document.body.className = `theme-${newTheme}`;
  }

  return (
    <select value={selectedTheme} onChange={handleChange} aria-label="Select profile theme">
      {themes.map(theme => (
        <option key={theme} value={theme}>
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </option>
      ))}
    </select>
  );
}

export default UserProfile;



/**
 * UserProfile component fetches user info, allows editing bio, avatar, social links,
 * and theme selection. Applies theme dynamically to the document body.
 */
function UserProfile() {
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    avatarUrl: '',
    socialLinks: {},
    theme: 'light',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/users/me', {
          headers: { Authorization: 'Bearer YOUR_TOKEN' }, // Replace with actual token
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();

        setProfile({
          username: data.username || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
          socialLinks: data.socialLinks || {},
          theme: data.theme || 'light',
        });

        // Apply theme class to body
        document.body.className = `theme-${data.theme || 'light'}`;
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Handle input changes for controlled form inputs
  function handleChange(event) {
    const { name, value } = event.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  // Handle social links input changes (assume JSON keys)
  function handleSocialChange(event) {
    const { name, value } = event.target;
    setProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  }

  // Handle theme change immediately and save on form submit
  function handleThemeChange(event) {
    const newTheme = event.target.value;
    setProfile(prev => ({ ...prev, theme: newTheme }));
    document.body.className = `theme-${newTheme}`;
  }

  // Save profile to backend
  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer YOUR_TOKEN', // Replace with actual token
        },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save profile');
      }
      setSaving(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  return (
    <section aria-labelledby="profile-heading" className="profile-container">
      <h1 id="profile-heading">{profile.username}'s Profile</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows="4"
            cols="50"
            placeholder="Tell us about yourself"
          />
        </div>

        <div>
          <label htmlFor="avatarUrl">Avatar URL:</label>
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            value={profile.avatarUrl}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <fieldset>
          <legend>Social Links:</legend>
          <div>
            <label htmlFor="twitter">Twitter:</label>
            <input
              type="url"
              id="twitter"
              name="twitter"
              value={profile.socialLinks.twitter || ''}
              onChange={handleSocialChange}
              placeholder="https://twitter.com/username"
            />
          </div>
          <div>
            <label htmlFor="linkedin">LinkedIn:</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={profile.socialLinks.linkedin || ''}
              onChange={handleSocialChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          {/* Add more social inputs as needed */}
        </fieldset>

        <div>
          <label htmlFor="theme">Profile Theme:</label>
          <select
            id="theme"
            name="theme"
            value={profile.theme}
            onChange={handleThemeChange}
            aria-describedby="theme-desc"
          >
            {THEMES.map(theme => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
          <small id="theme-desc">Select your preferred profile theme.</small>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      {/* Optional: show avatar preview */}
      {profile.avatarUrl && (
        <div className="avatar-preview" aria-label="Avatar preview">
          <img
            src={profile.avatarUrl}
            alt={`${profile.username}'s avatar`}
            width={100}
            height={100}
            style={{ borderRadius: '50%', marginTop: '1rem' }}
          />
        </div>
      )}
    </section>
  );
}

export default UserProfile;

// Required CSS for themes and basic styling (put this in your CSS file)

:root {
  --bg-color: #fff;
  --text-color: #000;
  --input-bg: #fff;
  --input-border: #ccc;
  --button-bg: #007bff;
  --button-color: #fff;
}

body.theme-light {
  --bg-color: #fff;
  --text-color: #000;
  --input-bg: #fff;
  --input-border: #ccc;
  --button-bg: #007bff;
  --button-color: #fff;
}

body.theme-dark {
  --bg-color: #121212;
  --text-color: #e0e0e0;
  --input-bg: #222;
  --input-border: #555;
  --button-bg: #1e90ff;
  --button-color: #fff;
}

body.theme-green {
  --bg-color: #e6f4ea;
  --text-color: #2f6f4e;
  --input-bg: #d0e8d0;
  --input-border: #2f6f4e;
  --button-bg: #3a8f3a;
  --button-color: #fff;
}

body.theme-pink {
  --bg-color: #ffe6f0;
  --text-color: #a8325f;
  --input-bg: #ffd6e7;
  --input-border: #a8325f;
  --button-bg: #d6336c;
  --button-color: #fff;
}

.profile-container {
  background-color: var(--bg-color);
  color: var(--text-color);
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  border-radius: 10px;
  font-family: Arial, sans-serif;
}

.profile-container label {
  display: block;
  margin: 0.5rem 0 0.25rem;
}

.profile-container input[type="url"],
.profile-container textarea,
.profile-container select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--input-border);
  border-radius: 5px;
  background-color: var(--input-bg);
  color: var(--text-color);
  font-size: 1rem;
}

.profile-container button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--button-bg);
  color: var(--button-color);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.profile-container button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.avatar-preview img {
  display: block;
  border: 2px solid var(--input-border);
}


// GET `/api/forum/categories` — list categories
// GET `/api/forum/categories/:categoryId/topics` — list topics in category
// POST `/api/forum/categories/:categoryId/topics` — create topic (with first post content)
// GET `/api/forum/topics/:topicId/posts` — list posts in topic
// POST `/api/forum/topics/:topicId/posts` — create post

// 1. ForumCategories Component (list all categories)

import React, { useEffect, useState } from 'react';

function ForumCategories({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/forum/categories');
      const data = await res.json();
      setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <section aria-label="Forum categories">
      <h2>Forum Categories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            <button onClick={() => onSelectCategory(cat)}>{cat.name}</button>
            <p>{cat.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ForumCategories;

// 2. TopicsList Component (list topics and create new topic)

import React, { useEffect, useState } from 'react';

function TopicsList({ category, onSelectTopic }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopics() {
      setLoading(true);
      const res = await fetch(`/api/forum/categories/${category.id}/topics`);
      if (!res.ok) {
        setError('Failed to load topics');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTopics(data);
      setLoading(false);
    }
    fetchTopics();
  }, [category]);

  async function handleCreateTopic(e) {
    e.preventDefault();
    setError(null);

    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const res = await fetch(`/api/forum/categories/${category.id}/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer YOUR_TOKEN', // Replace with auth token
        },
        body: JSON.stringify({ title: newTopicTitle, content: newTopicContent }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create topic');
      }

      // Refresh topics list after creation
      const createdTopic = await res.json();
      setTopics(prev => [createdTopic, ...prev]);
      setNewTopicTitle('');
      setNewTopicContent('');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading topics...</p>;

  return (
    <section aria-label={`Topics in category ${category.name}`}>
      <h2>Topics in {category.name}</h2>

      <form onSubmit={handleCreateTopic}>
        <h3>Create New Topic</h3>
        {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
        <div>
          <label htmlFor="topicTitle">Title:</label>
          <input
            id="topicTitle"
            type="text"
            value={newTopicTitle}
            onChange={e => setNewTopicTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="topicContent">Content:</label>
          <textarea
            id="topicContent"
            rows="4"
            value={newTopicContent}
            onChange={e => setNewTopicContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Topic</button>
      </form>

      <ul>
        {topics.map(topic => (
          <li key={topic.id}>
            <button onClick={() => onSelectTopic(topic)}>{topic.title}</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TopicsList;

// 3. PostsList Component (list posts and add new post)

import React, { useEffect, useState } from 'react';

function PostsList({ topic }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const res = await fetch(`/api/forum/topics/${topic.id}/posts`);
      if (!res.ok) {
        setError('Failed to load posts');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, [topic]);

  async function handleCreatePost(e) {
    e.preventDefault();
    setError(null);

    if (!newPostContent.trim()) {
      setError('Post content is required');
      return;
    }

    try {
      const res = await fetch(`/api/forum/topics/${topic.id}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer YOUR_TOKEN', // Replace with auth token
        },
        body: JSON.stringify({ content: newPostContent }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create post');
      }

      // Refresh posts list after creation
      const createdPost = await res.json();
      setPosts(prev => [...prev, createdPost]);
      setNewPostContent('');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading posts...</p>;

  return (
    <section aria-label={`Posts in topic ${topic.title}`}>
      <h2>Posts in {topic.title}</h2>

      <ul>
        {posts.map(post => (
          <li key={post.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
            <p>{post.content}</p>
            <small>By User #{post.userId} at {new Date(post.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCreatePost}>
        <h3>Add a Reply</h3>
        {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
        <textarea
          rows="4"
          value={newPostContent}
          onChange={e => setNewPostContent(e.target.value)}
          required
          placeholder="Write your reply here..."
        />
        <br />
        <button type="submit">Post Reply</button>
      </form>
    </section>
  );
}

export default PostsList;

// 4. Putting It All Together: ForumApp Component

import React, { useState } from 'react';
import ForumCategories from './ForumCategories';
import TopicsList from './TopicsList';
import PostsList from './PostsList';

function ForumApp() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  function handleBackToCategories() {
    setSelectedCategory(null);
    setSelectedTopic(null);
  }

  function handleBackToTopics() {
    setSelectedTopic(null);
  }

  return (
    <main>
      {!selectedCategory && (
        <ForumCategories onSelectCategory={setSelectedCategory} />
      )}

      {selectedCategory && !selectedTopic && (
        <>
          <button onClick={handleBackToCategories} aria-label="Back to categories">
            ← Back to Categories
          </button>
          <TopicsList category={selectedCategory} onSelectTopic={setSelectedTopic} />
        </>
      )}

      {selectedTopic && (
        <>
          <button onClick={handleBackToTopics} aria-label="Back to topics">
            ← Back to Topics
          </button>
          <PostsList topic={selectedTopic} />
        </>
      )}
    </main>
  );
}

export default ForumApp;

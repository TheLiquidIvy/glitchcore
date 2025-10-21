// 1. Install React Router if not done yet

//```bash
//npm install react-router-dom

// 2. Update `src/App.js` to include routing and new pages

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PodDraftsManager from './components/PodDraftsManager';
import Home from './components/Home';
import About from './components/About';
import Blog from './components/Blog';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken('');
  };

  return (
    <Router>
      <header style={headerStyle}>
        <h1>My Culture Shop</h1>
        <nav>
          <Link to="/" style={linkStyle}>Home</Link> |{' '}
          <Link to="/about" style={linkStyle}>About</Link> |{' '}
          <Link to="/blog" style={linkStyle}>Blog</Link> |{' '}
          {token ? (
            <>
              <Link to="/dashboard" style={linkStyle}>Dashboard</Link> |{' '}
              <button onClick={logout} style={buttonStyle}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={linkStyle}>Login</Link>
          )}
        </nav>
      </header>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />

          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <AuthForm setToken={setToken} />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <RegisterForm setToken={setToken} />} />

          <Route path="/dashboard" element={token ? (
            <>
              <Dashboard token={token} />
              <hr />
              <PodDraftsManager token={token} />
            </>
          ) : (
            <Navigate to="/login" />
          )} />
        </Routes>
      </main>

      <footer style={footerStyle}>
        &copy; {new Date().getFullYear()} My Culture Shop. All rights reserved.
      </footer>
    </Router>
  );
}

// Include existing AuthForm and RegisterForm here or import them

const headerStyle = {
  background: '#222',
  color: 'white',
  padding: '10px 20px',
};
const linkStyle = {
  color: 'lightblue',
  textDecoration: 'none',
};
const buttonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'lightblue',
  cursor: 'pointer',
  fontSize: '1em',
};
const footerStyle = {
  textAlign: 'center',
  padding: '20px',
  fontSize: '0.8em',
  background: '#f5f5f5',
  marginTop: '40px',
};

export default App;

// 3. `src/components/Home.js`

import React from 'react';

export default function Home() {
  return (
    <section>
      <h2>Welcome to My Culture Shop</h2>
      <p>
        Discover unique art and cultural products that connect you with creativity and heritage.
      </p>
      <div style={imageContainer}>
        <img src="https://source.unsplash.com/800x300/?culture,art" alt="Culture Art" style={imageStyle} />
      </div>
      <p style={{ marginTop: '1rem' }}>
        Browse our shop, explore blog stories, and create your own print-on-demand drafts.
      </p>
    </section>
  );
}

const imageContainer = {
  overflow: 'hidden',
  borderRadius: '8px',
  maxWidth: '800px',
  margin: 'auto',
};

const imageStyle = {
  width: '100%',
  height: 'auto',
  display: 'block',
};

// 4. `src/components/About.js`

import React from 'react';

export default function About() {
  return (
    <section>
      <h2>About Us</h2>
      <p>
        My Culture Shop is a community-driven platform celebrating art and culture.
        We provide a space for artists to showcase their work and for customers to discover meaningful products.
      </p>
      <p>
        Our mission is to empower creators and bring cultural stories to life through unique print-on-demand products.
      </p>
    </section>
  );
}

// 5. `src/components/Blog.js`

import React, { useEffect, useState } from 'react';

// Example blog posts data (replace or fetch from backend)
const examplePosts = [
  { id: 1, title: 'The Art of Storytelling', category: 'Art', date: '2024-05-01' },
  { id: 2, title: 'Cultural Heritage in Modern Design', category: 'Culture', date: '2024-04-28' },
  { id: 3, title: 'Top 10 Artists to Watch', category: 'Art', date: '2024-05-10' },
  { id: 4, title: 'Sustainability in Art Supplies', category: 'Sustainability', date: '2024-03-15' },
];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // In real app, fetch from backend API
    setPosts(examplePosts);
  }, []);

  const categories = ['All', ...new Set(posts.map(post => post.category))];

  const filteredPosts = filter === 'All' ? posts : posts.filter(post => post.category === filter);

  return (
    <section>
      <h2>Blog</h2>

      <div>
        <label htmlFor="categoryFilter">Filter by category: </label>
        <select id="categoryFilter" value={filter} onChange={e => setFilter(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <ul style={listStyle}>
        {filteredPosts.length === 0 ? (
          <p>No posts found in this category.</p>
        ) : (
          filteredPosts.map(post => (
            <li key={post.id} style={postItemStyle}>
              <h3>{post.title}</h3>
              <p><em>{post.category} - {new Date(post.date).toLocaleDateString()}</em></p>
              <p>
                {/* A short excerpt or summary can go here */}
                This is a summary of the blog post content to give a preview.
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

const listStyle = {
  listStyleType: 'none',
  paddingLeft: 0,
};

const postItemStyle = {
  borderBottom: '1px solid #ddd',
  paddingBottom: '1rem',
  marginBottom: '1rem',
};

// Step 1: Backend Blog Posts API

//Add a new Sequelize model `BlogPost`:

// models/BlogPost.js
module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    excerpt: { type: DataTypes.TEXT, allowNull: true },
    featuredImage: { type: DataTypes.STRING, allowNull: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    publishedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  });
  return BlogPost;
};

// routes/blog.js
const express = require('express');
const { BlogPost } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// Get all posts (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category && category !== 'All' ? { category } : {};
    const posts = await BlogPost.findAll({ where, order: [['publishedAt', 'DESC']] });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ where: { slug: req.params.slug } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: create post (secured)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Ideally check admin role here too
    const { title, category, content, excerpt, featuredImage, slug, publishedAt } = req.body;
    if (!title || !category || !content || !slug) return res.status(400).json({ error: 'Missing required fields' });

    const existing = await BlogPost.findOne({ where: { slug } });
    if (existing) return res.status(400).json({ error: 'Slug already exists' });

    const post = await BlogPost.create({ title, category, content, excerpt, featuredImage, slug, publishedAt });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: update post by slug
router.put('/:slug', authenticateToken, async (req, res) => {
  try {
    const post = await BlogPost.findOne({ where: { slug: req.params.slug } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await post.update(req.body);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: delete post by slug
router.delete('/:slug', authenticateToken, async (req, res) => {
  try {
    const post = await BlogPost.findOne({ where: { slug: req.params.slug } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await post.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
```

const blogRoutes = require('./routes/blog');
app.use('/api/blog', blogRoutes);

// Step 2: Frontend Blog Components with Fetching & Routing


// 1. `src/components/Blog.js` – List with filter and links

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  async function fetchPosts() {
    try {
      const url = filter === 'All' ? '/api/blog' : `/api/blog?category=${encodeURIComponent(filter)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);

      // Extract categories dynamically
      if (filter === 'All' && data.length) {
        const cats = Array.from(new Set(data.map(p => p.category)));
        setCategories(['All', ...cats]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section>
      <h2>Blog</h2>
      <label htmlFor="categoryFilter">Filter by category: </label>
      <select id="categoryFilter" value={filter} onChange={e => setFilter(e.target.value)}>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {posts.map(post => (
            <li key={post.id} style={{ marginBottom: '1.5rem' }}>
              <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
              <p><em>{post.category} - {new Date(post.publishedAt).toLocaleDateString()}</em></p>
              {post.featuredImage && (
                <img src={post.featuredImage} alt={post.title} style={{ maxWidth: '300px' }} />
              )}
              <p>{post.excerpt || post.content.slice(0, 150) + '...'}</p>
              <Link to={`/blog/${post.slug}`}>Read more</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// 2. `src/components/BlogPostDetail.js` – Single post page

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  async function fetchPost() {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (res.status === 404) {
        setError('Post not found');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch post');
      const data = await res.json();
      setPost(data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <article>
      <h2>{post.title}</h2>
      <p><em>{post.category} - {new Date(post.publishedAt).toLocaleDateString()}</em></p>
      {post.featuredImage && <img src={post.featuredImage} alt={post.title} style={{ maxWidth: '600px' }} />}
      <div dangerouslySetInnerHTML={{ __html: post.content }} style={{ marginTop: '1rem' }} />
      <p><Link to="/blog">&larr; Back to Blog</Link></p>
    </article>
  );
}

// 3. Update `src/App.js` routes to include detail page

import BlogPostDetail from './components/BlogPostDetail';

// Inside <Routes> add:
<Route path="/blog/:slug" element={<BlogPostDetail />} />

// Step 3: Simple Blog Admin UI to Add Posts (optional)

import React, { useState } from 'react';

export default function BlogAdmin({ token }) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    slug: '',
    publishedAt: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create post');
      }
      setSuccess('Post created successfully!');
      setForm({
        title: '',
        category: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        slug: '',
        publishedAt: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Create Blog Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input name="slug" placeholder="Slug (unique URL part)" value={form.slug} onChange={handleChange} required />
        <input name="featuredImage" placeholder="Featured Image URL" value={form.featuredImage} onChange={handleChange} />
        <textarea name="excerpt" placeholder="Excerpt" value={form.excerpt} onChange={handleChange} />
        <textarea name="content" placeholder="Content (HTML allowed)" value={form.content} onChange={handleChange} required />
        <label>
          Published At:
          <input type="date" name="publishedAt" value={form.publishedAt} onChange={handleChange} required />
        </label>
        <button type="submit">Create Post</button>
      </form>
    </section>
  );
}

// Backend BlogPost Setup 

// 1. Create Sequelize Model

//Create 
`models/BlogPost.js`:

module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    excerpt: { type: DataTypes.TEXT, allowNull: true },
    featuredImage: { type: DataTypes.STRING, allowNull: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    publishedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  });

  return BlogPost;
};

// 2. Update Sequelize Initialization

const BlogPostModel = require('./BlogPost');

const BlogPost = BlogPostModel(sequelize, Sequelize.DataTypes);

module.exports = { User, Order, PodDraft, Recommendation, BlogPost }; // Add BlogPost

// 3. Create Migration (Optional but recommended)

//```bash
npx sequelize-cli migration:generate --name create-blogpost

//js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BlogPosts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: { type: Sequelize.STRING, allowNull: false },
      category: { type: Sequelize.STRING, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      excerpt: { type: Sequelize.TEXT },
      featuredImage: { type: Sequelize.STRING },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      publishedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BlogPosts');
  },
};

//Run migration:

``bash
npx sequelize-cli db:migrate

// 4. Add Blog Routes

Create `routes/blog.js`:

const express = require('express');
const { BlogPost } = require('../models');
const authenticateToken = require('../middleware/authenticateToken'); // Your JWT auth middleware
const router = express.Router();

// Public: list posts with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category && category !== 'All' ? { category } : {};
    const posts = await BlogPost.findAll({ where, order: [['publishedAt', 'DESC']] });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public: single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ where: { slug: req.params.slug } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, category, content, excerpt, featuredImage, slug, publishedAt } = req.body;
    if (!title || !category || !content || !slug) return res.status(400).json({ error: 'Missing required fields' });

    const exists = await BlogPost.findOne({ where: { slug } });
    if (exists) return res.status(400).json({ error: 'Slug already exists' });

    const post = await BlogPost.create({ title, category, content, excerpt, featuredImage, slug, publishedAt });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: update post by slug
router.put('/:slug', authenticateToken, async (req, res) => {
  try {
    const post = await BlogPost.findOne({ where: { slug: req.params.slug } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await post.update(req.body);
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: delete post by slug
router.delete('/:slug', authenticateToken, async (req, res) => {
  try {
    const post = await BlogPost.findOne({ where: { slug: req.params.slug } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await post.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// 5. Use Blog Routes in your `server.js`

const blogRoutes = require('./routes/blog');

app.use('/api/blog', blogRoutes);

// 6. Authentication Middleware (If you don’t have it)

Example `middleware/authenticateToken.js`:

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;

//User Profiles

// Step 1: User Profile System

// models/User.js (add these fields)
bio: { type: DataTypes.TEXT, allowNull: true },
avatarUrl: { type: DataTypes.STRING, allowNull: true },
socialLinks: { type: DataTypes.JSON, allowNull: true }, // e.g. { twitter: '', instagram: '' }

//API routes:

 `GET /api/users/me` - get current user profile
 `PUT /api/users/me` - update current user profile

router.get('/me', authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id', 'username', 'email', 'bio', 'avatarUrl', 'socialLinks'] });
  res.json(user);
});

router.put('/me', authenticateToken, async (req, res) => {
  const { bio, avatarUrl, socialLinks } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  await user.update({ bio, avatarUrl, socialLinks });
  res.json(user);
});

// Step 2: Frontend Profile Page

// Step 3: Community Section (Forum)

// models/ForumCategory.js (optional)

module.exports = (sequelize, DataTypes) => {
  const ForumCategory = sequelize.define('ForumCategory', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
  });
  ForumCategory.associate = models => {
    ForumCategory.hasMany(models.Topic);
  };
  return ForumCategory;
};

// models/Topic.js
module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
    title: { type: DataTypes.STRING, allowNull: false },
  });
  Topic.associate = models => {
    Topic.belongsTo(models.User, { foreignKey: 'userId' });
    Topic.belongsTo(models.ForumCategory, { foreignKey: 'categoryId' });
    Topic.hasMany(models.Post);
  };
  return Topic;
};

// models/Post.js
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

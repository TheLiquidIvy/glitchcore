const express = require('express');
const { BlogPost } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
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
    // You could add your checkAdmin middleware here too
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

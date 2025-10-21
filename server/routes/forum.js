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
    include: [{ model: User, attributes: ['id', 'email'] }], // Use email
    order: [['createdAt', 'DESC']],
  });
  res.json(topics);
});

// Get single topic with posts
router.get('/topics/:topicId', async (req, res) => {
  const topic = await Topic.findByPk(req.params.topicId, {
    include: [
      { model: User, attributes: ['id', 'email'] }, // Use email
      { 
        model: Post, 
        include: [{ model: User, attributes: ['id', 'email'] }], // Use email
      },
    ],
    order: [[Post, 'createdAt', 'ASC']], // Order the included Posts
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
    userId: req.userId, // Use req.userId
  });

  // Also create the first post
  await Post.create({
    content,
    topicId: topic.id,
    userId: req.userId, // Use req.userId
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
    userId: req.userId, // Use req.userId
  });

  res.status(201).json(post);
});

module.exports = router;

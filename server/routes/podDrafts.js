// server/routes/podDrafts.js
const express = require('express');
const { PodDraft } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Get all POD drafts for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const drafts = await PodDraft.findAll({ where: { userId: req.userId }, order: [['updatedAt', 'DESC']] });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new POD draft
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newDraft = await PodDraft.create({
      userId: req.userId,
      title,
      imageUrl,
      status: 'draft'
    });

    res.status(201).json(newDraft);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update POD draft
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const draft = await PodDraft.findOne({ where: { id, userId: req.userId } });
    if (!draft) return res.status(404).json({ error: 'Draft not found' });

    const { title, imageUrl, status } = req.body;
    if (title !== undefined) draft.title = title;
    if (imageUrl !== undefined) draft.imageUrl = imageUrl;
    if (status !== undefined) draft.status = status;

    await draft.save();
    res.json(draft);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete POD draft
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const draft = await PodDraft.findOne({ where: { id, userId: req.userId } });
    if (!draft) return res.status(404).json({ error: 'Draft not found' });

    await draft.destroy();
    res.json({ message: 'Draft deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

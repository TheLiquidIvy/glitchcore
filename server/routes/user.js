const express = require('express');
const { User } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// Get current user's profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, { // Use req.userId
      attributes: ['id', 'email', 'bio', 'avatarUrl', 'socialLinks', 'theme'], // Use email
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
    const { bio, avatarUrl, socialLinks, theme } = req.body;
    const user = await User.findByPk(req.userId); // Use req.userId
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate theme (optional)
    const validThemes = ['light', 'dark', 'green', 'pink'];
    if (theme && !validThemes.includes(theme)) {
      return res.status(400).json({ error: 'Invalid theme selected' });
    }

    await user.update({ bio, avatarUrl, socialLinks, theme });
    res.json(user); // Send back updated user
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// server/routes/dashboard.js
const express = require('express');
const { Order, PodDraft, Recommendation, Image, Op } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.findAll({ where: { userId }, order: [['orderDate', 'DESC']] });
    const podDrafts = await PodDraft.findAll({ where: { userId }, order: [['updatedAt', 'DESC']] });

    // Simple recommendation: latest 5 images not purchased
    // NOTE: This logic assumes 'Order' records have a valid 'imageId' field
    const purchasedImageIds = orders.map(o => o.imageId).filter(Boolean);
    const recommendations = await Image.findAll({
      where: { id: { [Op.notIn]: purchasedImageIds } },
      limit: 5
    });

    res.json({ orders, podDrafts, recommendations });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

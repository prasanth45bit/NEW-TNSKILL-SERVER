const express = require('express');
const router = express.Router();
const Tourism = require('../../models/sql/Tourism');

router.post('/', async (req, res) => {
  try {
    const item = await Tourism.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create tourism record' });
  }
});

router.get('/', async (req, res) => {
  try {
    const list = await Tourism.findAll({ order: [['createdAt', 'DESC']], limit: 200 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list tourism records' });
  }
});

module.exports = router;

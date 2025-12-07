const express = require('express');
const router = express.Router();
const Energy = require('../../models/sql/Energy');

router.post('/', async (req, res) => {
  try {
    const item = await Energy.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create energy record' });
  }
});

router.get('/', async (req, res) => {
  try {
    const list = await Energy.findAll({ order: [['createdAt', 'DESC']], limit: 200 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list energy records' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Transport = require('../../models/sql/Transport');

router.post('/', async (req, res) => {
  try {
    const item = await Transport.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create transport record' });
  }
});

router.get('/', async (req, res) => {
  try {
    const list = await Transport.findAll({ order: [['createdAt', 'DESC']], limit: 200 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list transport records' });
  }
});

module.exports = router;

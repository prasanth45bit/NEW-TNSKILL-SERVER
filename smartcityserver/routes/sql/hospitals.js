const express = require('express');
const router = express.Router();
const Hospital = require('../../models/sql/Hospital');

router.post('/', async (req, res) => {
  try {
    const item = await Hospital.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create hospital' });
  }
});

router.get('/', async (req, res) => {
  try {
    const list = await Hospital.findAll({ order: [['createdAt', 'DESC']], limit: 200 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list hospitals' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const School = require('../../models/sql/School');

router.post('/', async (req, res) => {
  try {
    const school = await School.create(req.body);
    res.status(201).json(school);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create school' });
  }
});

router.get('/', async (req, res) => {
  try {
    const list = await School.findAll({ order: [['createdAt', 'DESC']], limit: 200 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list schools' });
  }
});

module.exports = router;

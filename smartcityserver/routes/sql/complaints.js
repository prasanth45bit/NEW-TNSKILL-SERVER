const express = require('express');
const router = express.Router();
const Complaint = require('../../models/sql_v2/Complaint');
const User = require('../../models/sql_v2/User');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../../middleware/auth');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Create complaint (public). If Authorization header present, attach reporter info.
router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body };
    // If token present, try to set reporterId and reporterName
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      try {
        const token = auth.split(' ')[1];
        const p = jwt.verify(token, JWT_SECRET);
        if (p && p.id) {
          payload.reporterId = p.id;
          if (!payload.reporterName) {
            const reporter = await User.findByPk(p.id);
            if (reporter) payload.reporterName = reporter.name || reporter.email;
          }
        }
      } catch (e) {
        // ignore invalid token for create (treat as anonymous)
      }
    }

    const complaint = await Complaint.create(payload);
    res.status(201).json(complaint);
  } catch (err) {
    console.error('Create complaint error:', err);
    res.status(500).json({ error: 'Failed to create complaint' });
  }
});

// List complaints (supports ?status=open)
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    const list = await Complaint.findAll({ where, order: [['createdAt', 'DESC']], limit: 1000 });
    res.json(list);
  } catch (err) {
    console.error('List complaints error:', err);
    res.status(500).json({ error: 'Failed to list complaints' });
  }
});

// Update complaint status / fields (requires authentication)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const complaint = await Complaint.findByPk(id);
    if (!complaint) return res.status(404).json({ error: 'Not found' });

    // Authorization: admin OR reporter OR assignedTo
    const user = req.user; // set by authMiddleware
    const allowed = user.role === 'admin' || user.id === complaint.reporterId || user.id === complaint.assignedTo;
    if (!allowed) return res.status(403).json({ error: 'forbidden' });

    await complaint.update(req.body);
    res.json(complaint);
  } catch (err) {
    console.error('Update complaint error:', err);
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

module.exports = router;

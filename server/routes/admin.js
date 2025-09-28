const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authAdmin = require('../middleware/authAdmin');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.isAdmin) return res.status(403).json({ message: 'Not admin' });

  const token = jwt.sign({ id: user._id, email: user.email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, admin: { id: user._id, email: user.email, name: user.name } });
});

// GET /api/admin/orders
router.get('/orders', authAdmin, async (req, res) => {
  const { status, page = 1, limit = 25 } = req.query;
  const query = {};
  if (status) query.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Order.countDocuments(query);
  res.json({ orders, total });
});

// GET /api/admin/orders/:id
router.get('/orders/:id', authAdmin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', authAdmin, async (req, res) => {
  const { status } = req.body;
  const allowed = ['Pending','Processing','Shipped','Delivered','Cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  await order.save();
  res.json(order);
});

module.exports = router;

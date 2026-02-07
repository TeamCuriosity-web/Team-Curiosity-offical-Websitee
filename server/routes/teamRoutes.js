const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/team
// @desc    Get all team members (excluding sensitive info)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Return all users, usually you might filter by { role: { $ne: 'admin' } } or similar if needed.
    // For now, return all, but select specific fields for public view
    const team = await User.find().select('-password -__v').sort({ joinedAt: 1 });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

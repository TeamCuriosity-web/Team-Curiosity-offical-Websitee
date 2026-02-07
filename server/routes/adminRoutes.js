const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const InviteLink = require('../models/InviteLink');
const crypto = require('crypto');

// @desc    Generate Invite Link
// @route   POST /api/admin/invite
// @access  Private/Admin
router.post('/invite', protect, admin, async (req, res) => {
  try {
    const token = crypto.randomBytes(16).toString('hex');
    const { expiresInHours } = req.body; // Optional expiry

    let expiresAt = null;
    if (expiresInHours) {
        expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expiresInHours);
    }

    const invite = await InviteLink.create({
      token,
      expiresAt,
    });

    // Use environment variable or default to production URL
    const clientUrl = process.env.CLIENT_URL || 'https://TeamCuriosity-web.github.io/Team-Curiosity-offical-Websitee';
    res.status(201).json({ 
        inviteLink: `${clientUrl}/join?token=${token}`,
        token,
        expiresAt 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Methods to Manage Users (Delete)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update User Role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.role = req.body.role || user.role;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

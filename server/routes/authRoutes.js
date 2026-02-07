const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InviteLink = require('../models/InviteLink');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (Requires Invite Token)
router.post('/register', async (req, res) => {
  console.log("Register Request Body:", req.body); // DEBUGGING
  const { name, email, password, inviteToken } = req.body;

  try {
    // 1. Validate Invite Token
    // Special case: If NO users exist, allow first registration as Admin without token
    const userCount = await User.countDocuments({});
    
    if (userCount > 0) {
        if (!inviteToken) {
            return res.status(400).json({ message: 'Invite Token Required' });
        }
        const invite = await InviteLink.findOne({ token: inviteToken, isValid: true });
        
        if (!invite) {
            return res.status(400).json({ message: 'Invalid or Expired Invite Token' });
        }
        
        if (invite.expiresAt && invite.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'Invite Token Expired' });
        }

        // Invalidate token
        invite.isValid = false;
        invite.save(); // Don't await, let it handle in background or await if critical
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // First user is always Admin
    const role = userCount === 0 ? 'admin' : 'member';

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Mark invite as used by this user
    if (userCount > 0 && req.body.inviteToken) {
       await InviteLink.findOneAndUpdate({ token: req.body.inviteToken }, { usedBy: user._id });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        profileImage: user.profileImage,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

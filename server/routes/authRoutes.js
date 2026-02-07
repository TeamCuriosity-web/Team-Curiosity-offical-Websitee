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
// @access  Public
router.post('/register', async (req, res) => {
  console.log("Register Request Body:", req.body);
  const { 
    name, email, password, inviteToken,
    avatar, college, branch, section, programmingLanguages 
  } = req.body;

  try {
    const userCount = await User.countDocuments({});
    
    // Logic:
    // 1. First user is SuperAdmin/Admin -> Approved
    // 2. Verified Invite Token -> Approved
    // 3. No Token/Public -> Pending Approval (isApproved: false)

    let isApproved = false;
    let role = 'member';

    if (userCount === 0) {
        isApproved = true;
        role = 'admin'; // First user is admin
    } else {
        if (inviteToken) {
            const invite = await InviteLink.findOne({ token: inviteToken, isValid: true });
            
            if (!invite) {
                return res.status(400).json({ message: 'Invalid or Expired Invite Token' });
            }
            
            if (invite.expiresAt && invite.expiresAt < Date.now()) {
                return res.status(400).json({ message: 'Invite Token Expired' });
            }

            // Valid Invite -> Approve
            isApproved = true;
            
            // Invalidate token
            invite.isValid = false;
            await invite.save();
        } else {
            // No token -> Public Registration -> Pending Approval
            isApproved = false;
        }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar,
      college,
      branch,
      section,
      programmingLanguages,
      isApproved,
      // Default profile image to avatar if selected, or dicebear fallback
      profileImage: avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${name}` 
    });

    // Mark invite as used if applicable
    if (inviteToken) {
       await InviteLink.findOneAndUpdate({ token: inviteToken }, { usedBy: user._id });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved, // Frontend needs this to decide redirect
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
  const { email, password, inviteToken } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      
      // Check for invite token to upgrade status
      if (inviteToken && !user.isApproved) {
           const invite = await InviteLink.findOne({ token: inviteToken, isValid: true });
           if (invite) {
                if (!invite.expiresAt || invite.expiresAt > Date.now()) {
                    user.isApproved = true;
                    await user.save();
                    
                    // Invalidate token
                    invite.isValid = false;
                    invite.usedBy = user._id;
                    await invite.save();
                }
           }
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
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

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
    avatar, college, branch, section, programmingLanguages,
    github, linkedin
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
      github,
      linkedin,
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
        college: user.college,
        branch: user.branch,
        section: user.section,
        programmingLanguages: user.programmingLanguages,
        github: user.github,
        linkedin: user.linkedin,
        bio: user.bio,
        avatar: user.avatar
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
router.put('/updatedetails', async (req, res) => {
    // Basic middleware replacement since we don't have the middleware imported yet
    // Real app should use auth middleware. For now assuming client sends ID in body or we parse it
    // Actually, let's look at how we can get the user.
    // If not using middleware, we usually expect a header.
    // Let's assume the client sends the ID to update or we trust the request for now if header is checked elsewhere.
    // Ideally: Use the 'protect' middleware.
    
    // Quick fix: Require ID in body for now, or just trust the update if we assume protected by frontend (NOT SECURE but matches current pattern if middleware isn't here).
    // BETTER: Import verifyToken if available. 
    // Let's check imports. Just 'jwt' and models. 
    
    // Simple verify logic inline
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.college = req.body.college || user.college;
            user.branch = req.body.branch || user.branch;
            user.section = req.body.section || user.section;
            user.github = req.body.github || user.github;
            user.linkedin = req.body.linkedin || user.linkedin;
            
            if (req.body.programmingLanguages) {
                 user.programmingLanguages = req.body.programmingLanguages; // Expect array or handle split
            }
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id),
                isApproved: updatedUser.isApproved,
                profileImage: updatedUser.profileImage,
                college: updatedUser.college,
                branch: updatedUser.branch,
                section: updatedUser.section,
                programmingLanguages: updatedUser.programmingLanguages,
                github: updatedUser.github,
                linkedin: updatedUser.linkedin,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});

module.exports = router;

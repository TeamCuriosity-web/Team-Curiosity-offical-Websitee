const express = require('express');
const router = express.Router();
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const InviteLink = require('../models/InviteLink');
const crypto = require('crypto');

// ... (keep invite route as is, it uses 'admin') ...

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
// @access  Private/SuperAdmin
router.delete('/users/:id', protect, superAdmin, async (req, res) => {
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

// @desc    Approve a User
// @route   PUT /api/admin/users/:id/approve
// @access  Private/Admin
router.put('/users/:id/approve', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isApproved = true;
            await user.save();
            res.json({ message: 'User approved', user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update User Role
// @route   PUT /api/admin/users/:id/role
// @access  Private/SuperAdmin
router.put('/users/:id/role', protect, superAdmin, async (req, res) => {
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

// @desc    Create New Admin (Direct Provisioning)
// @route   POST /api/admin/create-admin
// @access  Private/SuperAdmin
router.post('/create-admin', protect, superAdmin, async (req, res) => {
    try {
        const { name, email } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and Email are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Auto-generate password: firstname123 (or random specific string if preferred)
        // Simple strategy: first name lowercase + 123
        const generatedPassword = `${name.split(' ')[0].toLowerCase()}123`;

        const user = await User.create({
            name,
            email,
            password: generatedPassword,
            role: 'admin'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                generatedPassword: generatedPassword // Return this ONCE for display
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Generate Invite Link
// @route   POST /api/admin/invite
// @access  Private/Admin
router.post('/invite', protect, admin, async (req, res) => {
    try {
        const { expiresInHours } = req.body;
        const token = crypto.randomBytes(20).toString('hex');
        
        // Default 24 hours if not specified
        const expires = new Date(Date.now() + (expiresInHours || 24 || 24) * 60 * 60 * 1000); 

        await InviteLink.create({
            token,
            expiresAt: expires,
            createdBy: req.user._id
        });

        // Return the full link (frontend will handle domain adjustment)
        // We return a generic structure, frontend can adjust origin
        res.json({ 
            inviteLink: `${req.protocol}://${req.get('host')}/invite?token=${token}`,
            token,
            expiresAt: expires
        });
// @desc    Get System Status (GitHub Token Connectivity)
// @route   GET /api/admin/system-status
// @access  Private/Admin
router.get('/system-status', protect, admin, async (req, res) => {
    try {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            return res.json({ 
                githubConnected: false, 
                status: 'OFFLINE',
                message: 'GITHUB_TOKEN not found in system environment.' 
            });
        }

        // Mask token for security: ghp_...abcd
        const maskedToken = `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
        
        res.json({
            githubConnected: true,
            status: 'ACTIVE',
            maskedToken: maskedToken,
            org: "TeamCuriosity-web"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

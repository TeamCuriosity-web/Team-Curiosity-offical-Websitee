const express = require('express');
const router = express.Router();
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const InviteLink = require('../models/InviteLink');
const AuditLog = require('../models/AuditLog');
const FeatureFlag = require('../models/FeatureFlag');
const { logAudit } = require('../middleware/auditMiddleware');
const crypto = require('crypto');

// --- SUPER ADMIN ROUTES (Strict Access) ---

// @desc    Get all users (Super Admin only for full details)
// @route   GET /api/admin/users
// @access  Private/SuperAdmin
router.get('/users', protect, superAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
// @access  Private/SuperAdmin
router.delete('/users/:id', protect, superAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            // Audit Log
            await logAudit(req, 'DELETE_USER', 'User', user._id, { deletedUserEmail: user.email });
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
// @access  Private/SuperAdmin
router.put('/users/:id/role', protect, superAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const oldRole = user.role;
            user.role = req.body.role || user.role;
            const updatedUser = await user.save();
            
            // Audit Log
            await logAudit(req, 'UPDATE_ROLE', 'User', user._id, { oldRole, newRole: user.role });
            
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Generate Invite Link
// @route   POST /api/admin/invite
// @access  Private/Admin (Admins can recruit members)
router.post('/invite', protect, admin, async (req, res) => {
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresInHours = req.body.expiresInHours || 24;
        const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

        const invite = await InviteLink.create({
            token,
            expiresAt,
            createdBy: req.user._id,
            createdByName: req.user.name
        });

        await logAudit(req, 'GENERATE_INVITE', 'InviteLink', invite._id, { expiresAt });

        const inviteLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/join?token=${token}`;
        res.status(201).json({ inviteLink, expiresAt });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Audit Logs
// @route   GET /api/admin/audit-logs
// @access  Private/SuperAdmin
router.get('/audit-logs', protect, superAdmin, async (req, res) => {
    try {
        const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Feature Flags
// @route   GET /api/admin/features
// @access  Private/SuperAdmin
router.get('/features', protect, superAdmin, async (req, res) => {
    try {
        const features = await FeatureFlag.find({});
        res.json(features);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Toggle Feature Flag
// @route   PUT /api/admin/features/:id
// @access  Private/SuperAdmin
router.put('/features/:id', protect, superAdmin, async (req, res) => {
    try {
        const feature = await FeatureFlag.findById(req.params.id);
        if (feature) {
            feature.isEnabled = !feature.isEnabled;
            feature.updatedBy = req.user._id;
            feature.updatedAt = Date.now();
            await feature.save();

            await logAudit(req, 'TOGGLE_FEATURE', 'FeatureFlag', feature._id, { name: feature.name, newState: feature.isEnabled });
            res.json(feature);
        } else {
            res.status(404).json({ message: 'Feature not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- STANDARD ADMIN ROUTES (Content Only) ---

// (Project, Hackathon, Mission routes should be in their respective files or here if simple)
// Logic for those is usually in separate route files, protected by 'admin' middleware.
// We strictly removed user/role logic from 'admin' access level.

module.exports = router;

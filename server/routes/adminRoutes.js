const express = require('express');
const router = express.Router();
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const InviteLink = require('../models/InviteLink');
const crypto = require('crypto');






router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




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
                generatedPassword: generatedPassword 
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




router.post('/invite', protect, admin, async (req, res) => {
    try {
        const { expiresInHours } = req.body;
        const token = crypto.randomBytes(20).toString('hex');
        
        
        const expires = new Date(Date.now() + (expiresInHours || 24 || 24) * 60 * 60 * 1000); 

        await InviteLink.create({
            token,
            expiresAt: expires,
            createdBy: req.user._id
        });

        
        
        res.json({ 
            inviteLink: `${req.protocol}://${req.get('host')}/invite?token=${token}`,
            token,
            expiresAt: expires
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




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

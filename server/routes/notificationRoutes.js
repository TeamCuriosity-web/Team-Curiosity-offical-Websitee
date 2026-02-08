const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/notifications
// @desc    Send a notification/message
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { message, type, recipient } = req.body;
    
    let verifiedRecipient = recipient;

    // Logic: 
    // SuperAdmin/Admin can send to 'all', 'admin', or specific user.
    // Member/User can ONLY send to 'admin'.

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        // Force recipient to admin if normal user
        verifiedRecipient = 'admin';
    } 
    // If admin is sending, we respect their choice (e.g., 'all')

    const newNotification = new Notification({
      message,
      type: type || 'message',
      sender: req.user.id,
      recipient: verifiedRecipient || 'admin'
    });

    const savedNotification = await newNotification.save();
    res.json(savedNotification);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/notifications
// @desc    Get notifications for the current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Base query: Messages sent SPECIFICALLY to this user OR broadcast to 'all'
    const orConditions = [
        { recipient: req.user.id },
        { recipient: 'all' }
    ];

    // If Admin/SuperAdmin, ALSO fetch messages sent to 'admin'
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
        orConditions.push({ recipient: 'admin' });
    }

    query = { $or: orConditions };

    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .populate('sender', 'name email'); // Get sender details

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        // Check if user is authorized to mark this as read
        // (Is recipient or is admin and recipient is 'admin')
        const isRecipient = notification.recipient.toString() === req.user.id;
        const isAdminRecipient = notification.recipient === 'admin' && (req.user.role === 'admin' || req.user.role === 'super-admin');

        if (!isRecipient && !isAdminRecipient) {
             return res.status(401).json({ msg: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

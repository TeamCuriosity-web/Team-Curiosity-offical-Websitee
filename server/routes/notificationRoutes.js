const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');




router.post('/', protect, async (req, res) => {
  try {
    const { message, type, recipient } = req.body;
    
    let verifiedRecipient = recipient;

    
    
    

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        
        verifiedRecipient = 'admin';
    } 
    

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




router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    
    const orConditions = [
        { recipient: req.user.id },
        { recipient: 'all' }
    ];

    
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
        orConditions.push({ recipient: 'admin' });
    }

    query = { $or: orConditions };

    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .populate('sender', 'name email'); 

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        
        
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

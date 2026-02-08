const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/chat/history
// @desc    Get recent chat messages
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { room } = req.query;
    const query = room ? { room } : { room: 'general' };
    
    // Fetch last 50 messages
    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('sender', 'name email profileImage role');
      
    // Reverse to show oldest first in chat window
    res.json(messages.reverse());
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/chat/clear
// @desc    Clear all chat history
// @access  Private/SuperAdmin
router.delete('/clear', protect, async (req, res) => {
    // strict check for superadmin
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ msg: 'Not authorized. Super Admin clearance required.' });
    }

    try {
        await Message.deleteMany({});
        
        // Optional: Emit socket event to clear frontend immediately if we had the io instance
        // req.app.get('io').emit('chat_cleared'); 
        
        res.json({ msg: 'Global chat history purged.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

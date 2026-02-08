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

module.exports = router;

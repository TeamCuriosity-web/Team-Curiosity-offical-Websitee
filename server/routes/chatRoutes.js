const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');




router.get('/history', protect, async (req, res) => {
  try {
    const { room } = req.query;
    const query = room ? { room } : { room: 'general' };
    
    
    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('sender', 'name email profileImage role');
      
    
    res.json(messages.reverse());
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




router.delete('/clear', protect, async (req, res) => {
    
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ msg: 'Not authorized. Super Admin clearance required.' });
    }

    try {
        await Message.deleteMany({});
        
        
        
        
        res.json({ msg: 'Global chat history purged.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

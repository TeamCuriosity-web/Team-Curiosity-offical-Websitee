const express = require('express');
const router = express.Router();
const Hackathon = require('../models/Hackathon');
const { protect, admin } = require('../middleware/authMiddleware');




router.get('/', async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ date: -1 });
    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});




router.post('/', protect, admin, async (req, res) => {
  try {
    const newHackathon = new Hackathon(req.body);
    const hackathon = await newHackathon.save();
    res.json(hackathon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});




router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });

    await hackathon.deleteOne();
    res.json({ message: 'Hackathon removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

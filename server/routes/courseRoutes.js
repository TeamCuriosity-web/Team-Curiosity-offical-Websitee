const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all courses (with optional domain filter)
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { domain } = req.query;
    const query = domain ? { domain } : {};
    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, youtubeLink, youtubeId, thumbnailUrl, domain, instructor, duration } = req.body;

    if (!title || !youtubeLink || !youtubeId || !thumbnailUrl || !domain) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const courseExists = await Course.findOne({ youtubeId });
    if (courseExists) {
      return res.status(400).json({ message: 'Course already exists' });
    }

    const course = await Course.create({
      title,
      youtubeLink,
      youtubeId,
      thumbnailUrl,
      domain,
      instructor,
      duration
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      await course.deleteOne();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

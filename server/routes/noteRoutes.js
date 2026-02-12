const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { domain } = req.query;
    const query = domain ? { domain } : {};
    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, pdfUrl, domain, author } = req.body;

    if (!title || !pdfUrl) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const note = await Note.create({
      title,
      description,
      pdfUrl,
      domain,
      author: author || 'Team Curiosity'
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { title, description, pdfUrl, domain, author } = req.body;
    const note = await Note.findById(req.params.id);

    if (note) {
      note.title = title || note.title;
      note.description = description || note.description;
      note.pdfUrl = pdfUrl || note.pdfUrl;
      note.domain = domain || note.domain;
      note.author = author || note.author;

      const updatedNote = await note.save();
      res.json(updatedNote);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      await note.deleteOne();
      res.json({ message: 'Note removed' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

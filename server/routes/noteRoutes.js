const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect, admin } = require('../middleware/authMiddleware');




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

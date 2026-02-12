const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  pdfUrl: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    enum: ['Frontend', 'Backend', 'Other'],
    default: 'Frontend'
  },
  author: {
    type: String,
    default: 'Team Curiosity'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', noteSchema);

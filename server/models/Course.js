const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  youtubeLink: {
    type: String,
    required: true,
    unique: true
  },
  youtubeId: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    enum: ['Frontend', 'Backend'],
    required: true
  },
  instructor: {
    type: String,
    default: 'Team Curiosity'
  },
  duration: {
    type: String,
    default: 'Unknown'
  },
  rating: {
    type: String,
    default: '4.8'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);

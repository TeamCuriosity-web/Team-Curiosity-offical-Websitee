const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  techStack: [{ type: String }],
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'ongoing' },
  progress: { type: Number, default: 0 },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'legendary'], default: 'intermediate' },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  repoLink: { type: String },
  liveLink: { type: String },
  thumbnail: { type: String }, // URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);

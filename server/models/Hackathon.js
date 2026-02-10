const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'won'], default: 'upcoming' },
  achievement: { type: String }, // e.g., "1st Place", "Finalist"
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  link: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hackathon', hackathonSchema);
